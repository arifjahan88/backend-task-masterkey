const { asyncHandler } = require("../utils/asyncHandler");
const { createError } = require("../utils/error");
const prisma = require("../utils/prisma");

// POST /api/products
exports.createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock } = req.body; // Extracting product data from request body

  const product = await prisma.product.create({
    // Creating a new product using Prisma
    data: {
      name,
      description,
      price,
      stock,
    },
  });

  if (!product) {
    // Handling product creation failure
    throw createError(400, "Product creation failed");
  }

  // Sending a success response with the created product data
  res.status(200).json({
    message: "Product created successfully",
    success: true,
    data: product,
  });
});

// GET /api/products/:id
exports.getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params; // Extracting the product ID from the request parameters

  const product = await prisma.product.findUnique({
    where: {
      id: parseInt(id, 10), // Converting the ID to an integer
    },
  });

  if (!product) {
    // Handling case when the product is not found
    throw createError(404, "Product not found");
  }

  // Sending a success response with the fetched product data
  res.status(200).json({
    message: "Product fetched successfully",
    success: true,
    data: product,
  });
});
