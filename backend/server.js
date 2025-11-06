"use strict";
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { notFound, errorHandler, } = require("./middleware/errorMiddleware");
const messageRoutes = require("./routes/messageRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(express.json()); // To accept JSON data.

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server started on PORT ${PORT}.`.yellow.bold),
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

const socketStorage = {};

io.on("connection", socket => {
  console.log("Connected to socket.io");
  console.log("socketStorage", socketStorage);
  console.log("socket.id", socket.id);

  socket.on("setup", userData => {
    socketStorage[socket.id] = {
      userId: userData._id,
      rooms: [],
    };
    console.log("socketStorage after setup", socketStorage);
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", room => {
    socketStorage[socket.id].rooms.push(room);
    socket.join(room);
    console.log("User Joined Room: " + room);
    console.log("socketStorage after join chat", socketStorage);
  });

  socket.on("new message", newMessageReceived => {
    var chat = newMessageReceived.chat;

    if (!chat.users) {
      return console.log("chat.users not defined");
    }

    chat.users.forEach(user => {
      if (user._id == newMessageReceived.sender._id) {
        return;
      }
      socket.in(user._id).emit(
        "message received",
        newMessageReceived,
      );
    });
  });

  socket.on("typing", room => socket.in(room).emit("typing"));
  socket.on(
    "stop typing",
    room => socket.in(room).emit("stop typing")
  );

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED");
    if (socketStorage[socket.id]) {
      if (socketStorage[socket.id].rooms) {
        for (const room of socketStorage[socket.id].rooms) {
          socket.leave(room);
        }
      }
      socket.leave(socketStorage[socket.id].userId);
      delete socketStorage[socket.id];
    }
    console.log("socketStorage after disconnect", socketStorage);
  });
});