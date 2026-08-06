import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";

import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "./../config/db";
import AuthorizationService from "../services/authorizationService";

/**
 * Session lifetime. Scoped to roughly one clinical shift: this is a
 * records system used on shared workstations, so a token that outlives
 * the shift it was issued in is a liability. Keep in step with the
 * auth cookie's maxAge in the frontend login form.
 */
export const TOKEN_TTL_SECONDS = 8 * 60 * 60;

// Generate JWT
const generateToken = (id: any) => {
  const { JWT_SECRET } = config;

  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: TOKEN_TTL_SECONDS,
  });
};

// @desc    Create a staff account
// @route   POST /api/v1/auth/register
// @access  Private/Admin
export const registerUser = expressAsyncHandler(
  async (req: Request | any, res: Response) => {
    const { name, email, password, role, department, employee_id } = req.body;

    // role, department and employee_id are required by the User model —
    // omitting them here previously made every registration fail with an
    // unhandled validation error.
    if (!name || !email || !password || !role || !department || !employee_id) {
      res.status(400);
      throw new Error(
        "Please add all fields: name, email, password, role, department, employee_id"
      );
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const employeeIdTaken = await User.findOne({ employee_id });

    if (employeeIdTaken) {
      res.status(400);
      throw new Error("Employee ID already in use");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      department,
      employee_id,
    });

    if (user) {
      // No token is issued here: an admin creating an account must not
      // receive credentials that authenticate as the new user.
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        employee_id: user.employee_id,
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
    const user = await User.findOne({ email }).populate('role');

    if (user && (await bcrypt.compare(password, user.password))) {
      // Get user permissions
      const userPermissions = await AuthorizationService.getUserPermissions(user._id.toString());
      const allowedActions = await AuthorizationService.getUserAllowedActions(user._id.toString());
      const departmentPermissions = await AuthorizationService.getDepartmentPermissions(user._id.toString());

      // Update last login
      await User.findByIdAndUpdate(user._id, { last_login: new Date() });

      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        employee_id: user.employee_id,
        permissions: userPermissions?.permissions || [],
        allowedActions,
        departmentPermissions,
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
