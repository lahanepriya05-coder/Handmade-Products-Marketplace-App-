import Order from "../models/Order.js";
import User from "../models/User.js";
import { isDatabaseConnected } from "../config/db.js";

export const memoryOrders = [];
let memoryOrderId = 1;

const normalizeOrder = (order) => ({
  id: order._id?.toString?.() || String(order.id),
  buyerName: order.buyerName,
  buyerEmail: order.buyerEmail,
  items: order.items || [],
  total: order.total,
  status: order.status,
  createdAt: order.createdAt || new Date().toISOString(),
});

const createOrderCode = () => `ORD-${Date.now()}`;

export const placeOrder = async (req, res) => {
  try {
    const {
      buyerName,
      buyerEmail,
      items,
      total,
    } = req.body;

    if (!buyerName || !buyerEmail || !Array.isArray(items) || items.length === 0 || !total) {
      return res.status(400).json({ message: "Missing required order details" });
    }

    if (isDatabaseConnected()) {
      const demoSeller = await User.findOne({ email: "seller@example.com", role: "seller" });

      if (!demoSeller) {
        return res.status(500).json({ message: "Demo seller account not found" });
      }

      const order = await Order.create({
        seller: demoSeller._id,
        buyerName,
        buyerEmail,
        items,
        total,
        status: "pending",
      });

      return res.status(201).json({ order: normalizeOrder(order) });
    }

    const order = {
      id: `${createOrderCode()}-${memoryOrderId++}`,
      seller: "2",
      buyerName,
      buyerEmail,
      items,
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    memoryOrders.push(order);

    return res.status(201).json({ order: normalizeOrder(order) });
  } catch (error) {
    console.error("place order error", error);
    return res.status(500).json({ message: "Failed to place order" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    if (isDatabaseConnected()) {
      const orders = await Order.find({ buyerEmail: req.user.email }).sort({ createdAt: -1 });
      return res.json({ orders: orders.map(normalizeOrder) });
    }

    const orders = memoryOrders
      .filter((order) => order.buyerEmail === req.user.email)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.json({ orders: orders.map(normalizeOrder) });
  } catch (error) {
    console.error("get my orders error", error);
    return res.status(500).json({ message: "Failed to load orders" });
  }
};
