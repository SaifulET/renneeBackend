import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";

import httpStatus from "http-status";
import AppError from "./app/errors/AppError";
import { MessageService } from "./app/modules/message/message.service";
import { Conversation } from "./app/modules/message/message.model";



let server: HttpServer | null = null;


type channelName = string;
const channelClients = new Map<channelName, Set<WebSocket>>();

function safeSend(ws: WebSocket, data: unknown) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

function broadcastToChannel(
  channelName: channelName,
  data: unknown,
  excludeSocket: WebSocket | null = null
) {
  const clients = channelClients.get(channelName);
  if (!clients) return;
  for (const client of clients) {
    if (client.readyState !== WebSocket.OPEN) continue;
    if (excludeSocket && client === excludeSocket) continue;
    safeSend(client, data);
  }
}

// Heartbeat helper to detect dead connections


async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log("database connected successfully");

    server = app.listen(config.port, () => {
      console.log(` app listening http://${config.host}:${config.port}`);
    });

    // Socket.io setup
    if (server) {
      const io = new Server(server, {
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
        },
      });

      // Store the io instance globally if needed, or just use it here
      (global as any).io = io;

      io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("join_conversation", (data) => {
          // data should be { conversationid, myuserid }
          // Case-insensitive handling or strict? User asked for specific keys.
          // Let's support the user's request.
          const conversationId = data?.conversationId || data?.conversationid;
          const userId = data?.myUserId || data?.myuserid;

          if (!conversationId || !userId) {
            console.log(`Join failed: Missing conversationId or myuserId for socket ${socket.id}`);
            socket.emit("error", { message: "conversationid and myuserid are required to join" });
            return;
          }

          socket.join(conversationId);
          console.log(`User ${userId} (Socket: ${socket.id}) joined conversation: ${conversationId}`);

          // Emit confirmation back to the user
          socket.emit("join_confirmation", {
            success: true,
            message: `Successfully joined conversation ${conversationId}`,
            conversationId,
            userId
          });
        });

        socket.on("send_message", async (data) => {
          // data should contain conversationId
          try {


            console.log("send_message", data)

            if (data.conversationId) {


              // If the message needs to be persisted:
              if (data.senderId && data.text) {



                const isExistReciverId = await Conversation.findOne({ _id: data.conversationId }, {
                  participants: 1
                });
                const receiverId = isExistReciverId?.participants.find((p) => p.toString() !== data.senderId);




                if (receiverId && data.senderId) {
                  const savedMessage = await MessageService.sendMessage(
                    data.senderId,
                    receiverId.toString(),
                    data.text,
                    data.images || []
                  );
                }
              }
              //else {socket.to(data.conversationId).emit("receive_message", data);}
            }
          } catch (error: any) {
            console.error("Socket error processing message:", error);
            socket.emit("error", { message: error.message || "Failed to process message" });
          }
        });

        socket.on("disconnect", () => {
          console.log("User disconnected:", socket.id);
        });
      });
    }











    process.on("unhandledRejection", () => {
      if (server) {
        server.close(() => {
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    });

    process.on("uncaughtException", () => {
      if (server) {
        server.close(() => {
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    });

    process.on("SIGTERM", () => {
      console.log("SIGTERM received");
      if (server) {
        server.close(() => {
          console.log("Server closed due to SIGTERM");
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    });

    process.on("SIGINT", () => {
      console.log("SIGINT received");
      if (server) {
        server.close(() => {
          console.log("Server closed due to SIGINT");
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    });
  } catch (err: any) {
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      "server unavailable",
      err
    );
  }
}

main().then(() => {
  console.log("-- renee reefschlaeger server is running---");
});
