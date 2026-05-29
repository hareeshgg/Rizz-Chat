import { prisma } from "../lib/prisma.js";

export const getusersFromSearch = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;
        const { query } = req.query;

        if (!query || !query.trim()) {
            return res.status(200).json([]);
        }

        // Find all matched users
        const searchUsers = await prisma.user.findMany({
            where: {
                NOT: {
                    id: loggedInUserId
                },
                OR: [
                    {
                        username: {
                            contains: query || "",
                            mode: "insensitive"
                        }
                    },
                    {
                        name: {
                            contains: query || "",
                            mode: "insensitive"
                        }
                    }
                ]
            },
            select: {
                id: true,
                username: true,
                name: true,
                profilePic: true
            }
        });

        // Find all active follower connections for the logged-in user
        const activeConnections = await prisma.follower.findMany({
            where: {
                OR: [
                    { userId: loggedInUserId },
                    { followerId: loggedInUserId }
                ]
            }
        });

        // Keep a set of all user IDs the logged-in user is connected with
        const connectedUserIds = new Set();
        activeConnections.forEach(conn => {
            if (conn.userId === loggedInUserId) {
                connectedUserIds.add(conn.followerId);
            } else {
                connectedUserIds.add(conn.userId);
            }
        });

        const usersWithFollowStatus = searchUsers.map(user => {
            const isFollowing = connectedUserIds.has(user.id);
            return {
                id: user.id,
                username: user.username,
                name: user.name,
                profilePic: user.profilePic,
                isFollowing
            };
        });

        return res.status(200).json(usersWithFollowStatus);
    } catch (error) {
        console.log("Error in getusersFromSearch:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const toggleFollow = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;
        const { id: targetUserId } = req.params;

        const targetUserIntId = parseInt(targetUserId, 10);
        if (isNaN(targetUserIntId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        if (loggedInUserId === targetUserIntId) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        // Check if any follower relationship already exists in either direction
        const existingFollow = await prisma.follower.findFirst({
            where: {
                OR: [
                    { userId: loggedInUserId, followerId: targetUserIntId },
                    { userId: targetUserIntId, followerId: loggedInUserId }
                ]
            }
        });

        if (existingFollow) {
            // Unfollow - delete the relationship
            await prisma.follower.delete({
                where: {
                    id: existingFollow.id
                }
            });
            return res.status(200).json({ message: "Unfollowed successfully", isFollowing: false });
        } else {
            // Follow - create standard ACCEPTED relationship
            await prisma.follower.create({
                data: {
                    userId: loggedInUserId,
                    followerId: targetUserIntId,
                    status: "ACCEPTED"
                }
            });
            return res.status(201).json({ message: "Followed successfully", isFollowing: true });
        }
    } catch (error) {
        console.log("Error in toggleFollow:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
