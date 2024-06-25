// const { pub, sub } = require("./redis");
const socketio = { io: null };

const onConnection = (socket) => {
  socket.on("message", (data) => {
    // pub.publish(data.channel, JSON.stringify(data));
    const { channel } = data;
    const targetChannel = channel === "all" ? "all" : `room_${channel}`;
    socketio.io.to(targetChannel).emit(targetChannel, JSON.stringify(data));
  });
  socket.on("join", ({ channel, user }) => {
    if (channel === "all") socket.join("all");
    else {
      console.log("room joined: ", channel, user.id);
      channel && socket.join(`room_${channel}`);
      user && socket.join(`room_${user.id}`);
    }
    socket.emit("joined", { channel, user });
    // sub.subscribe(channel);
  });
};

module.exports = { socketio, onConnection };
