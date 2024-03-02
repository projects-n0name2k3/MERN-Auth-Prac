import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
export const verifyToken = async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  const data = jwt.verify(token, process.env.JWT_SECRET);
  try {
    const user = await User.findOne({ _id: data.id });
    if (!user) {
      return res
        .status(401)
        .send({ error: "Not authorized to access this resource" });
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    return res
      .status(401)
      .send({ error: "Not authorized to access this resource" });
  }
};
