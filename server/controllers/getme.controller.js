export const getMe = (req, res) => {
  try {
    const user = req.user; // from verifyToken middleware

    res.json({
      success: true,
      user
    });
  } catch (err) {
    res.status(401).json({ success: false });
  }
};