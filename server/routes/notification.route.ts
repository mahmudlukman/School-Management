import express from "express";
import { isAuthenticated } from "../middlewares/auth";
import {
  getUserNotifications,
  markAllAsRead,
  markAsRead,
} from "../controllers/notification.controller";

const notificationRouter = express.Router();

notificationRouter.get(
  "/notifications",
  isAuthenticated,
  getUserNotifications
);
notificationRouter.put(
  "/mark-as-read/:notificationId",
  isAuthenticated,
  markAsRead
);
notificationRouter.put("/mark-all-as-read", isAuthenticated, markAllAsRead);

export default notificationRouter;
