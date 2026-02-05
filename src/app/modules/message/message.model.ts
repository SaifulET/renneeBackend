import { Schema, model } from "mongoose";
import { IConversation, IMessage } from "./message.interface";

const ConversationSchema = new Schema<IConversation>(
    {
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: "users",
                required: true,
            },
        ],
        lastMessage: {
            type: String,
            default: "",
        },
        lastMessageTime: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const MessageSchema = new Schema<IMessage>(
    {
        conversationId: {
            type: Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
        },
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        receiverId: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        text: {
            type: String,
            default: "",
        },
        images: [
            {
                type: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Conversation = model<IConversation>(
    "Conversation",
    ConversationSchema
);
export const Message = model<IMessage>("Message", MessageSchema);
