import express from "express";
import {
  createSellerProduct,
  deleteSellerProduct,
  getSellerDashboard,
  listSellerProducts,
  listSellerOrders,
  updateSellerProduct,
} from "../controllers/sellerController.js";
import { protect, sellerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, sellerOnly);
router.get("/dashboard", getSellerDashboard);
router.get("/orders", listSellerOrders);
router.get("/products", listSellerProducts);
router.post("/products", createSellerProduct);
router.put("/products/:productId", updateSellerProduct);
router.delete("/products/:productId", deleteSellerProduct);

export default router;
