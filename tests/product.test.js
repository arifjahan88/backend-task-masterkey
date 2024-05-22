const request = require("supertest");
const app = require("../app");
const prisma = require("../utils/prisma");

jest.mock("../utils/prisma");

describe("Product API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/products", () => {
    it("should create a product successfully", async () => {
      prisma.product.create.mockResolvedValue({
        id: 1,
        name: "Test Product",
        description: "Test Description",
        price: 100,
        stock: 10,
      });

      const response = await request(app).post("/api/products").send({
        name: "Test Product",
        description: "Test Description",
        price: 100,
        stock: 10,
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe("Test Product");
    });

    it("should return an error if product creation fails", async () => {
      prisma.product.create.mockResolvedValue(null);

      const response = await request(app).post("/api/products").send({
        name: "Test Product",
        description: "Test Description",
        price: 100,
        stock: 10,
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Product creation failed");
    });
  });

  describe("GET /api/products/:id", () => {
    it("should fetch a product successfully", async () => {
      prisma.product.findUnique.mockResolvedValue({
        id: 1,
        name: "Test Product",
        description: "Test Description",
        price: 100,
        stock: 10,
      });

      const response = await request(app).get("/api/products/1");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe("Test Product");
    });

    it("should return an error if product is not found", async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      const response = await request(app).get("/api/products/1");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Product not found");
    });
  });
});
