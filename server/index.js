const express = require("express");
const app = express();

// help to deal with issues with socket.io
// Cross Origin Resources Sharing
const cors = require("cors");

// this one is needed to build server with socket io
const http = require("http");

// class Server come from socket library
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// when someone connects ,call back to the function
io.on("connection", (socket) => {
  console.log(`User ${socket.id} is connected`);

  // when s.o want to join a room
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID ${socket.id} joined room : ${data}`);
  });

  // user sends message
  socket.on("send_message", (data) => {
    // console.log(data);
    socket.to(data.room).emit("receive_message", data);
  });

  // close the server when so disconnect
  socket.on("disconnect", () => {
    console.log("user disconnect", socket.id);
  });
});

server.listen(3001, () => {
  console.log("Server Running at port 3001");
});
