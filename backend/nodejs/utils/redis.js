const Redis = require("ioredis");
const redis = { io: null };

// Publisher
const pub = new Redis({
  host: "redis",
  port: 6379,
});

// Subscriber
const sub = pub.duplicate();

sub.on("message", (channel, message) => {
  redis.io && redis.io.to(channel).emit("message", JSON.parse(message));
});

module.exports = {
  pub,
  sub,
  redis,
};
