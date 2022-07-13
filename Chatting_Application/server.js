const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser, userLeave, getRoomusers } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "Chat bot";

//Run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    //Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));

    //broadcast when a user connects
    socket.broadcast.to(user.room).emit("message", formatMessage(botName, `${user.username} has joined the chat`));

    //Send users and rom info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomusers(user.room),
    });
  });

  //Listen for chat message
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  //Run when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit("message", formatMessage(botName, `${user.username} has left the chat`));

      //Send users and rom info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomusers(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
