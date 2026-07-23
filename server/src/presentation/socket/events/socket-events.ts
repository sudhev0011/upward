export const SocketEvents = {
  // Connection
  DISCONNECT: "disconnect",

  // Conversation
  JOIN_CONVERSATION: "join_conversation",
  LEAVE_CONVERSATION: "leave_conversation",
  CONVERSATION_UPDATED: "conversation_updated",

  // Messages
  SEND_MESSAGE: "send_message",
  MESSAGE_RECEIVED: "message_received",

  DELETE_MESSAGE: "delete_message",
  MESSAGE_DELETED: "message_deleted",

  READ_MESSAGES: "read_messages",
  MESSAGES_READ: "messages_read",

  MESSAGES_DELIVERED: "messages_delivered",

  // Reactions
  SEND_MESSAGE_REACTION: "send_message_reaction",
  MESSAGE_REACTION_UPDATED: "message_reaction_updated",
} as const;