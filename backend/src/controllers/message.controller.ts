import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getSiderUsers = async (req: any, res: any) => {
  try{
    const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");
    res.status(200).json(users);
  }catch(error){
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessages = async (req: any, res: any) => {
  try{
    const messages = await Message.find({ $or: [{ senderId: req.user._id, receiverId: req.params.id }, { senderId: req.params.id, receiverId: req.user._id }] });
    console.log(messages);
    res.status(200).json(messages);
  }catch(error){
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const sendMessage = async (req: any, res: any) => {
  try{
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      imageUrl: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  }catch(error){
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};