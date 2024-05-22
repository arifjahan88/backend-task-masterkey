const request = require("supertest"); // Importing Supertest library for testing HTTP requests
const app = require("../app"); // Importing the Express app
const prisma = require("../utils/prisma"); // Importing Prisma client
jest.mock("../utils/prisma"); // Mocking the Prisma client for testing purposes

describe("Order API", () => {
  // Test suite for Order API
  beforeEach(() => {
    // Before each test case
    jest.clearAllMocks(); // Clear all mock implementations
  });

  describe("POST /api/orders", () => {
    // Test suite for POST /api/orders endpoint
    it("should create an order successfully", async () => {
      // Test case for successful order creation
      prisma.$transaction.mockImplementation(async (callback) => {
        // Mocking the Prisma transaction
        const transaction = {
          order: {
            create: jest.fn().mockResolvedValue({ id: 1, userId: 1, totalAmount: 200 }),
          },
          product: {
            findUnique: jest.fn().mockResolvedValue({ id: 1, stock: 10 }),
            update: jest.fn().mockResolvedValue({}),
          },
          orderItem: {
            create: jest.fn().mockResolvedValue({}),
          },
        };
        return callback(transaction); // Executing the callback with the mocked transaction
      });

      const response = await request(app) // Sending a POST request to /api/orders
        .post("/api/orders")
        .send({ userId: 1, items: [{ productId: 1, quantity: 2, price: 100 }] });

      expect(response.status).toBe(200); // Asserting the response status code
      expect(response.body.success).toBe(true); // Asserting the success property in the response
      expect(response.body.data.id).toBe(1); // Asserting the order ID in the response
    });

    it("should return an error if there is insufficient stock", async () => {
      // Test case for insufficient stock
      prisma.$transaction.mockImplementation(async (callback) => {
        // Mocking the Prisma transaction
        const transaction = {
          order: {
            create: jest.fn().mockResolvedValue({ id: 1, userId: 1, totalAmount: 200 }),
          },
          product: {
            findUnique: jest.fn().mockResolvedValue({ id: 1, stock: 1 }),
          },
          orderItem: {
            create: jest.fn(),
          },
        };
        return callback(transaction); // Executing the callback with the mocked transaction
      });

      const response = await request(app) // Sending a POST request to /api/orders
        .post("/api/orders")
        .send({ userId: 1, items: [{ productId: 1, quantity: 2, price: 100 }] });

      expect(response.status).toBe(400); // Asserting the response status code for insufficient stock
      expect(response.body.message).toBe("Insufficient stock for product: undefined"); // Asserting the error message
    });
  });
});
