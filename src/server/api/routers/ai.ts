import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { Configuration, OpenAIApi } from 'openai';
import { TRPCError } from '@trpc/server';
import axios from 'axios';
import { AI_AUTHOR_ID } from '~/utils/types';

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Define the Message type to store the conversation context
type Message = {
  role: 'user' | 'system';
  content: string;
};

// Create TRPC router for AI operations
export const aiRouter = createTRPCRouter({
  generateText: publicProcedure
    .input(
      z.object({
        prompt: z.string(),
        chatId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { prompt, chatId } = input;

      try {
        // Fetch the chat by its ID to ensure it exists
        const chat = await ctx.prisma.chat.findUnique({
          where: { id: chatId },
        });

        if (!chat) {
          throw new Error('Chat not found');
        }

        // Fetch previous messages for the chat to use as context
        const previousMessages = await ctx.prisma.message.findMany({
          where: { chatId },
          orderBy: { createdAt: 'asc' },
        });

        // Create a messages array to provide context to the AI model
        const messages: Message[] = previousMessages.map((message) => ({
          role: message.userId === AI_AUTHOR_ID ? 'system' : 'user',
          content: message.content,
        }));

        // Add the new user message to the context
        messages.push({
          role: 'user',
          content: prompt,
        });

        // Call createChatCompletion to generate AI text based on the prompt and context
        const completion = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages,
        });

        const generatedText = completion.data.choices[0]?.message?.content;

        // Save the generated AI response to the database
        const newMessage = await ctx.prisma.message.create({
          data: {
            chatId,
            userId: AI_AUTHOR_ID,
            content: generatedText?.toString() ?? '',
          },
        });

        // Return the generated text and previous messages
        return {
          generatedText,
          previousMessages,
        };
      } catch (error: unknown) {
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
});
