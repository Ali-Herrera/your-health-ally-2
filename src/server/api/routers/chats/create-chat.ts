import { z } from 'zod';
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from '~/server/api/trpc';
import { PrismaClient, Chat } from '@prisma/client';
import { Author, AI_AUTHOR_ID } from '~/utils/types';
import { addUserDataToChats } from '~/utils/chat-utils';

const prisma = new PrismaClient();

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
      return (await addUserDataToChats([chat]))[0];
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const chats = await ctx.prisma.chat.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
    });
    return addUserDataToChats(chats);
  }),

  create: privateProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        message: z.string(),
        chatId: z.string().optional(),
        userId: z.string(),
        orderField: z.number(),
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
          orderField: input.orderField,
        },
      });
      return { chatId, message: newMessage };
    }),

  startNewChat: privateProcedure.mutation(async ({ ctx, input = {} }) => {
    const chat = await ctx.prisma.chat.create({
      data: {
        userId: ctx.session.userId!,
        title: 'New Chat', // Add a value for the 'title' property
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
        orderField: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newMessage = await ctx.prisma.message.create({
        data: {
          chatId: input.chatId,
          userId: input.userId,
          content: input.message,
          orderField: input.orderField,
        },
      });
      return {
        chatId: input.chatId,
        message: newMessage,
      };
    }),
});
