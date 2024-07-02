// const { pub, sub } = require("./redis");
let io = null;
const socketMap = new Map();

const setSocketIO = (socketIO) => (io = socketIO);

const onJoinChat = (socket, data) => {
  const { channel, user } = data;
  socket.join(channel);
  socketMap.set(socket.id, { socket, user });

  io.to(channel).emit("onJoinChat", {
    channel,
    user,
    user_count: socketMap.size,
  });
  socket.broadcast.emit("updateUserCount", { count: socketMap.size, user });
};

const onSendMessage = (data) => {
  const { channel } = data;
  io.to(channel).emit("onMessage", data);
};

const onDisconnect = (socket) => {
  const disconnected = socketMap.get(socket.id);
  if (disconnected) socketMap.delete(socket.id);
  socket.broadcast.emit("updateUserCount", { count: socketMap.size });
};

const onConnection = (socket) => {
  socket.on("joinChat", (data) => onJoinChat(socket, data));
  socket.on("sendMessage", onSendMessage);
  socket.on("disconnect", () => onDisconnect(socket));
  // pub.publish(data.channel, JSON.stringify(data));
  // sub.subscribe(channel);
};

const sendMessage = ({ receiver_id, sender, message }) => {
  let presence;

  socketMap.forEach((value) => {
    const user = value.user;
    if (user && user.id === receiver_id) presence = value;
  });

  if (presence) {
    presence.socket.emit("onFriendMessage", { user: sender, message });
  }
};

module.exports = { setSocketIO, onConnection, sendMessage };
