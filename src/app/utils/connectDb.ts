import httpStatus from "http-status";
import mongoose from "mongoose";
import AppError from "../errors/AppError";
import config from "../config";
import superAdmin from "./superAdmin";

let connecting: Promise<typeof mongoose> | null = null;
let adminReady = false;

const connectDb = () => {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose);
  }

  if (!config.database_url) {
    return Promise.reject(
      new AppError(
        httpStatus.SERVICE_UNAVAILABLE,
        "DATABASE_URL is not set on the server",
        ""
      )
    );
  }

  if (!connecting) {
    connecting = mongoose
      .connect(config.database_url, {
        serverSelectionTimeoutMS: 8000,
        family: 4,
      })
      .then(async (connection) => {
        if (!adminReady) {
          adminReady = true;
          try {
            await superAdmin();
          } catch (error) {
            console.error("Super admin setup failed", error);
          }
        }
        return connection;
      })
      .catch((error: unknown) => {
        connecting = null;
        const message =
          error instanceof Error ? error.message : "Database connection failed";
        throw new AppError(httpStatus.SERVICE_UNAVAILABLE, message, "");
      });
  }

  return connecting;
};

export default connectDb;
