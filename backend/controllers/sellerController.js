import { isDatabaseConnected } from "../config/db.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { memoryOrders } from "./orderController.js";
import { deleteProductImage, persistProductImage } from "../utils/imageStorage.js";

export const memoryProducts = [];
let memoryProductId = 1;

const toPublicImageUrl = (req, image) => {
  if (!image) {
    return "";
  }

  if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("data:")) {
    return image;
  }

  return `${req.protocol}://${req.get("host")}${image}`;
};

const normalizeProduct = (req, product) => ({
  id: product._id?.toString?.() || String(product.id),
  title: product.title,
  description: product.description,
  category: product.category,
  image: toPublicImageUrl(req, product.image || ""),
  price: product.price,
  stock: product.stock,
  status: product.status || "active",
  seller: product.seller?.toString?.() || product.seller,
  createdAt: product.createdAt || new Date().toISOString(),
});

const normalizeOrder = (order) => ({
  id: order._id?.toString?.() || String(order.id),
  buyerName: order.buyerName,
  buyerEmail: order.buyerEmail,
  items: order.items || [],
  total: order.total,
  status: order.status,
  createdAt: order.createdAt || new Date().toISOString(),
});

export const createSellerProduct = async (req, res) => {
  try {
    const { title, description, category, image, price, stock } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "Title, description, and category are required" });
    }

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ message: "Valid price is required" });
    }

    if (Number.isNaN(numericStock) || numericStock < 0) {
      return res.status(400).json({ message: "Valid stock is required" });
    }

    const storedImage = persistProductImage(image || "");

    if (isDatabaseConnected()) {
      const product = await Product.create({
        seller: req.user.id,
        title,
        description,
        category,
        image: storedImage,
        price: numericPrice,
        stock: numericStock,
        status: "active",
      });

      return res.status(201).json({ product: normalizeProduct(req, product) });
    }

    const product = {
      id: memoryProductId++,
      seller: req.user.id,
      title,
      description,
      category,
      image: storedImage,
      price: numericPrice,
      stock: numericStock,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    memoryProducts.push(product);

    return res.status(201).json({ product: normalizeProduct(req, product) });
  } catch (error) {
    console.error("create seller product error", error);
    return res.status(500).json({ message: "Failed to create product" });
  }
};

export const listSellerProducts = async (req, res) => {
  try {
    if (isDatabaseConnected()) {
      const products = await Product.find({ seller: req.user.id }).sort({ createdAt: -1 });
      return res.json({ products: products.map((product) => normalizeProduct(req, product)) });
    }

    const products = memoryProducts
      .filter((product) => String(product.seller) === String(req.user.id))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.json({ products: products.map((product) => normalizeProduct(req, product)) });
  } catch (error) {
    console.error("list seller products error", error);
    return res.status(500).json({ message: "Failed to fetch products" });
  }
};

export const updateSellerProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updates = req.body;

    if (isDatabaseConnected()) {
      const existingProduct = await Product.findOne({ _id: productId, seller: req.user.id });

      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      const nextImage =
        updates.image !== undefined
          ? persistProductImage(updates.image, existingProduct.image || "")
          : existingProduct.image || "";

      const product = await Product.findOneAndUpdate(
        { _id: productId, seller: req.user.id },
        {
          ...updates,
          image: nextImage,
        },
        { new: true, runValidators: true }
      );

      return res.json({ product: normalizeProduct(req, product) });
    }

    const index = memoryProducts.findIndex(
      (product) => String(product.id) === String(productId) && String(product.seller) === String(req.user.id)
    );

    if (index === -1) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingProduct = memoryProducts[index];
    memoryProducts[index] = {
      ...existingProduct,
      ...updates,
      image:
        updates.image !== undefined
          ? persistProductImage(updates.image, existingProduct.image || "")
          : existingProduct.image || "",
      price: updates.price !== undefined ? Number(updates.price) : memoryProducts[index].price,
      stock: updates.stock !== undefined ? Number(updates.stock) : memoryProducts[index].stock,
    };

    return res.json({ product: normalizeProduct(req, memoryProducts[index]) });
  } catch (error) {
    console.error("update seller product error", error);
    return res.status(500).json({ message: "Failed to update product" });
  }
};

export const deleteSellerProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (isDatabaseConnected()) {
      const product = await Product.findOneAndDelete({ _id: productId, seller: req.user.id });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      deleteProductImage(product.image || "");

      return res.json({ message: "Product deleted" });
    }

    const index = memoryProducts.findIndex(
      (product) => String(product.id) === String(productId) && String(product.seller) === String(req.user.id)
    );

    if (index === -1) {
      return res.status(404).json({ message: "Product not found" });
    }

    deleteProductImage(memoryProducts[index].image || "");
    memoryProducts.splice(index, 1);
    return res.json({ message: "Product deleted" });
  } catch (error) {
    console.error("delete seller product error", error);
    return res.status(500).json({ message: "Failed to delete product" });
  }
};

export const listSellerOrders = async (req, res) => {
  try {
    if (isDatabaseConnected()) {
      const orders = await Order.find({ seller: req.user.id }).sort({ createdAt: -1 });
      return res.json({ orders: orders.map(normalizeOrder) });
    }

    const orders = memoryOrders
      .filter((order) => String(order.seller) === String(req.user.id))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.json({ orders: orders.map(normalizeOrder) });
  } catch (error) {
    console.error("list seller orders error", error);
    return res.status(500).json({ message: "Failed to fetch seller orders" });
  }
};

export const getSellerDashboard = async (req, res) => {
  try {
    let products = [];
    let orders = [];

    if (isDatabaseConnected()) {
      products = await Product.find({ seller: req.user.id }).sort({ createdAt: -1 });
      orders = await Order.find({ seller: req.user.id }).sort({ createdAt: -1 });
    } else {
      products = memoryProducts
        .filter((product) => String(product.seller) === String(req.user.id))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      orders = memoryOrders
        .filter((order) => String(order.seller) === String(req.user.id))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const normalizedProducts = products.map((product) => normalizeProduct(req, product));
    const normalizedOrders = orders.map(normalizeOrder);
    const totalProducts = normalizedProducts.length;
    const activeProducts = normalizedProducts.filter((product) => product.status === "active").length;
    const totalInventory = normalizedProducts.reduce((sum, product) => sum + Number(product.stock || 0), 0);
    const totalOrders = normalizedOrders.length;
    const totalRevenue = normalizedOrders
      .filter((order) => order.status !== "cancelled")
      .reduce((sum, order) => sum + Number(order.total || 0), 0);

    return res.json({
      seller: {
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        shopName: req.user.shopName || `${req.user.name}'s Store`,
      },
      stats: {
        totalProducts,
        activeProducts,
        totalInventory,
        totalOrders,
        totalRevenue,
      },
      products: normalizedProducts,
      recentOrders: normalizedOrders.slice(0, 5),
    });
  } catch (error) {
    console.error("seller dashboard error", error);
    return res.status(500).json({ message: "Failed to load seller dashboard" });
  }
};
