import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Conversation, Message } from "./message.model";
import { Types } from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";

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

    if (senderId === receiverId) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Sender and Receiver IDs are same"
        );
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
    });


    console.log("conversation", conversation)

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


    console.log(newMessage)

    return newMessage;
};

const getConversation = async (userId: string, partnerId: string, query: Record<string, unknown>) => {
    const { page = 1, limit = 10 } = query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const conversation = await Conversation.findOne({
        participants: { $all: [userId, partnerId] },
    });

    if (!conversation) {
        return {
            meta: { page: pageNumber, limit: limitNumber, total: 0, totalPage: 0 },
            data: []
        };
    }

    const total = await Message.countDocuments({ conversationId: conversation._id });
    const totalPage = Math.ceil(total / limitNumber);

    const messages = await Message.find({
        conversationId: conversation._id,
    })
        .sort({ createdAt: -1 }) // Usually chat is fetched latest first for pagination
        .skip(skip)
        .limit(limitNumber);

    // Reverse to show in chronological order if needed, but standard pagination usually returns standard order.
    // However, for chat, often you want the *last* 10 messages. 
    // If I sort by -1, I get the last 10.
    // The frontend usually prepends them.
    // Let's stick to -1 (newest first).

    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPage
        },
        data: messages
    };
};

const getChatList = async (userId: string) => {
    const conversations = await Conversation.find({
        participants: userId,
    })
        .populate("participants", "fullname email profile_image") // Adjust fields based on User model
        .sort({ lastMessageTime: -1 });

    return conversations;
};

const sendMessageToConversation = async (
    conversationId: string,
    senderId: string,
    text: string,
    images: string[]
) => {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
        throw new AppError(httpStatus.NOT_FOUND, "Conversation not found");
    }

    const receiverId = conversation.participants.find(
        (p) => p.toString() !== senderId
    );

    if (!receiverId) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Could not determine receiver from conversation"
        );
    }

    return sendMessage(senderId, receiverId.toString(), text, images);
};

const getConversationMessages = async (conversationId: string, query: Record<string, unknown>) => {
    // Verify conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
        throw new AppError(httpStatus.NOT_FOUND, "Conversation not found");
    }

    // Use QueryBuilder for pagination and search
    const messageQuery = new QueryBuilder(
        Message.find({ conversationId }),
        query
    )
        .search(['text']) // Search in message text
        .filter()
        .sort() // Default sort by createdAt
        .paginate()
        .fields();

    const messages = await messageQuery.modelQuery
        .populate('senderId', 'fullname email photo')
        .populate('receiverId', 'fullname email photo')
        .sort({ createdAt: -1 }); // Show newest messages first

    const meta = await messageQuery.countTotal();

    return {
        meta,
        data: messages
    };
};

export const MessageService = {
    sendMessage,
    getConversation,
    getChatList,
    sendMessageToConversation,
    getConversationMessages,
};
