const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const { SocketAddress } = require("net");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, "public")));

//Run when client connects

io.on("connection", (socket) => {
  //   console.log("New WS connection");

  socket.emit("message", "Welcome to ChatCord!");

  //broadcast when a user connects
  socket.broadcast.emit("message", "A user has joined the chat");

  //Run when client disconnects
  socket.on("disconnect", () => {
    io.emit("message", "A User has left the chat");
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
