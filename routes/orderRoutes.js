const express = require("express");
const apiLimiter = require("../middlewares/ratelimiter");
const { createOrder } = require("../controllers/orderController");

const router = express.Router();

router.post("/orders", apiLimiter, createOrder);

module.exports = router;
