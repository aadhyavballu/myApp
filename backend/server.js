const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
const SECRET = "mysecretkey"; // later move to .env

// Temporary DB
let users = [];

// ✅ Health check
app.get('/', (req, res) => {
  res.send("Backend running 🚀");
});

// ✅ SIGNUP
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const userExists = users.find(u => u.email === email);
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: hashedPassword,
    };

    users.push(newUser);

    res.json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Signup error" });
  }
});

// ✅ LOGIN
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { email: user.email },
      SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
});

// 🔒 MIDDLEWARE (protect routes)
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

// 🔒 PROTECTED ROUTE
app.get('/profile', authMiddleware, (req, res) => {
  res.json({
    message: "Protected data",
    user: req.user
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});