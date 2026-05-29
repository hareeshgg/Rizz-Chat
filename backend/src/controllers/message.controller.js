import { prisma } from "../lib/prisma.js";

import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getusersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;

    // Find all accepted friendships for the logged-in user
    const friendships = await prisma.follower.findMany({
      where: {
        OR: [
          { userId: loggedInUserId, status: "ACCEPTED" },
          { followerId: loggedInUserId, status: "ACCEPTED" }
        ]
      },
      include: {
        user: true,
        follower: true
      }
    });

    // Map friendships to retrieve the actual friend's User profile
    const friends = friendships.map(friendship => {
      const friend = friendship.userId === loggedInUserId ? friendship.follower : friendship.user;
      return {
        id: friend.id,
        email: friend.email,
        username: friend.username,
        name: friend.name,
        profilePic: friend.profilePic,
        createdAt: friend.createdAt,
        updatedAt: friend.updatedAt
      };
    });

    return res.status(200).json(friends);
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
