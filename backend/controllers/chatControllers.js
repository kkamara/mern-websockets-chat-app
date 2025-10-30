const asyncHandler = require("express-async-handler");
const { status, } = require("http-status");
const Chat = require("../models/chatModel");

const accessChat = asyncHandler(async (req, res) => {
  const { userId, } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request.");;
    return res.sendStatus(status.BAD_REQUEST);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (0 < isChat.length) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);

      const fullChat = await Chat.findOne({_id: createdChat._id})
        .populate("users", "-password");
      
      res.status(status.OK).send(fullChat);
    } catch (error) {
      res.status(status.BAD_REQUEST);
      throw new Error(error.message);
    }
  }
});

module.exports = { accessChat };