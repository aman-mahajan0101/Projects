const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "Chat bot";

//Run when client connects
io.on("connection", (socket) => {
  //   console.log("New WS connection");

  socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));

  //broadcast when a user connects
  socket.broadcast.emit("message", "A user has joined the chat");

  //Run when client disconnects
  socket.on("disconnect", () => {
    io.emit("message", "A User has left the chat");
  });

  //Listen for chat message

  socket.on("chatMessage", (msg) => {
    io.emit("message", msg);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
