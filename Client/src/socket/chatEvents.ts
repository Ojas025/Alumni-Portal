export const ChatEventsEnum = {

    // Connection & Errors
    CONNECT: "connect",
    DISCONNECT: "disconnect",
    SOCKET_ERROR: "socket_error",
    AUTH_ERROR: "auth_error",
    USER_STATUS: 'user-status',
    UPDATE_CHAT: 'update-chat',
  
    // Messaging
    SEND_MESSAGE: "send_message",
    RECEIVE_MESSAGE: "receive_message",
    DELETE_MESSAGE: "delete_message",
    EDIT_MESSAGE: "edit_message",
    MESSAGE_DELIVERED: "message_delivered",
    MESSAGE_READ: "message_read",
  
    // Chat Room
    JOIN_CHAT: "join_chat",
    LEAVE_CHAT: "leave_chat",
    NEW_CHAT_CREATED: "new_chat_created",
  
    // Typing
    TYPING: "typing",
    STOP_TYPING: "stop_typing",
  
    // File Sharing
    SEND_FILE: "send_file",
    RECEIVE_FILE: "receive_file",
  
    // User Presence
    ONLINE_USERS: "online_users",
    USER_ONLINE: "user_online",
    USER_OFFLINE: "user_offline",
  
    // Notifications
    NEW_NOTIFICATION: "new_notification",
};
  
export type ChatEvents = typeof ChatEventsEnum[keyof typeof ChatEventsEnum];
  