import { Router } from "express";
import {
  authUser,
  deleteUser,
  getUserById,
  getUserProfile,
  getUsers,
  logoutUser,
  registerUser,
  updateUser,
  updateUserProfile,
} from "../controllers/userController.js";

const userRouter = Router();

userRouter.route("/").post(registerUser).get(getUsers);
userRouter.post("/logout", logoutUser);
userRouter.post("/login", authUser);
userRouter.route("/profile").get(getUserProfile).put(updateUserProfile);
userRouter.route("/:id").delete(deleteUser).get(getUserById).put(updateUser);

export default userRouter;
