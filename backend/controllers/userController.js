import generateToken from "../utils/generateToken.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import User from "../models/userModel.js";

// @desc Auth user & get token
// @route POST /api/users/auth
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("⚠️ Invalid email or password!");
  }
});

// @desc Register user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists!");
  }

  // if user doesn't already exist
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data!");
  }
});

// @desc Logout user & clear cookie
// @route POST /api/users/logout
// @access Public
const logoutUser = asyncHandler(async (_, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expiresIn: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully!" });
});

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  res.send("User profile 📂");
});

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  res.send("Update User-profile ⚙️");
});

// ADMIN actions
// @desc Get users
// @route GET /api/users
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  res.send("Get/Fetch users 📃");
});

// @desc Get user by ID
// @route GET /api/users/:id
// @access Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  res.send("User By Id 🪪");
});

// @desc Delete user
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  res.send("Delete user 🗑️");
});

// @desc Update user
// @route PUT /api/users/:id
// @access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  res.send("Update User ✍🏻");
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUsers,
  getUserById,
  getUserProfile,
  updateUser,
  updateUserProfile,
  deleteUser,
};
