import { z } from 'zod';
// import { prisma } from '~/server/db';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { User, clerkClient } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import type { Chat } from '@prisma/client';

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
  };
};

const addUserDataToChats = async (chats: Chat[]) => {
  const userId = chats.map((chat) => chat.userId);
  const users = (
    await clerkClient.users.getUserList({
      userId: userId,
      limit: 10,
    })
  ).map(filterUserForClient);

  return chats.map((chat) => {
    const user = users.find((user) => user.id === chat.userId);

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
      orderBy: [{ createdAt: 'desc' }],
    });

    return addUserDataToChats(chats);
  }),
});

// export const chatRouter = createTRPCRouter({
//   create: publicProcedure
//     .input(z.object({ name: z.string().min(1) }))
//     .mutation(async ({ ctx, input, req }) => {
//       const session = await new Session(req);
//       const userId = session.userId;

//       // Create a new UserChatConversations record
//       const conversation = await ctx.prisma.userChatConversations.create({
//         data: {
//           userId,
//           title: input.name,
//         },
//       });

//       return conversation;
//     }),

//   getLatest: publicProcedure.query(({ ctx }) => {
//     return ctx.prisma.userChatMessages.findFirst({
//       orderBy: { createdAt: 'desc' },
//     });
//   }),
// });
