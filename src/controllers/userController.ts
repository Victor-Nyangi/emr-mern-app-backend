import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";

import User from "models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "./../config/db";

// Generate JWT
const generateToken = (id: any) => {
  const { JWT_SECRET } = config;

  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register new user
// @route   POST /api/users
// @access  Public
export const registerUser = expressAsyncHandler(
  async (req: Request | any, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please add all fields");
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  }
);

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
export const loginUser = expressAsyncHandler(
  async (req: Request | any, res: Response) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid credentials");
    }
  }
);

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
export const getMe = expressAsyncHandler(
  async (req: Request | any, res: Response) => {
    res.status(200).json(req.user);
  }
);
