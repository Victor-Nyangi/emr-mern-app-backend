import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";
import User from "../models/User";
import expressAsyncHandler from "express-async-handler";
import config from "./../config/db";

export const protect = expressAsyncHandler(
  async (req: Request | any, res: Response, next: NextFunction) => {
    let token;
    const { JWT_SECRET } = config;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        // Get token from header
        token = req.headers.authorization.split(" ")[1];

        if (!token) {
          res.status(401);
          throw new Error("Not authorized, no token");
        }

        // Verify token
        // const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const decoded: any= jwt.verify(token, JWT_SECRET);

        // Get user from the token
        req.user = await User.findById(decoded?.id).select("-password");

        next();
      } catch (error) {
        console.log(error);
        res.status(401);
        throw new Error("Not authorized");
      }
    }
  }
);

module.exports = { protect };
