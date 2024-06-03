import { z } from 'zod';
import { createTRPCRouter, privateProcedure } from '~/server/api/trpc';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const deleteRouter = createTRPCRouter({
  deleteChat: privateProcedure
    .input(z.object({ chatId: z.string() }))
    .mutation(async ({ input }) => {
      try {
        // Delete associated messages
        await prisma.message.deleteMany({
          where: {
            chatId: input.chatId,
          },
        });

        // Then delete the chat itself
        await prisma.chat.delete({
          where: { id: input.chatId },
        });

        // Fetch and return the updated list of chats
        const chats = await prisma.chat.findMany();
        return chats;
      } catch (error) {
        console.error('Error deleting chat and associated messages:', error);
        throw new Error('Failed to delete chat and associated messages');
      }
    }),
});
