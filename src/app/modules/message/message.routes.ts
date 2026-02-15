import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { MessageController } from "./message.controller";

import upload from "../../utils/uploadFile";

const router = express.Router();

router.post(
    ["/send-message", "/send-message/:conversationId"],
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.consultant,
        USER_ROLE.buyer
    ),
    upload.fields([{ name: "images", maxCount: 5 }]),
    (req, res, next) => {
        if (req.body.data) {
            req.body = JSON.parse(req.body.data);
        }
        next();
    },
    MessageController.sendMessage
);

router.get(
    "/get_single_conversation/:receiverId",
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.consultant,
        USER_ROLE.buyer
    ),
    MessageController.getConversation
);

router.get(
    "/get-chat-list",
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.consultant,
        USER_ROLE.buyer
    ),
    MessageController.getChatList
);

export const MessageRoutes = router;
