import { prisma } from "../lib/prisma.js";

import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getusersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const search = req.query.search?.trim() || "";

    // Only fetch people who follow the logged-in user
    const friendships = await prisma.follower.findMany({
      where: {
        userId: loggedInUserId,
        status: "ACCEPTED",

        // Search ONLY within accepted followers
        ...(search && {
          follower: {
            is: {
              OR: [
                {
                  username: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            },
          },
        }),
      },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            name: true,
            profilePic: true,
            createdAt: true,
          },
        },
      },
    });

    // Extract followers
    const followers = friendships.map((friendship) => ({
      ...friendship.follower,
      lastMessageAt: null,
    }));

    if (followers.length === 0) {
      return res.status(200).json([]);
    }

    // Get follower IDs
    const followerIds = followers.map((user) => user.id);

    // Fetch conversations between logged-in user and followers
    const chats = await prisma.chat.findMany({
      where: {
        OR: [
          {
            userId: loggedInUserId,
            followerId: { in: followerIds },
          },
          {
            userId: { in: followerIds },
            followerId: loggedInUserId,
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        userId: true,
        followerId: true,
        createdAt: true,
      },
    });

    // Get latest message for each follower
    const latestChatMap = new Map();

    for (const chat of chats) {
      const friendId =
        chat.userId === loggedInUserId
          ? chat.followerId
          : chat.userId;

      if (!latestChatMap.has(friendId)) {
        latestChatMap.set(friendId, chat.createdAt);
      }
    }

    // Sort followers by conversation activity
    const sortedFollowers = followers
      .map((follower) => ({
        ...follower,
        lastMessageAt: latestChatMap.get(follower.id) || null,
      }))
      .sort((a, b) => {
        if (a.lastMessageAt && b.lastMessageAt) {
          return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
        }

        if (a.lastMessageAt) return -1;
        if (b.lastMessageAt) return 1;

        return new Date(b.createdAt) - new Date(a.createdAt);
      });

    return res.status(200).json(sortedFollowers);

  } catch (error) {
    console.error("Error in getusersForSidebar:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
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
          { userId: userToChatIntId, followerId: myId }
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
