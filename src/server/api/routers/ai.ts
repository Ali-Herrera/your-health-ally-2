import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { Configuration, OpenAIApi } from 'openai';
import { TRPCError } from '@trpc/server';
import axios from 'axios';
// import { prisma } from '~/server/db';

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

type MessageRole = 'user' | 'system' | 'assistant'; // Define MessageRole type

//Message type to store the conversation context
type Message = {
  role: MessageRole;
  content: string;
};

const messages: Message[] = [];

export const aiRouter = createTRPCRouter({
  generateText: publicProcedure
    .input(z.object({ prompt: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prompt } = input;

      console.log(prompt);

      // Prompt engineering
      messages.push({
        role: 'system',
        content:
          "You are an intelligent advisor that can provide information regarding people's health. You answer their questions about health-related conditions and symptoms, and what type of doctors they may want to see, and what types of questions to bring to the doctor with them and provide them with readiness checklists for appointments.",
      });

      //Provides context to the AI model by pushing the user's message to the conversation context
      await ctx.prisma.userChatMessages.create({
        data: {
          userId: ctx.auth.userId, // TODO: Replace with actual user ID from clerk
          content: prompt,
          role: 'user' as MessageRole,
        },
      });

      // Push user's message to the conversation context
      messages.push({
        role: 'user' as MessageRole,
        content: prompt,
      });

      try {
        const completion = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages,
        });

        const generatedText = completion.data.choices[0]?.message?.content;

        // Save AI's response to the database
        if (generatedText) {
          await ctx.prisma.userChatMessages.create({
            data: {
              userId: 'AI', // Assuming 'AI' as the default user ID for AI-generated messages
              content: generatedText,
              role: 'system',
            },
          });

          // Push AI's response to the conversation context
          messages.push({
            role: 'system',
            content: generatedText,
          });
        }

        return {
          generatedText,
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

  //Starts a new conversation
  startNewConversation: publicProcedure.mutation(() => {
    messages.length = 0;

    return {
      success: true,
    };
  }),
});
