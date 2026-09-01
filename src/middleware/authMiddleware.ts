import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";
import User from "../models/User";
import expressAsyncHandler from "express-async-handler";
import config from "./../config/db";

export const protect = expressAsyncHandler(
  async (req: Request | any, res: Response, next: NextFunction) => {
    const { JWT_SECRET } = config;
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer")) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }

    const token = header.split(" ")[1];

    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }

    let decoded: any;

    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      // Only token verification belongs inside this catch. Wrapping the
      // user lookup in it too would turn a database outage into a 401.
      res.status(401);
      throw new Error("Not authorized");
    }

    const user = await User.findById(decoded?.id).select("-password");

    // A valid signature is not sufficient: the account may have been
    // deleted since the token was issued. Leaving req.user null here let
    // the request continue and fail later as a confusing 403.
    if (!user) {
      res.status(401);
      throw new Error("Not authorized, user no longer exists");
    }

    req.user = user;

    next();
  }
);

export default { protect };
