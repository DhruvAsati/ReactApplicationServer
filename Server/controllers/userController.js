import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import hashPassword, { comparePassword } from "../helpers/authHelper.js";
import { expressjwt } from "express-jwt";

//Middleware

export const requireSignIn = expressjwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"] })

// Register Controller
export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Input validation
    if (!name || !email || !password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and a password (6+ characters) are required.",
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    // Hash password and create new user
    const hashedPassword = await hashPassword(password);
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    const isDuplicateEmailError = error.code === 11000;
    res.status(isDuplicateEmailError ? 400 : 500).json({
      success: false,
      message: isDuplicateEmailError
        ? "Duplicate email detected. Please use a different email address."
        : "An error occurred during registration.",
      error: error.message || error,
    });
  }
};

// Login Controller
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Check if password matches
    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Respond with user info and token
    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during login.",
      error: error.message || error,
    });
  }
};

export const updateUserController = async (req, res) => {
  try {
    const { name, password, email } = req.body;
    //password validate
    const user = await userModel.findOne({ email });
    if (password && password < 6) {
      return res.status(400).send({
        success: false,
        message: "Password is required and should be 6 character long",
      });
    }
    //user find
    const hashedPassword = password ? await hashPassword(password) : undefined;

    //updated user
    const updatedUser = await userModel.findOneAndUpdate(
      { email },
      {
        name: name || user.name,
        password: hashedPassword || user.password,
      },
      { new: true }
    );
    updatedUser.password=undefined;
    res.status(200).send({
      success: true,
      message: "Profile updated Please login",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in UserUpdate Api",
      error,
    });
  }
};
