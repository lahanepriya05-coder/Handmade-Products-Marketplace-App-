import jwt from "jsonwebtoken";
import { isDatabaseConnected } from "../config/db.js";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    if (isDatabaseConnected()) {
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        shopName: user.shopName || "",
        avatar: user.avatar || "",
        phone: user.phone || "",
        about: user.about || "",
        createdAt: user.createdAt || undefined,
      };
    } else {
      req.user = {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
        shopName: decoded.shopName || "",
        avatar: decoded.avatar || "",
        phone: decoded.phone || "",
        about: decoded.about || "",
        createdAt: decoded.createdAt || undefined,
      };
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid" });
  }
};

export const sellerOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "seller") {
    return res.status(403).json({ message: "Seller access required" });
  }

  next();
};
