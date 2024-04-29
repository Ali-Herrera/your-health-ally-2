import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { Configuration, OpenAIApi } from 'openai';
import { TRPCError } from '@trpc/server';
import axios from 'axios';
import { chatRouter } from './chats/create-chat';
import { api } from '~/utils/api';
import { AI_AUTHOR_ID, Author } from '~/utils/types';

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

//Message type to store the conversation context
type Message = {
  role: 'user' | 'system';
  content: string;
  // author: Author; // Add the author field
};

const messages: Message[] = [];

// type GenerateTextInput = {
//   prompt: string;
//   chatId: string;
// };

// Create TRPC router for AI operations
export const aiRouter = createTRPCRouter({
  // Mutation to generate text based on a prompt and chat context
  generateText: publicProcedure
    .input(
      z.object({
        prompt: z.string(),
        chatId: z.string() /*author: z.string()*/,
      })
    ) // Include chatId in the input schema
    .mutation(async ({ input, ctx }) => {
      const { prompt, chatId /* author */ } = input; // Extract prompt and chatId from input

      try {
        // Fetch the chat by its ID to ensure it exists
        const chat = await ctx.prisma.chat.findUnique({
          where: { id: chatId },
        });

        // Check if the chat exists
        if (!chat) {
          throw new Error('Chat not found');
        }

        // Provides context to the AI model by pushing the user's message to the conversation context
        messages.push({
          role: 'user',
          content: prompt,
          // author: 'User',
        });

        // Call createChatCompletion to generate AI text based on the prompt and context
        const completion = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages,
        });

        // Extract the generated text from the completion
        const generatedText = completion.data.choices[0]?.message?.content;

        // Save the generated AI response to the database
        const newMessage = await ctx.prisma.message.create({
          data: {
            chatId,
            userId: AI_AUTHOR_ID, // Replace '<AI_USER_ID>' with the ID representing the AI user
            content: generatedText?.toString() ?? '',
            // author: 'AI', // Add the author property
          },
        });

        // Push the AI response to the conversation context
        if (generatedText) {
          messages.push({
            role: 'system',
            content: generatedText,
            // author: 'AI',
          });
        }

        // Return the generated text
        return {
          generatedText,
        };
      } catch (error: unknown) {
        // Handle errors
        if (axios.isAxiosError(error)) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: error.response?.data?.error?.message,
          });
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }),

  // Mutation to reset conversation context
  reset: publicProcedure.mutation(() => {
    // Reset conversation context logic
    messages.length = 0; // Clear the messages array
  }),
});

// export const aiRouter = createTRPCRouter({
//   generateText: publicProcedure

//     .input(z.object({ prompt: z.string() /* chatId: z.string() */ })) // Add chatId to the input schema
//     .mutation(async ({ input, ctx }) => {
//       const { prompt } = input;
//       console.log('Input received:', input);

//       // Call startNewChat to generate a new chatId
//       const { chatId } = await api.chat.startNewChat.useMutation();

//       console.log(prompt);

//       // Prompt engineering
//       messages.push({
//         role: 'system',
//         content:
//           "You are an intelligent advisor that can provide information regarding people's health. You answer their questions about health-related conditions and symptoms, and what type of doctors they may want to see, and what types of questions to bring to the doctor with them and provide them with readiness checklists for appointments.",
//       });

//       //Provides context to the AI model by pushing the user's message to the conversation context
//       messages.push({
//         role: 'user',
//         content: prompt,
//       });

//       try {
//         const completion = await openai.createChatCompletion({
//           model: 'gpt-3.5-turbo',
//           messages,
//         });

//         const generatedText = completion.data.choices[0]?.message?.content;

//         //Pushes the AI response to the conversation context
//         if (generatedText) {
//           messages.push({
//             role: 'system',
//             content: generatedText,
//           });
//         }

//         // Save the user's message and AI response to the database
//         // await ctx.prisma.message.createMany({
//         //   data: [
//         //     { content: prompt, chatId, role: 'user' as 'user' }, // Add 'role' property with value 'user'
//         //     { content: generatedText || '', chatId, role: 'system' as 'system' }, // Add 'role' property with value 'system'
//         //   ],
//         // });

//         return {
//           generatedText,
//         };
//       } catch (error: unknown) {
//         if (axios.isAxiosError(error)) {
//           throw new TRPCError({
//             code: 'INTERNAL_SERVER_ERROR',
//             message: error.response?.data?.error?.message,
//           });
//         }

//         throw new TRPCError({
//           code: 'INTERNAL_SERVER_ERROR',
//           message: error instanceof Error ? error.message : 'Unknown error',
//         });
//       }
//     }),

//   //Resets the conversation context
//   reset: publicProcedure.mutation(() => {
//     messages.length = 0;
//   }),
// });
