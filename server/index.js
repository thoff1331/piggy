const express = require("express");
const app = express();
const PORT = 7000;
const http = require("http").createServer();
const io = require("socket.io")(http, { path: "/myapp/socket.io" });

const chatrooms = ["test", "test2"];

io.of("/chat").on("connection", socket => {
  socket.emit("connected", "Hello and welcome");
  console.log("New Client is connected");
  socket.on("joinRoom", room => {
    if (chatrooms.includes(room)) {
      socket.join(room);
      io.of("/chat")
        .in(room)
        .emit("newUser", `new User has joined ${room}`);
      socket.emit("success", `You joined ${room}`);
    } else {
      return socket.emit("err", `No room named ${room}`);
    }
    socket.on("newMsg", data => {
      io.of("/chat")
        .in(room)
        .emit("msg", data);
    });
  });
});

http.listen(PORT, () => {
  console.log("socket server is listening");
});

app.listen(8000, () => {
  console.log("server is running on port 8000");
});
