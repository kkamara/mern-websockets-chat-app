const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { status, } = require("http-status");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    pic,
  } = req.body;
  if (!name || !email || !password) {
    res.status(status.BAD_REQUEST);
    throw new Error("Please enter all the fields.");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(status.BAD_REQUEST);
    throw new Error("User already exists.");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(status.BAD_REQUEST);
    throw new Error("Failed to create the user.");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password, } = req.body;

  const user = await User.findOne({ email, });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(status.UNAUTHORIZED);
    throw new Error("Invalid email or password.");
  }
});

module.exports = { registerUser, authUser, };