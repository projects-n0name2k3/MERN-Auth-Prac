import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "You need to be logged in" });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res
        .status(403)
        .json({ success: false, message: "Token is invalid" });
    req.user = user;
    next();
  });
};
