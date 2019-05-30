const express = require("express");
const app = express();
const PORT = 7000 || $PORT;
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

const chatrooms = ["test", "maybe"];
// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/../src/index.js");
// });

app.use(express.static(`${__dirname}/../build`));

io.of("/chat").on("connection", socket => {
  socket.emit("connected", "Hello and welcome");
  console.log("New Client is connected");
  socket.on("joinRoom", room => {
    if (chatrooms.includes(room)) {
      socket.join(room, () => {
        console.log(socket.rooms);
        console.log(socket.handshake);
      });
      io.of("/chat")
        .in(room)
        .emit("newUser", `new User has joined ${room}`);
      socket.emit("success", `You joined ${room}`);
    } else {
      // chatrooms.push(room);
      // socket.join(room, () => {
      //   console.log(socket.rooms);
      // });
      // io.of("/chat")
      //   .in(room)
      //   .emit("newUser", `new User has joined ${room}`);
      // socket.emit("success", `You joined ${room}`);
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

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

http.listen(PORT, () => {
  console.log("socket server is listening");
});

app.listen(8000, () => {
  console.log("server is running on port 8000");
});
