const express = require("express");
const app = express();
const PORT = process.env.PORT || 7000;
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const chatrooms = ["test", "maybe"];

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
  });
  socket.on("leave", room => {
    socket.leave(room);
    socket.emit("left", `left ${room}`);
  });
  socket.on("newMsg", obj => {
    io.of("/chat")
      .to(obj.room)
      .emit("msg", obj);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

http.listen(PORT, () => {
  console.log("socket server is listening");
});

app.listen(8000, () => {
  console.log("server is running on port 8000");
});
