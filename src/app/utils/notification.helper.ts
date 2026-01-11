import admin from "./firebase";

export const sendPushNotification = async (
  fcmToken: string,
  title: string,
  body: string,
  data?: Record<string, string>
) => {
  if (!fcmToken) return;

  try {
    const message = {
      notification: {
        title,
        body,
      },
      data,
      token: fcmToken,
    };

    const response = await admin.messaging().send(message);
    console.log("Successfully sent message:", response);
    return response;
  } catch (error) {
    console.log("Error sending message:", error);
    // don't throw, just log
  }
};
