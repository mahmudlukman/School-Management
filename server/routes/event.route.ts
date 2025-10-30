import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
import { UserRole } from "../@types/types";
import {
  createEvent,
  deleteEvent,
  getEvents,
  updateEvent,
} from "../controllers/event.controller";

const eventRouter = express.Router();

eventRouter.post(
  "/create-event",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  createEvent
);
eventRouter.get("/events", isAuthenticated, getEvents);
eventRouter.put(
  "/update-event/:id",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  updateEvent
);
eventRouter.delete(
  "/delete-event/:id",
  isAuthenticated,
  authorizeRoles(UserRole.ADMIN, UserRole.PRINCIPAL),
  deleteEvent
);

export default eventRouter;
