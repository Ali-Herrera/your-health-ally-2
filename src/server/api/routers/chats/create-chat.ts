import { z } from 'zod';
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from '~/server/api/trpc';
import { AI_AUTHOR_ID } from '~/utils/types';

export const chatRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const chat = await ctx.prisma.chat.findUnique({
        where: { id: input.id },
      });
      if (!chat) {
        throw new Error('Chat not found');
      }
      return chat;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const chats = await ctx.prisma.chat.findMany({
      take: 15,
      orderBy: { createdAt: 'desc' },
    });
    return chats;
  }),

  create: privateProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        message: z.string(),
        chatId: z.string().optional(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let chatId = input.chatId;
      if (!chatId) {
        const newChat = await ctx.prisma.chat.create({
          data: {
            userId: input.userId,
            title: input.title,
            description: input.description,
          },
        });
        chatId = newChat.id;
      }
      const newMessage = await ctx.prisma.message.create({
        data: {
          chatId,
          userId: input.userId,
          content: input.message,
        },
      });
      return { chatId, message: newMessage };
    }),

  startNewChat: privateProcedure.mutation(async ({ ctx }) => {
    const chat = await ctx.prisma.chat.create({
      data: {
        userId: ctx.session.userId!,
        title: '', // Placeholder title
      },
    });
    return { chatId: chat.id };
  }),

  continueChat: privateProcedure
    .input(
      z.object({
        message: z.string(),
        chatId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Fetch the chat including its associated messages
      const chatWithMessages = await ctx.prisma.chat.findUnique({
        where: { id: input.chatId },
        include: { messages: true },
      });

      if (!chatWithMessages) {
        throw new Error('Chat not found');
      }

      // Create the new message
      const newMessage = await ctx.prisma.message.create({
        data: {
          chat: {
            connect: { id: input.chatId }, // Associate the message with the chat
          },
          userId: input.userId,
          content: input.message,
        },
      });

      return {
        chatId: input.chatId,
        message: newMessage,
        previousMessages: chatWithMessages.messages, // Return the array of previous messages
      };
    }),

  update: privateProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedChat = await ctx.prisma.chat.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
        },
      });
      return updatedChat;
    }),

  getMessagesByChatId: publicProcedure
    .input(z.object({ chatId: z.string() }))
    .query(async ({ ctx, input }) => {
      const messages = await ctx.prisma.message.findMany({
        where: { chatId: input.chatId },
        orderBy: { createdAt: 'asc' },
      });
      return messages;
    }),
});
