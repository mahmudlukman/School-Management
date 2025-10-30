import { catchAsyncError } from "../middlewares/catchAsyncErrors";
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";
import { Notification } from "../models/Notification";
import { Event } from "../models/Event";
import { User } from "../models/User";

export const createEvent = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const event = await Event.create({
      ...req.body,
      createdBy: req.user?._id,
    });

    // Notify target audience
    if (event.targetAudience.length > 0) {
      const users = await User.find({ role: { $in: event.targetAudience } });
      const notifications = users.map((user) => ({
        userId: user._id,
        title: "New Event",
        message: `${event.title} on ${event.eventDate}`,
        type: "info",
        link: `/events/${event._id}`,
      }));
      await Notification.insertMany(notifications);
    }

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  }
);

// Get Events
export const getEvents = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { eventType, startDate, endDate } = req.query;

    const query: any = { isPublic: true };
    if (eventType) query.eventType = eventType;
    if (startDate && endDate) {
      query.eventDate = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    const events = await Event.find(query)
      .populate("createdBy")
      .sort({ eventDate: 1 });

    res.status(200).json({
      success: true,
      events,
    });
  }
);

// Update Event
export const updateEvent = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return next(new ErrorHandler("Event not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event,
    });
  }
);

// Delete Event
export const deleteEvent = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return next(new ErrorHandler("Event not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  }
);
