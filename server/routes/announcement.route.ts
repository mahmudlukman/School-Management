import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
import { UserRole } from "../@types/types";
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  updateAnnouncement,
} from "../controllers/announcement.controller";

const announcementRouter = express.Router();

announcementRouter.post(
  "/create-announcement",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  createAnnouncement
);
announcementRouter.get("/announcements", isAuthenticated, getAnnouncements);
announcementRouter.put(
  "/update-announcement/:id",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  updateAnnouncement
);
announcementRouter.delete(
  "/delete-announcement/:id",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  deleteAnnouncement
);

export default announcementRouter;
