"use strict";
const asyncHandler = require("express-async-handler");
const { default: status } = require("http-status");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId, } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(status.BAD_REQUEST);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    res.status(status.OK).json(message);
  } catch (error) {
    res.status(status.BAD_REQUEST);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({
      chat: req.params.chatId,
    })
      .populate("sender", "name pic email")
      .populate("chat");
    res.status(status.OK).json(messages);
  } catch (error) {
    res.status(status.BAD_REQUEST);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages, };