import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";

import httpStatus from "http-status";
import AppError from "./app/errors/AppError";



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

        socket.on("join_conversation", (conversationId) => {
          socket.join(conversationId);
          console.log(`User ${socket.id} joined conversation: ${conversationId}`);
        });

        socket.on("send_message", (data) => {
          // data should contain conversationId
          if (data.conversationId) {
            socket.to(data.conversationId).emit("receive_message", data);
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
