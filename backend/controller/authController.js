import bcrypt from "bcryptjs";
import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

export const registerController = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Field must not be empty" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 8 characters. " });
    }

    const hashPass = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashPass,
    });

    res.status(200).json({ user: user._id });
  } catch (error) {
    res.status(500).json({message:"Server Error: Registration"})
    console.log("Error on rgistering: ", error);
  }
};

export const loginController = async (req, res) => {
try {
      const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Field must not be empty" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be atleast 8 characters. " });
  }

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  const verifyPass = await bcrypt.compare(password, user.password);

  if (!verifyPass) {
    return res.status(500).json({ message: "Invalid Credentials" });
  }

  const accessToken = await generateAccessToken(user._id);
  const refreshToken = await generateRefreshToken(user._id);

  user.refreshTokens.push(refreshToken);

  await user.save();

  res.json({ accessToken, refreshToken });
} catch (error) {
    res.status(500).json({message:"Server Error: Login"})
    console.log("Error on Login: ", error);
}
};

export const tokenController = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {

    const payload = jwt.verify(token, REFRESH_SECRET);
    const user = await User.findById(payload.id);
    if (!user || !user.refreshTokens.includes(token)) {
      return res.status(400).json({message: "Invalid Refresh Token"});
    }

    user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
    const newRefreshToken = generateRefreshToken(user);
    user.refreshTokens.push(newRefreshToken);
    await user.save();

    const accessToken = generateAccessToken(user);
    res.json({ accessToken, refreshToken: newRefreshToken });

  } catch (err) {
    console.log("Token Error: ",err)
    res.status(500).json({message:"Token Generation Error"});
  }
};
