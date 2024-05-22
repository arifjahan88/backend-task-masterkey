const app = require("./app");
const prisma = require("./utils/prisma");
const PORT = process.env.PORT || 5000;

const init = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to the database");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

init();
