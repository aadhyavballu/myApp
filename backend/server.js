<<<<<<< HEAD
=======
require("dotenv").config();
>>>>>>> 9e37785 (initial commit)
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

<<<<<<< HEAD
const PORT = 5000;
const SECRET = "mysecretkey";

// ===== TEMP DATABASE =====
=======
const SECRET = process.env.JWT_SECRET || "mysecretkey";
>>>>>>> 9e37785 (initial commit)
let users = [];
let products = [];
let orders = [];

<<<<<<< HEAD
// =========================
// ✅ HEALTH
// =========================
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// =========================
// 🔐 AUTH MIDDLEWARE
// =========================
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// =========================
// ✅ SIGNUP
// =========================
=======
>>>>>>> 9e37785 (initial commit)
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

<<<<<<< HEAD
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const userExists = users.find((u) => u.email === email);
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      role: role || "buyer", // buyer / seller
    };

    users.push(newUser);

    res.json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Signup error" });
  }
});

// =========================
// ✅ LOGIN
// =========================
=======
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    if (users.find((u) => u.email === email))
      return res.status(400).json({ message: "User already exists" });

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

>>>>>>> 9e37785 (initial commit)
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);
<<<<<<< HEAD
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      SECRET,
      { expiresIn: "1d" }
    );
=======
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET, { expiresIn: "1d" });
>>>>>>> 9e37785 (initial commit)

    res.json({
      message: "Login successful",
      token,
<<<<<<< HEAD
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
});

// =========================
// 🧑‍💼 SELLER: ADD PRODUCT
// =========================
app.post("/products/add", authMiddleware, (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Only sellers can add products" });
    }

    const { name, price, description } = req.body;

    const product = {
      id: Date.now().toString(),
      name,
      price,
      description,
      sellerId: req.user.id,
    };

    products.push(product);

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error adding product" });
  }
});

// =========================
// 🛒 MARKETPLACE
// =========================
app.get("/products", (req, res) => {
  res.json(products);
});

// =========================
// 🛍️ BUY PRODUCT
// =========================
app.post("/orders/buy", authMiddleware, (req, res) => {
  try {
    const { productId } = req.body;

    const product = products.find((p) => p.id === productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const order = {
      id: Date.now().toString(),
      productId: product.id,
      buyerId: req.user.id,
      sellerId: product.sellerId,
      price: product.price,
    };

    orders.push(order);

    res.json({ message: "Purchase successful", order });
  } catch (err) {
    res.status(500).json({ message: "Error buying product" });
  }
});

// =========================
// 💰 EARNINGS (SELLER)
// =========================
app.get("/earnings", authMiddleware, (req, res) => {
  try {
    const sellerOrders = orders.filter(
      (o) => o.sellerId === req.user.id
    );

    const total = sellerOrders.reduce((sum, o) => sum + o.price, 0);

    res.json({
      total,
      orders: sellerOrders,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching earnings" });
  }
});

// =========================
// 👤 PROFILE
// =========================
app.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected data",
    user: req.user,
  });
});

// =========================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
=======
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
>>>>>>> 9e37785 (initial commit)
