import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/asyncCatch";
import sendResponse from "../../utils/sendResponse";
import { MessageService } from "./message.service";

import { uploadImageToCloudinary } from "../../utils/cloudinary";
import fs from "fs";

const sendMessage = catchAsync(async (req: Request, res: Response) => {
    const { receiverId } = req.params;
    const { text } = req.body;
    const user = (req as any).user;
    const senderId = user.userId;

    let imageUrls: string[] = [];

    // Check if images are passed in body (e.g. valid URLs)
    if (req.body.images && Array.isArray(req.body.images)) {
        imageUrls = [...req.body.images];
    }

    // Handle file uploads
    if (req.files && 'images' in req.files) {
        const files = (req.files as any)['images'];
        for (const file of files) {
            try {
                const uploadResult = await uploadImageToCloudinary(file.path, "messages");
                imageUrls.push(uploadResult.secure_url);
                // Delete file from local storage after upload
                fs.unlinkSync(file.path);
            } catch (error) {
                console.error("Error uploading image:", error);
                // Proceed or throw error? For now proceeded.
            }
        }
    }

    const result = await MessageService.sendMessage(
        senderId,
        receiverId,
        text,
        imageUrls
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Message sent successfully",
        data: result,
    });
});

const getConversation = catchAsync(async (req: Request, res: Response) => {
    const { receiverId } = req.params;
    const user = (req as any).user;
    const userId = user.userId;

    const result = await MessageService.getConversation(userId, receiverId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Conversation retrieved successfully",
        data: result,
    });
});

const getChatList = catchAsync(async (req: Request, res: Response) => {
    const user = (req as any).user;
    const userId = user.userId;

    const result = await MessageService.getChatList(userId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Chat list retrieved successfully",
        data: result,
    });
});

export const MessageController = {
    sendMessage,
    getConversation,
    getChatList,
};
