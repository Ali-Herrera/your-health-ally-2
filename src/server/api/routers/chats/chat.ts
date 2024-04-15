import { z } from 'zod';
// import { prisma } from '~/server/db';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { Session } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

export const chatRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.chat.findMany();
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
