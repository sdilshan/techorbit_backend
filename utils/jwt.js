import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      username: user.personal_info.username,
    },
    process.env.SECRET_ACCESS_KEY,
    {
      expiresIn: "1h",
    }
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.SECRET_ACCESS_KEY);
};