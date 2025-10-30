import express from "express";
import { isAuthenticated } from "../middlewares/auth";
import {
  getUserNotifications,
  markAllAsRead,
  markAsRead,
} from "../controllers/notification.controller";

const notificationRouter = express.Router();

notificationRouter.get(
  "/user-notifications",
  isAuthenticated,
  getUserNotifications
);
notificationRouter.put(
  "/notification/:notificationId",
  isAuthenticated,
  markAsRead
);
notificationRouter.put("/notifications", isAuthenticated, markAllAsRead);

export default notificationRouter;
