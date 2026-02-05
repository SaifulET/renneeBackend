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
