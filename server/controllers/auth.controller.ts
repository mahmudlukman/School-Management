import { User } from "../models/User";
import ErrorHandler from "../utils/errorHandler";
import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import sendMail from "../utils/sendMail";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../utils/jwtToken";
import config from "../config";
import { UserRole } from "../@types/types";
import { Teacher } from "../models/Teacher";
import { Student } from "../models/Student";
import { Parent } from "../models/Parent";
import { ActivityLog } from "../models/ActivityLog";
import { Types } from "mongoose";
import { catchAsyncError } from "../middlewares/catchAsyncErrors";

// Function to create an activation token
export const createActivationToken = (user: any): string => {
  const token = jwt.sign({ user }, config.ACTIVATION_SECRET as Secret, {
    expiresIn: "5m",
  });
  return token;
};

export const register = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, role, profileData } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return next(new ErrorHandler("User already exists", 400));
      }

      const user = await User.create({
        email,
        password,
        role,
      });

      // Create role-specific profile
      let profile;
      switch (role) {
        case UserRole.TEACHER:
          profile = await Teacher.create({ ...profileData, userId: user._id });
          break;
        case UserRole.STUDENT:
          profile = await Student.create({ ...profileData, userId: user._id });
          break;
        case UserRole.PARENT:
          profile = await Parent.create({ ...profileData, userId: user._id });
          break;
      }

      if (profile) {
        user.profileId = profile._id as Types.ObjectId;
        await user.save();
      }

      // Log activity
      await ActivityLog.create({
        userId: user._id,
        userRole: user.role,
        action: "REGISTER",
        module: "AUTH",
        description: `User registered with role: ${role}`,
      });

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: { id: user._id, email: user.email, role: user.role },
      });
    } catch (error: any) {
      return next(
        new ErrorHandler(
          `Failed to send activation email: ${error.message}`,
          400
        )
      );
    }
  }
);

// Login user
interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
      }
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("Invalid credentials", 400));
      }

      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid credentials", 400));
      }

      const { isActive } = user;
      if (!isActive) {
        return next(
          new ErrorHandler(
            "This account has been suspended! Try to contact the admin",
            403
          )
        );
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Log activity
      await ActivityLog.create({
        userId: user._id,
        userRole: user.role,
        action: "LOGIN",
        module: "AUTH",
        description: "User logged in",
        ipAddress: req.ip,
      });

      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const logoutUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Clear both tokens
      res.cookie("access_token", "", {
        maxAge: 1,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.cookie("refresh_token", "", {
        maxAge: 1,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      // Log activity
      if (req.user) {
        await ActivityLog.create({
          userId: req.user._id,
          userRole: req.user.role,
          action: "LOGOUT",
          module: "AUTH",
          description: "User logged out",
        });
      }

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Get by User ID (for logged-in user)
export const getMyProfile = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?._id);

    if (!user) {
      return next(new ErrorHandler("User profile not found", 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  }
);

// ============================================
// REFRESH ACCESS TOKEN
// ============================================
export const refreshAccessToken = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;

      if (!refresh_token) {
        return next(
          new ErrorHandler("Please login to access this resource", 401)
        );
      }

      const decoded = jwt.verify(
        refresh_token,
        config.REFRESH_TOKEN_SECRET as Secret
      ) as { id: string };

      if (!decoded) {
        return next(new ErrorHandler("Invalid refresh token", 401));
      }

      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      if (!user.isActive) {
        return next(
          new ErrorHandler(
            "This account has been suspended! Try to contact the admin",
            403
          )
        );
      }

      const newAccessToken = user.getJwtToken();
      const newRefreshToken = user.getRefreshToken();

      res.cookie("access_token", newAccessToken, accessTokenOptions);
      res.cookie("refresh_token", newRefreshToken, refreshTokenOptions);

      // Update response to include correct user fields
      res.status(200).json({
        success: true,
        accessToken: newAccessToken,
        user,
      });
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        return next(
          new ErrorHandler("Refresh token expired. Please login again", 401)
        );
      }
      if (error.name === "JsonWebTokenError") {
        return next(new ErrorHandler("Invalid refresh token", 401));
      }
      return next(new ErrorHandler("Could not refresh token", 401));
    }
  }
);

// export const forgotPassword = catchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { email } = req.body;
//       if (!email) {
//         return next(new ErrorHandler("Please provide a valid email!", 400));
//       }

//       const emailLowerCase = email.toLowerCase();
//       const user = await User.findOne({ email: emailLowerCase });
//       if (!user) {
//         return next(new ErrorHandler("User not found, invalid request!", 400));
//       }

//       const { isActive } = user;
//       if (!isActive) {
//         return next(
//           new ErrorHandler(
//             "This account has been suspended! Try to contact the admin",
//             403
//           )
//         );
//       }

//       const resetToken = createActivationToken(user);
//       const resetUrl = `${config.FRONTEND_URL}/reset-password?token=${resetToken}&id=${user._id}`;

//       const data = { user: { name: user.name }, resetUrl };

//       try {
//         await sendMail({
//           email: user.email,
//           subject: "Reset your password",
//           template: "forgot-password-mail.ejs",
//           data,
//         });

//         res.status(201).json({
//           success: true,
//           message: `Please check your email: ${user.email} to reset your password!`,
//           resetToken: resetToken,
//         });
//       } catch (error: any) {
//         return next(new ErrorHandler(error.message, 400));
//       }
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );

// update user password
interface IResetPassword {
  newPassword: string;
}

// reset password
export const resetPassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { newPassword } = req.body as IResetPassword;
      const { id } = req.query;

      if (!id) {
        return next(new ErrorHandler("No user ID provided!", 400));
      }

      const user = await User.findById(id).select("+password");

      if (!user) {
        return next(new ErrorHandler("user not found!", 400));
      }

      const isSamePassword = await user.comparePassword(newPassword);
      if (isSamePassword)
        return next(
          new ErrorHandler(
            "New password must be different from the previous one!",
            400
          )
        );

      if (newPassword.trim().length < 6 || newPassword.trim().length > 20) {
        return next(
          new ErrorHandler(
            "Password must be between at least 6 characters!",
            400
          )
        );
      }

      user.password = newPassword.trim();
      await user.save();

      res.status(201).json({
        success: true,
        message: `Password Reset Successfully', 'Now you can login with new password!`,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
