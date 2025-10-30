import express from "express";
import {
  //   forgotPassword,
  loginUser,
  logoutUser,
  resetPassword,
  refreshAccessToken,
  register,
  getMyProfile,
} from "../controllers/auth.controller";
import { isAuthenticated } from "../middlewares/auth";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", loginUser);
authRouter.get("/logout", isAuthenticated, logoutUser);
authRouter.get("/me", isAuthenticated, getMyProfile);
// authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/refresh-token", refreshAccessToken);

export default authRouter;
