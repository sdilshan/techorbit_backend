import User from "../Schema/User.js";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../utils/jwt.js"; // Email validation
const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const formatUserResponse = (user) => ({
  fullname: user.personal_info.fullname,
  username: user.personal_info.username,
  profile_img: user.personal_info.profile_img,
});

//Signup
export const signup = async (req, res) => {
  try {
    const fullname = req.body.fullname?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    // Full name validation
    if (!fullname || fullname.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Full name must be at least 3 characters long.",
      });
    }

    // Email validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Password validation
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required.",
      });
    }
    // Pw length 6-20
    if (password.length < 6 || password.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Password must be between 6 and 20 characters long.",
      });
    }

    //1 uppercase
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one uppercase letter.",
      });
    }
    //1 lowercase
    if (!/[a-z]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one lowercase letter.",
      });
    }
    //1 number
    if (!/\d/.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one number.",
      });
    }

    // Check existing email
    const existingUser = await User.findOne({
      "personal_info.email": email,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate username from email
    let username = email.split("@")[0];

    // Make username unique
    let count = 0;
    let tempUsername = username;

    while (
      await User.findOne({
        "personal_info.username": tempUsername,
      })
    ) {
      count++;
      tempUsername = `${username}${count}`;
    }

    username = tempUsername;

    // Create user
    const user = await User.create({
      personal_info: {
        fullname,
        email,
        password: hashedPassword,
        username,
      },
    });
    //const userResponse = user.toObject();
    //delete userResponse.personal_info.password;
    const accessToken = generateAccessToken(user);
    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      accessToken,
      user: formatUserResponse(user),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Signin
export const signin = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    // Email validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    // Password validation
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required.",
      });
    }

    // Find user
    const user = await User.findOne({
      "personal_info.email": email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.personal_info.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password.",
      });
    }

    // Generate access token
    const accessToken = generateAccessToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      accessToken,
      user: formatUserResponse(user),
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
