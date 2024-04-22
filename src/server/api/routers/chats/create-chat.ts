import { z } from 'zod';
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from '~/server/api/trpc';
import { PrismaClient, Chat } from '@prisma/client';

const prisma = new PrismaClient();

// Function to add user data to chats
const addUserDataToChats = async (chats: Chat[]) => {
  // Fetch user data for each chat
  const userIds = chats.map((chat) => chat.userId);

  // Fetch user data for the given user IDs
  const users = await prisma.chat.findMany({
    where: {
      userId: {
        in: userIds,
      },
    },
  });

  // Map user data to chats
  return chats.map((chat) => {
    const user = users.find((user) => user.userId === chat.userId);
    return {
      ...chat,
      user,
    };
  });
};

export const chatRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // Fetch chat by id
      const chat = await ctx.prisma.chat.findUnique({
        where: { id: input.id },
      });

      if (!chat) {
        throw new Error('Chat not found');
      }

      // Add user data to the chat
      return (await addUserDataToChats([chat]))[0];
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    // Fetch all chats
    const chats = await ctx.prisma.chat.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
    });

    // Add user data to the chats
    return addUserDataToChats(chats);
  }),

  create: privateProcedure
    .input(
      z.object({
        message: z.string(),
        chatId: z.string().optional(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let chatId = input.chatId;

      // If chatId is not provided, create a new chat
      if (!chatId) {
        // Create a new chat
        const newChat = await ctx.prisma.chat.create({
          data: {
            userId: input.userId,
            title: 'New Chat',
          },
        });
        chatId = newChat.id;
      }

      // Create a new message associated with the chatId
      const newMessage = await ctx.prisma.message.create({
        data: {
          chatId,
          userId: input.userId,
          content: input.message,
        },
      });

      return newMessage;
    }),

  startNewChat: privateProcedure.mutation(async ({ ctx }) => {
    // Create a new chat
    const chat = await ctx.prisma.chat.create({
      data: {
        userId: ctx.session.userId!,
        title: 'New Chat',
      },
    });

    // Return the ID of the new chat
    return {
      chatId: chat.id,
    };
  }),
});
