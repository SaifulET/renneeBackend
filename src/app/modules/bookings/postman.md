# Messaging System Postman Documentation

## 1. Get Chat List
**Endpoint**: `GET {{BASE_URL}}/api/v1/message/get-chat-list`
**Headers**:
- `Authorization`: `Bearer {{TOKEN}}`

**Description**: Retrieves a list of all conversations for the logged-in user.

---

## 2. Get Single Conversation
**Endpoint**: `GET {{BASE_URL}}/api/v1/message/get_single_conversation/:receiverId`
**Params**:
- `receiverId`: The user ID of the person you are chatting with.

**Headers**:
- `Authorization`: `Bearer {{TOKEN}}`

**Description**: Retrieves the message history with a specific user.

---

## 3. Send Message
**Endpoint**: `POST {{BASE_URL}}/api/v1/message/send-message/:receiverId`
**Params**:
- `receiverId`: The user ID of the recipient.

**Headers**:
- `Authorization`: `Bearer {{TOKEN}}`
- `Content-Type`: `multipart/form-data` (if sending files) or `application/json`

**Body (Multipart/Form-Data)**:
| Key | Type | Value | Description |
|---|---|---|---|
| `text` | Text | "Hello user!" | The text content of the message |
| `images` | File | [Select File] | (Optional) Image file to upload |
| `data` | Text | `{"text": "Hello"}` | (Optional) Alternative if sending complex JSON |

**Body (JSON)**:
```json
{
  "text": "Hello user!",
  "images": ["https://example.com/image.jpg"] // Optional if sending pre-uploaded URLs
}
```

**Description**: Sends a message to a user. Supports text and image uploads.

---

## 4. Get Booking Details (with Chat Link)
**Endpoint**: `GET {{BASE_URL}}/api/v1/bookings/my-bookings/:id`
**Params**:
- `id`: The booking ID.

**Headers**:
- `Authorization`: `Bearer {{TOKEN}}`

**Description**: Retrieves booking details. Look for `conversationId` in the response to link to the chat.

---

## 5. Real-time Chat (Socket.IO)

This backend supports real-time messaging via Socket.IO.

### Connection
- **URL**: `{{BASE_URL}}` (e.g., `http://localhost:5000`)
- **Transport**: Websockets/Polling (Standard Socket.IO)

### Events

#### 1. Join Conversation
**Event Name**: `join_conversation`
**Payload**: `conversationId` (String) - Obtain this from the Booking Details response.
**Usage**: Call this immediately after entering the chat screen to listen for new messages in that channel.

#### 2. Receive Message (Listen)
**Event Name**: `receive_message`
**Payload**: `IMessage` object (same as API response).
**Usage**: Listen for this event to append new incoming messages to the UI in real-time.

#### 3. Send Message
**Method**: Use the REST API `POST /send-message/:receiverId`.
**Behavior**: The server will automatically emit `receive_message` to the socket room (conversationId) after saving the message to the database. You generally do not need to emit a socket event to send; just use the API.













Postman Chat Testing Guide
Follow these steps to test real-time chat using Postman.

Prerequisites
Ensure your backend server is running (e.g., http://localhost:5000).
Have the conversationId ready (e.g., 6985233924886c66d447f144).
Have the receiverId ready (e.g., 69827149c64b011d4f5d17ef for Consultant).
Step 1: Connect to Socket.IO
Open Postman.
Click New (top left) -> Socket.IO Request.
Enter the server URL: ws://localhost:5000 (Replace port if different).
Click Connect.
You should see "Connected" in green.
Step 2: Join the Conversation
In the Message tab of your Socket.IO request:
Event Name: join_conversation
Argument: 6985233924886c66d447f144 (Paste your conversationId here as a string, or JSON string "6985233924886c66d447f144" depending on Postman version, usually just the value in the text box details).
Tip: If Postman asks for format, select JSON and try "6985233924886c66d447f144".
Click Send.
Check your server terminal; it should log: User <socketId> joined conversation: ...
Step 3: Listen for Messages
In the Events tab (or just observe the log in the Socket.IO window):
Ensure Listen is active (usually strictly automatic in Postman for all events, or you can add a listener for receive_message).
You are now ready to receive messages.
Step 4: Send a Message (via REST API)
Open a new tab in Postman (HTTP Request).
Method: POST
URL: http://localhost:5000/api/v1/message/send-message/69827149c64b011d4f5d17ef (Replace with actual receiverId).
Headers:
Authorization: Bearer <YOUR_ACCESS_TOKEN>
Content-Type: application/json
Body (JSON):
json
{
  "text": "Hello from Postman!"
}
Click Send.
Step 5: Verify
Check the Socket.IO Request tab.
You should see a new event receive_message appear in the response log with the message details you just sent.