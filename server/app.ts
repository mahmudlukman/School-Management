import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import limiter from "./utils/rateLimiter";
import type { CorsOptions } from "cors";
import config from "./config";
import { errorMiddleware } from "./middlewares/error";
import authRouter from "./routes/auth.route";
import academicYearRouter from "./routes/academicYear.route";
import announcementRouter from "./routes/announcement.route";
import attendanceRouter from "./routes/attendance.route";
import classRouter from "./routes/class.route";
import dashboardRouter from "./routes/dashboard.route";
import eventRouter from "./routes/event.route";
import examRouter from "./routes/exam.route";
import feeRouter from "./routes/fee.routes";
import homeworkRouter from "./routes/homework.route";
import leaveRouter from "./routes/leave.route";
import libraryRouter from "./routes/library.route";
import messageRouter from "./routes/message.route";
import notificationRouter from "./routes/notification.route";
import studentRouter from "./routes/student.route";
import parentRouter from "./routes/parent.route";
import subjectRouter from "./routes/subject.route";
import teacherRouter from "./routes/teacher.route";
import timetableRouter from "./routes/timetable.route";
import transportRouter from "./routes/transport.route";
import hostelRouter from "./routes/hostel.route";
import expenseRouter from "./routes/expense.route";
import complaintRouter from "./routes/complaint.route";
import certificateRouter from "./routes/certificate.route";

export const app = express();
// Load environment variables from .env file
dotenv.config();
// body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieParser());

// cors => Cross Origin Resource Sharing
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === "development" ||
      !origin ||
      origin.includes("onrender.com") ||
      config.WHITELIST_ORIGINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      // Reject requests from non-whitelisted origins
      callback(
        new Error(`CORS error: ${origin} is not allowed by CORS`),
        false
      );
    }
  },
};

// Apply CORS middleware
app.use(cors({ ...corsOptions, credentials: true }));
// Enable response compression to reduce payload size and improve performance
app.use(
  compression({
    threshold: 1024, // Only compress responses larger than 1KB
  })
);

// Use Helmet to enhance security by setting various HTTP headers
app.use(helmet());

// Apply rate limiting middleware to prevent excessive requests and enhance security
app.use(limiter);

// routes;
app.use(
  "/api/v1",
  authRouter,
  academicYearRouter,
  announcementRouter,
  attendanceRouter,
  classRouter,
  dashboardRouter,
  eventRouter,
  examRouter,
  feeRouter,
  homeworkRouter,
  leaveRouter,
  libraryRouter,
  messageRouter,
  notificationRouter,
  studentRouter,
  parentRouter,
  subjectRouter,
  teacherRouter,
  timetableRouter,
  transportRouter,
  hostelRouter,
  expenseRouter,
  complaintRouter,
  certificateRouter
);

// testing API
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ success: true, message: "API is working" });
});

app.use(errorMiddleware);
