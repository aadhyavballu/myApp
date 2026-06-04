require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = process.env.JWT_SECRET || "mysecretkey";
const PORT = process.env.PORT || 5000;

let users = [];
let products = [];
let orders = [];

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

const buildImpactSummary = (itemsSold) => {
  const co2Saved = +(itemsSold * 6.6).toFixed(1);
  const energySaved = +(itemsSold * 5.5).toFixed(1);
  const waterSaved = itemsSold * 100;
  const treesProtected = Math.floor(itemsSold / 3);
  const landfill = +(itemsSold * 2.5).toFixed(1);
  const impactScore = itemsSold >= 50 ? "A+" : itemsSold >= 30 ? "A" : itemsSold >= 15 ? "B+" : itemsSold >= 5 ? "B" : "C";

  return {
    itemsSold,
    co2Saved,
    energySaved,
    waterSaved,
    treesProtected,
    landfill,
    impactScore,
    materialBreakdown: [
      { label: "Plastic", pct: Math.min(Math.round(itemsSold * 0.4 * 10), 100) },
      { label: "Paper", pct: Math.min(Math.round(itemsSold * 0.25 * 10), 100) },
      { label: "Metal", pct: Math.min(Math.round(itemsSold * 0.2 * 10), 100) },
      { label: "Glass", pct: Math.min(Math.round(itemsSold * 0.1 * 10), 100) },
      { label: "E-Waste", pct: Math.min(Math.round(itemsSold * 0.05 * 10), 100) },
    ],
  };
};

app.get("/", (req, res) => res.send("Backend running 🚀"));

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });
    if (users.find((u) => u.email === email)) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { id: Date.now().toString(), name, email, password: hashedPassword, role: role || "buyer" };

    users.push(user);

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: "1d" });

    res.status(201).json({
      message: "User created successfully",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email);

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: "1d" });

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/products/add", authMiddleware, (req, res) => {
  try {
    if (req.user.role !== "seller") return res.status(403).json({ message: "Only sellers can add products" });

    const { name, price, description } = req.body;
    const product = { id: Date.now().toString(), name, price, description, sellerId: req.user.id };

    products.push(product);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error adding product" });
  }
});

app.get("/products", (req, res) => res.json(products));

app.post("/orders/buy", (req, res) => {
  try {
    const { productId, sellerId, buyerId, price, material } = req.body;
    const product = productId ? products.find((p) => p.id === productId) : null;

    if (!product && (!sellerId || typeof price !== "number")) {
      return res.status(400).json({ message: "Product or sellerId and price are required" });
    }

    const order = {
      id: Date.now().toString(),
      productId: product?.id || null,
      buyerId: buyerId || "anonymous",
      sellerId: product?.sellerId || sellerId,
      price: product?.price || price,
      material: product?.material || material || "unknown",
      createdAt: new Date().toISOString(),
    };

    orders.push(order);

    res.json({ message: "Purchase recorded", order });
  } catch (err) {
    res.status(500).json({ message: "Error buying product" });
  }
});

app.get("/earnings", authMiddleware, (req, res) => {
  try {
    const sellerOrders = orders.filter((o) => o.sellerId === req.user.id);
    const total = sellerOrders.reduce((sum, o) => sum + o.price, 0);

    res.json({ total, orders: sellerOrders });
  } catch (err) {
    res.status(500).json({ message: "Error fetching earnings" });
  }
});

app.get("/impact", (req, res) => {
  try {
    const itemsSold = orders.length;
    res.json(buildImpactSummary(itemsSold));
  } catch (err) {
    res.status(500).json({ message: "Error fetching impact data" });
  }
});

app.post("/scan-ai", async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) return res.status(400).json({ message: "Image required" });

    const fallback = { label: "unknown scrap item", category: "Plastic", raw: "fallback" };
    if (!process.env.OPENAI_API_KEY) {
      return res.json(fallback);
    }

    const promptText = `You are a waste-sorting assistant. Identify the main waste item in the provided image and map it to one of these categories: Plastic, Paper, Metal, Glass, E-Waste. Output only valid JSON with keys \"label\" and \"category\".`;
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "user",
            content: [
              { type: "input_text", text: promptText },
              { type: "input_image", image: { b64_json: imageBase64 } },
            ],
          },
        ],
      }),
    });

    const scanData = await response.json();
    const rawText = (scanData?.output?.[0]?.content || [])
      .map((item) => item?.text || "")
      .join(" ")
      .trim();

    let parsed = fallback;
    if (rawText) {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsedJson = JSON.parse(jsonMatch[0]);
          parsed = {
            label: parsedJson.label || fallback.label,
            category: parsedJson.category || fallback.category,
            raw: rawText,
          };
        } catch (parseError) {
          console.log("scan-ai parse error", parseError);
        }
      }
    }

    return res.json(parsed);
  } catch (err) {
    console.log("scan-ai error", err);
    res.json({ label: "unknown scrap item", category: "Plastic", raw: "error" });
  }
});

app.get("/profile", authMiddleware, (req, res) => res.json({ message: "Protected data", user: req.user }));

app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
