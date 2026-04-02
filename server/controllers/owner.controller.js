import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";

import {
  createOwner,
  findOwnerByEmail,
  findOwnerById,
  updateOwner,
  getOwnerTurfCount
} from "../models/owner.model.js";


// 1️⃣ REGISTER OWNER
export async function registerOwner(req, res) {
  try {
    const { name, mobile, email, password } = req.body;

    // check existing
    const existing = await findOwnerByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const ownerId = await createOwner(
      name,
      mobile,
      email,
      hashedPassword
    );

    const token = generateToken({ user_id: ownerId, role: "owner" }); // reuse token
    res.cookie("token", token, {
  httpOnly: true,
  secure: false, // true in production
  maxAge: 7 * 24 * 60 * 60 * 1000
});

    res.json({
      success: true,
      message: "Owner registered",
      
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


// 2️⃣ GET OWNER PROFILE
export async function getOwnerProfile(req, res) {
  try {
    const ownerId = req.user.user_id;

    const owner = await findOwnerById(ownerId);

    const totalTurfs = await getOwnerTurfCount(ownerId);

    res.json({
      ...owner,
      total_turfs: totalTurfs
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


// 3️⃣ UPDATE OWNER PROFILE
export async function updateOwnerProfile(req, res) {
  try {
    const ownerId = req.user.user_id;
    const { name, mobile } = req.body;

    await updateOwner(ownerId, name, mobile);

    res.json({
      success: true,
      message: "Profile updated"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


// 4️⃣ LOGIN OWNER
export async function loginOwner(req, res) {
  try {
    const { email, password } = req.body;

    // check owner
    const owner = await findOwnerByEmail(email);

    if (!owner) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, owner.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    // generate token
    const token = generateToken({
      user_id: owner.owner_id,
      role: "owner" // 🔥 important
    });


    res.cookie("token", token, {
  httpOnly: true,
  secure: false, // true in production
  maxAge: 7 * 24 * 60 * 60 * 1000
});

    res.json({
      success: true,
      message: "Login successful"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}