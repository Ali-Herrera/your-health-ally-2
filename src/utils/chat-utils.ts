import { PrismaClient, Chat } from '@prisma/client';

const prisma = new PrismaClient();

export const addUserDataToChats = async (chats: Chat[]) => {
  const userIds = chats.map((chat) => chat.userId);
  const users = await prisma.chat.findMany({
    where: {
      userId: {
        in: userIds,
      },
    },
  });
  return chats.map((chat) => {
    const user = users.find((user) => user.userId === chat.userId);
    return {
      ...chat,
      user,
    };
  });
};
