const { asyncHandler } = require("../utils/asyncHandler");
const { createError } = require("../utils/error");
const prisma = require("../utils/prisma");

exports.createOrder = asyncHandler(async (req, res) => {
  const { userId, items } = req.body;

  const order = await prisma.$transaction(async (transaction) => {
    // Create the order
    const order = await transaction.order.create({
      data: {
        userId,
        totalAmount: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      },
    });

    // Create order items and update inventory
    for (const item of items) {
      const product = await transaction.product.findUnique({
        where: { id: item.productId },
      });

      if (product.stock < item.quantity) {
        throw createError(400, "Insufficient stock for product: " + product.name);
      }

      await transaction.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        },
      });

      await transaction.product.update({
        where: { id: item.productId },
        data: { stock: product.stock - item.quantity },
      });
    }

    //   If you have a payment service, you can call it here

    // const paymentResult = await axios.post('http://payment-service/api/payments', {
    //     orderId: order.id,
    //     amount: order.totalAmount,
    // });

    // if (!paymentResult.data.success) {
    //     throw new Error('Payment processing failed');
    // }

    return order;
  });

  res.status(200).json({
    message: "Created order successfully",
    success: true,
    data: order,
  });
});
