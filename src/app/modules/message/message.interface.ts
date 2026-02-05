import { Types, Document } from "mongoose";

export interface IMessage {
    conversationId: Types.ObjectId;
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    text?: string;
    images?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IConversation {
    participants: Types.ObjectId[];
    lastMessage?: string;
    lastMessageTime?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
