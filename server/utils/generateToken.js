import jwt from "jsonwebtoken";

export function generateToken(user) {
  return jwt.sign(
    {
      user_id: user.user_id,
      mobile: user.mobile
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES || "7d"
    }
  );
}