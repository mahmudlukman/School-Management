import { Response } from "express";
import { IUser } from "../models/User";
import config from "../config";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

// Parse environment variables
const accessTokenExpire = parseInt(config.JWT_EXPIRES || "15", 10); // minutes
const refreshTokenExpire = parseInt(config.REFRESH_TOKEN_EXPIRES || "7", 10); // days

const isProduction = config.NODE_ENV === "production";

// Access token options (short-lived)
export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 60 * 1000),
  maxAge: accessTokenExpire * 60 * 1000,
  httpOnly: true,
  sameSite: "lax", // Changed from conditional - proxy makes it same-origin
  secure: isProduction,
};

// Refresh token options (long-lived)
export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax", // Changed from conditional
  secure: isProduction,
};

// Send both tokens
export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.getJwtToken();
  const refreshToken = user.getRefreshToken();

  // Set both cookies
  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
