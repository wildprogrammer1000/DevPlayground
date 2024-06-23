const { pub, sub } = require("./redis");

const onConnection = (socket) => {
  socket.on("message", (data) =>
    pub.publish(data.channel, JSON.stringify(data))
  );
  socket.on("join", ({ channel }) => {
    socket.join(channel);
    sub.subscribe(channel);
    socket.emit("joined");
  });
};

module.exports = { onConnection };
