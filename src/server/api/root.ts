// import { postRouter } from '~/server/api/routers/post';
import { createTRPCRouter } from '~/server/api/trpc';
import { aiRouter } from './routers/ai';
import { chatRouter } from './routers/chats/create-chat';
import { TRPCError } from '~/server/api/trpc';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */

export const appRouter = createTRPCRouter({
  chat: chatRouter,
  // chat: {
  //   ...chatRouter,
  //   create: async ({ ctx, input }: { ctx: any; input: any }) => {
  //     if (chatRouter.create) {
  //       try {
  //         // Invoke the create mutation from the chatRouter
  //         const result = await chatRouter.create({
  //           ctx: ctx as any, // Explicitly cast ctx to any if necessary
  //           input,
  //           rawInput: undefined,
  //           path: '',
  //           type: 'query',
  //         });

  //         return result;
  //       } catch (error) {
  //         // Handle any errors
  //         const trpcError: TRPCError = new TRPCError({
  //           code: 'INTERNAL_SERVER_ERROR',
  //           message: 'Failed to create chat',
  //           cause: (error as Error).message, // Explicitly cast 'error' to 'Error' type
  //         });
  //         throw trpcError;
  //       }
  //     } else {
  //       throw new Error('Create mutation is not defined in chatRouter');
  //     }
  //   },
  // },
  ai: aiRouter,
});

// export const appRouter = createTRPCRouter({
//   chat: chatRouter,
//   ai: aiRouter,
// });

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
// export const createCaller = createCallerFactory(appRouter);
