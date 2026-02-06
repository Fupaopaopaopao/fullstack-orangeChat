import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateJWT } from "../lib/util.js";
import cloudinary from "../lib/cloudinary.js";

//写逻辑 保证try catch 包裹
export const signup = async (req: any, res: any) => {
  //我们使用 express.json() 来解析请求体 所以req.body 是已经解析好的对象
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }

    const user = await User.findOne({ email }); //await 等待findOne执行完成

    if (user) {
      return res.status(400).json({ message: "Email already existed." });
    }

    const salt = await bcrypt.genSalt(10); //生成随机盐
    const hashPassword = await bcrypt.hash(password, salt); //加密密码

    // create new user
    const newUser = new User({
      fullName: fullName,
      email: email,
      password: hashPassword,
    });

    if (newUser) {
      await newUser.save();
      generateJWT(newUser._id, res); //生成jwt

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ message: "Invalid User Data" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password." });
    }
    generateJWT(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const logout = (req: any, res: any) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const updateProfile = async (req: any, res: any) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic) {
      return res.status(400).json({ message: "Profile picture is required." });
    }
    const result = await cloudinary.uploader.upload(profilePic);
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: result.secure_url },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const checkAuth = async (req: any, res: any) => {
  try {
    res.status(200).json({
      _id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      profilePic: req.user.profilePic,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
