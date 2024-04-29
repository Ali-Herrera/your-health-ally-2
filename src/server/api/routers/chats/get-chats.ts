import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { PrismaClient, Chat } from '@prisma/client';
import { addUserDataToChats } from '~/utils/chat-utils';

const prisma = new PrismaClient();

export const getChatsRouter = createTRPCRouter({
  getAllChats: publicProcedure.query(async ({ ctx }) => {
    const chats = await prisma.chat.findMany({
      take: 10, // Adjust as needed
      orderBy: { createdAt: 'desc' },
    });
    return addUserDataToChats(chats);
  }),

  getChatById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const chat = await prisma.chat.findUnique({
        where: { id: input.id },
      });
      if (!chat) {
        throw new Error('Chat not found');
      }
      const chatsWithUserData = await addUserDataToChats([chat]);
      return chatsWithUserData[0];
    }),
});
