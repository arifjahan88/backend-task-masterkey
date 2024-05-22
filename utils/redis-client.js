const Redis = require("ioredis");

const redisClient = new Redis({
  host: process.env.REDIS_URL, // Replace with your Redis host
  port: process.env.REDIS_PORT, // Replace with your Redis port
});

module.exports = redisClient;
