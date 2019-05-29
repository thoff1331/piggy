const express = require("express");
const socket = require("socket.io");
const app = express();

server = app.listen(8000, function() {
  console.log("server is running on port 8000");
});
io = socket(server);
io.on("connection", socket => {
  socket.on("SEND_MESSAGE", function(data) {
    io.emit("RECEIVE_MESSAGE", data);
  });
});
