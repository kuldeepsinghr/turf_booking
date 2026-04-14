import {
  findUserByMobile,
  createUser,
  saveOTP,
  getValidOTP,
  markOTPVerified,
  findUserById
} from "../models/user.model.js";

import { generateOTP } from "../utils/generateOtp.js";
import { generateToken } from "../utils/generateToken.js";


// 1. SEND OTP
export async function sendOtp(req, res) {
  try {
    const { mobile, name } = req.body;

    const otp = generateOTP();

    const expiresAt = new Date(Date.now() + 1 * 60 * 1000); // 1 min

    await saveOTP(mobile, otp, expiresAt);

     
    console.log("OTP:", otp); // TEMP (later SMS)

    res.json({
      success: true,
      message: "OTP sent"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


// 2. VERIFY OTP
export async function verifyOtp(req, res) {
  try {
    const { mobile, otp, name } = req.body;

    const record = await getValidOTP(mobile, otp);

    if (!record) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await markOTPVerified(record.id);

    let user = await findUserByMobile(mobile);

    if (!user) {
      const userId = await createUser(name, mobile);
      user = { user_id: userId, mobile, name };
    }

    // 🔥 generate token
    const token = generateToken(user);

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
  httpOnly: true,
  secure: false, // true in production (https)
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

    res.json({
      success: true,
        message: "OTP verified successfully",
      user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


// 3. GET PROFILE
export async function getProfile(req, res) {
  try {
    const userId = req.user.user_id;

    const user = await findUserById(userId);

    res.json({
        success: true,
        message: "User profile fetched successfully",
        user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


// ✅ 1. LOGIN / REGISTER (SINGLE API)
export async function loginOrRegister(req, res) {
  try {
    const { name, mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required"
      });
    }

    let user = await findUserByMobile(mobile);

    // 👉 If user not exists → create
    if (!user) {
      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Name is required for new user"
        });
      }

      const userId = await createUser(name, mobile);

      user = {
        user_id: userId,
        name,
        mobile
      };
    }

    // ✅ Generate token
    const token = generateToken(user);

    // ✅ Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: "Login successful",
      user
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
}