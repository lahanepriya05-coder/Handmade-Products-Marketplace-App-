import mongoose from "mongoose";
import Product from "../models/Product.js";
import { isDatabaseConnected } from "../config/db.js";
import User from "../models/User.js";
import { memoryProducts } from "./sellerController.js";

const defaultSeller = {
  id: "seller-demo",
  name: "Marketplace Seller",
  shopName: "Kinara Seller",
};

const toPublicImageUrl = (req, image) => {
  if (!image) {
    return "";
  }

  if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("data:")) {
    return image;
  }

  return `${req.protocol}://${req.get("host")}${image}`;
};

const buildPublicProduct = (req, product, seller = defaultSeller) => ({
  id: product._id?.toString?.() || String(product.id),
  sellerId: product.seller?._id?.toString?.() || product.seller?.toString?.() || seller.id,
  title: product.title,
  description: product.description,
  category: product.category,
  image: toPublicImageUrl(req, product.image || ""),
  images: product.image ? [toPublicImageUrl(req, product.image)] : [],
  price: Number(product.price),
  stock: Number(product.stock || 0),
  status: product.status || "active",
  seller: {
    id: seller._id?.toString?.() || seller.id,
    name: seller.name || seller.shopName || "Marketplace Seller",
    shopName: seller.shopName || seller.name || "Kinara Seller",
  },
  createdAt: product.createdAt || new Date().toISOString(),
});

export const listProducts = async (req, res) => {
  try {
    const { category, search } = req.query;

    if (isDatabaseConnected()) {
      const query = { status: "active" };

      if (category) {
        query.category = new RegExp(`^${category}$`, "i");
      }

      if (search) {
        query.$or = [
          { title: new RegExp(search, "i") },
          { description: new RegExp(search, "i") },
          { category: new RegExp(search, "i") },
        ];
      }

      const products = await Product.find(query)
        .sort({ createdAt: -1 })
        .populate("seller", "name shopName email");

      return res.json({
        products: products.map((product) => buildPublicProduct(req, product, product.seller || defaultSeller)),
      });
    }

    const filtered = memoryProducts
      .filter((product) => product.status === "active")
      .filter((product) => (category ? product.category.toLowerCase() === String(category).toLowerCase() : true))
      .filter((product) => {
        if (!search) return true;
        const term = String(search).toLowerCase();
        return (
          product.title.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term)
        );
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const sellerMap = {
      "2": {
        id: "2",
        name: "Demo Seller",
        shopName: "Demo Seller Studio",
      },
    };

    return res.json({
      products: filtered.map((product) =>
        buildPublicProduct(req, product, sellerMap[String(product.seller)] || defaultSeller)
      ),
    });
  } catch (error) {
    console.error("list products error", error);
    return res.status(500).json({ message: "Failed to load products" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    if (isDatabaseConnected()) {
      const product = await Product.findOne({
        _id: new mongoose.Types.ObjectId(productId),
        status: "active",
      }).populate("seller", "name shopName email");

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      return res.json({ product: buildPublicProduct(req, product, product.seller || defaultSeller) });
    }

    const product = memoryProducts.find(
      (item) => String(item.id) === String(productId) && item.status === "active"
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const seller =
      String(product.seller) === "2"
        ? { id: "2", name: "Demo Seller", shopName: "Demo Seller Studio" }
        : defaultSeller;

    return res.json({ product: buildPublicProduct(req, product, seller) });
  } catch (error) {
    console.error("get product by id error", error);
    return res.status(500).json({ message: "Failed to load product" });
  }
};
