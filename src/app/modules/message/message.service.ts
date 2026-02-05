import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Conversation, Message } from "./message.model";
import { Types } from "mongoose";

const sendMessage = async (
    senderId: string,
    receiverId: string,
    text: string,
    images: string[]
) => {
    if (!senderId || !receiverId) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Sender and Receiver IDs are required"
        );
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
        conversation = await Conversation.create({
            participants: [senderId, receiverId],
        });
    }

    // Create message
    const newMessage = await Message.create({
        conversationId: conversation._id,
        senderId,
        receiverId,
        text,
        images,
    });

    // Update conversation with last message
    conversation.lastMessage = text || "Sent an image";
    conversation.lastMessageTime = new Date();
    await conversation.save();

    // Socket.io integration
    const io = (global as any).io;
    if (io) {
        io.to(conversation._id.toString()).emit("receive_message", newMessage);
    }

    return newMessage;
};

const getConversation = async (userId: string, partnerId: string) => {
    const conversation = await Conversation.findOne({
        participants: { $all: [userId, partnerId] },
    });

    if (!conversation) {
        return [];
    }

    const messages = await Message.find({
        conversationId: conversation._id,
    }).sort({ createdAt: 1 });

    return messages;
};

const getChatList = async (userId: string) => {
    const conversations = await Conversation.find({
        participants: userId,
    })
        .populate("participants", "fullname email profile_image") // Adjust fields based on User model
        .sort({ lastMessageTime: -1 });

    return conversations;
};

export const MessageService = {
    sendMessage,
    getConversation,
    getChatList,
};
