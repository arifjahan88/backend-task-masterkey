module.exports = {
  $transaction: jest.fn(),
  order: {
    create: jest.fn(),
  },
  product: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  orderItem: {
    create: jest.fn(),
  },
};
