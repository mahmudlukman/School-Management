import express from "express";
import { isAuthenticated } from "../middlewares/auth";
import {
  getInbox,
  getSentMessages,
  markMessageAsRead,
  sendMessage,
} from "../controllers/message.controller";

const messageRouter = express.Router();

messageRouter.post("/send-message", isAuthenticated, sendMessage);
messageRouter.get("/message-inbox", isAuthenticated, getInbox);
messageRouter.get("/message-sent", isAuthenticated, getSentMessages);
messageRouter.get(
  "/mark-message/:messageId",
  isAuthenticated,
  markMessageAsRead
);

export default messageRouter;
