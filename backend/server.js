"use strict";
const express = require("express");
const { chats } = require("./data/data");

const app = express();

app.get("/", (req, res) => {
  res.send("API is running.");
});

app.get("/api/chat", (req, res) => {
  res.send(chats);
});

app.get("/api/chat/")

app.listen(5000, console.log("Server started on PORT 5000."));