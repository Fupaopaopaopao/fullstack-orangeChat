import jwt from "jsonwebtoken";
import { Response } from "express";

export const generateJWT = (userId: any, res: Response) => {
  // payload scret expiresIn (configuration)
  const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, //防止js访问cookie
    sameSite: "strict",//防止csrf攻击 (只在同源域名下访问cookie，防止跨域攻击)
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};
