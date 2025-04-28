export const generateRoomId = (user1Id, user2Id) => {
  // Sort IDs to ensure consistent room ID regardless of who initiates
  const sortedIds = [user1Id, user2Id].sort();
  return `${sortedIds[0]}_${sortedIds[1]}`;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};
