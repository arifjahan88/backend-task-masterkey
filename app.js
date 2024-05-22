const express = require("express");
const helmet = require("helmet");
const orderRoutes = require("./routes/orderRoutes");
const productRoutes = require("./routes/productRoute");
const app = express();

//middleware
app.use(express.json());
app.use(helmet());

//Routes
app.use("/api", orderRoutes);
app.use("/api", productRoutes);

app.get("/", async (req, res) => {
  res.send("Enventory Server is Running");
});

//Error Handeling
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMassage = err.message || "Something went wrong";
  res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMassage,
    stack: err.stack,
  });
});

// //All
app.all("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
