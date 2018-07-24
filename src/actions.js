
// action types
export const JOIN_CHAT = 'JOIN_CHAT';

// action creators
export function joinChat(roomId) {
  return { type: JOIN_CHAT, room: roomId }
};
