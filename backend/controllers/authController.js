import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { isDatabaseConnected } from "../config/db.js";
import User from "../models/User.js";
import { persistAvatarImage } from "../utils/imageStorage.js";

const users = [];
let idCounter = 1;

const seedMemoryUsers = async () => {
  if (users.length > 0) {
    return;
  }

  const demoBuyerPassword = await bcrypt.hash("demo123", 10);
  const demoSellerPassword = await bcrypt.hash("seller123", 10);

  users.push(
    {
      id: String(idCounter++),
      name: "Demo User",
      email: "demo@example.com",
      password: demoBuyerPassword,
      role: "buyer",
      shopName: "",
      avatar: "",
      phone: "",
      about: "",
    },
    {
      id: String(idCounter++),
      name: "Demo Seller",
      email: "seller@example.com",
      password: demoSellerPassword,
      role: "seller",
      shopName: "Demo Seller Studio",
      avatar: "",
      phone: "",
      about: "",
    }
  );
};

export const ensureDemoUsers = async () => {
  await seedMemoryUsers();

  if (!isDatabaseConnected()) {
    return;
  }

  const demoAccounts = [
    {
      name: "Demo User",
      email: "demo@example.com",
      password: "demo123",
      role: "buyer",
      shopName: "",
      avatar: "",
      phone: "",
      about: "",
    },
    {
      name: "Demo Seller",
      email: "seller@example.com",
      password: "seller123",
      role: "seller",
      shopName: "Demo Seller Studio",
      avatar: "",
      phone: "",
      about: "",
    },
  ];

  for (const account of demoAccounts) {
    const existingUser = await User.findOne({ email: account.email });

    if (existingUser) {
      continue;
    }

    const hashedPassword = await bcrypt.hash(account.password, 10);

    await User.create({
      name: account.name,
      email: account.email,
      password: hashedPassword,
      role: account.role,
      shopName: account.shopName,
      avatar: account.avatar,
      phone: account.phone,
      about: account.about,
    });
  }
};

await seedMemoryUsers();

const toPublicImageUrl = (image) => {
  if (!image) {
    return "";
  }

  if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("data:")) {
    return image;
  }

  return `http://localhost:5000${image}`;
};

const sanitizeUser = (user) => ({
  id: user._id?.toString?.() || String(user.id),
  name: user.name,
  email: user.email,
  role: user.role || "buyer",
  shopName: user.shopName || "",
  avatar: toPublicImageUrl(user.avatar || ""),
  phone: user.phone || "",
  about: user.about || "",
  createdAt: user.createdAt || undefined,
});

const generateToken = (user) =>
  jwt.sign(
    {
      id: user._id?.toString?.() || String(user.id),
      email: user.email,
      name: user.name,
      role: user.role || "buyer",
      shopName: user.shopName || "",
    },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "1h" }
  );

const findMemoryUserByEmail = (email) =>
  users.find((user) => user.email.toLowerCase() === email.toLowerCase());

export const register = async (req, res) => {
  try {
    const { name, email, password, role = "buyer", shopName = "", avatar = "", phone = "", about = "" } = req.body;
    const normalizedRole = role === "seller" ? "seller" : "buyer";

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    if (normalizedRole === "seller" && !shopName?.trim()) {
      return res.status(400).json({ message: "Shop name is required for sellers" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (isDatabaseConnected()) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });

      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: normalizedRole,
        shopName: normalizedRole === "seller" ? shopName.trim() : "",
        avatar: persistAvatarImage(avatar || ""),
        phone: phone || "",
        about: about || "",
      });

      return res.status(201).json({
        token: generateToken(user),
        user: sanitizeUser(user),
      });
    }

    const existingUser = findMemoryUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = {
      id: String(idCounter++),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: normalizedRole,
      shopName: normalizedRole === "seller" ? shopName.trim() : "",
      avatar: persistAvatarImage(avatar || ""),
      phone: phone || "",
      about: about || "",
      createdAt: new Date().toISOString(),
    };

    users.push(user);

    return res.status(201).json({
      token: generateToken(user),
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error("register error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    let user;

    if (isDatabaseConnected()) {
      user = await User.findOne({ email: email.toLowerCase() });
    } else {
      user = findMemoryUserByEmail(email);
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (role && user.role !== role) {
      return res.status(403).json({ message: `This account is registered as a ${user.role}` });
    }

    return res.json({
      token: generateToken(user),
      user: sanitizeUser(user),
    });
  } catch (err) {
    console.error("login error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getCurrentUser = async (req, res) => {
  return res.json({ user: req.user });
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone = "", about = "", avatar = "", shopName = "" } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (isDatabaseConnected()) {
      const updates = {
        name: name.trim(),
        phone: phone.trim(),
        about: about.trim(),
        avatar: persistAvatarImage(avatar || "", req.user.avatar || ""),
      };

      if (req.user.role === "seller") {
        updates.shopName = shopName?.trim() || "";
      }

      const user = await User.findByIdAndUpdate(req.user.id, updates, {
        new: true,
        runValidators: true,
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json({
        token: generateToken(user),
        user: sanitizeUser(user),
      });
    }

    const user = users.find((item) => String(item.id) === String(req.user.id));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name.trim();
    user.phone = phone.trim();
    user.about = about.trim();
    user.avatar = persistAvatarImage(avatar || "", user.avatar || "");
    if (user.role === "seller") {
      user.shopName = shopName?.trim() || "";
    }

    return res.json({
      token: generateToken(user),
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("update profile error", error);
    return res.status(500).json({ message: "Failed to update profile" });
  }
};
