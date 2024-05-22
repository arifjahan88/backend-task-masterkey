const express = require("express");
const apiLimiter = require("../middlewares/ratelimiter");
const { createProduct, getProduct } = require("../controllers/productController");
const router = express.Router();

router.post("/products", apiLimiter, createProduct);
router.get("/products/:id", apiLimiter, getProduct);

module.exports = router;
