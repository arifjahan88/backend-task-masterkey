const { RedisStore } = require("rate-limit-redis");
const { rateLimit } = require("express-rate-limit");
const redisClient = require("../utils/redis-client");

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  message: "Too many requests from this API key, please try again after a minute",
  statusCode: 429, //status Code
  keyGenerator: (req) => req.headers["api-key"],
  standardHeaders: true,
  legacyHeaders: false,

  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
});

module.exports = apiLimiter;
