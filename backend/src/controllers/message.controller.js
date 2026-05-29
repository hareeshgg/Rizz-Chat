import { prisma } from "../lib/prisma.js";

import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getusersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const filteredUsers = await prisma.user.findMany({
      where: {
        id: {
          not: loggedInUserId
        }
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        profilePic: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getusersForSidebar:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user.id;

    const userToChatIntId = parseInt(userToChatId, 10);
    const messages = await prisma.chat.findMany({
      where: {
        OR: [
          { userId: myId, followerId: userToChatIntId },
          { followerId: userToChatIntId, userId: myId }
        ]
      }
    })

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const userId = req.user.id;
    const { text, image } = req.body;

    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await prisma.chat.create({
      data: {
        userId,
        followerId: parseInt(receiverId, 10),
        text,
        image: imageUrl,
      }
    })

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
