import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { Configuration, OpenAIApi } from 'openai';
import { TRPCError } from '@trpc/server';
import axios from 'axios';
import { User, clerkClient } from '@clerk/nextjs/server';

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

//Message type to store the conversation context
type Message = {
  role: 'user' | 'system' | 'assistant';
  content: string;
  chatId: string;
};

const messages: Message[] = [];

export const aiRouter = createTRPCRouter({
  generateText: publicProcedure
    .input(z.object({ prompt: z.string(), chatId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { prompt, chatId } = input;

      console.log(prompt);

      // // Get the current chat or create a new one if chatId is not provided
      // const currentChat = chatId
      //   ? await ctx.prisma.chat.findUnique({
      //       where: { id: chatId },
      //     })
      //   : await ctx.prisma.chat.create({
      //       data: {
      //         title: 'New Chat',
      //         // Add other necessary fields for a new chat
      //       },
      //     });

      // Prompt engineering
      const systemMessage =
        "You are an intelligent advisor that can provide information regarding people's health. You answer their questions about health-related conditions and symptoms, and what type of doctors they may want to see, and what types of questions to bring to the doctor with them and provide them with readiness checklists for appointments.";

      messages.push({
        role: 'system',
        content: systemMessage,
        chatId, // Associate message with chat
      });

      // Save system's message to the database
      await ctx.prisma.message.create({
        data: {
          userId: 'system', // or use the ID for system
          content: systemMessage,
          chatId,
        },
      });

      //Provides context to the AI model by pushing the user's message to the conversation context
      await ctx.prisma.message.create({
        data: {
          userId: ctx.session.userId!,
          content: prompt,
          chatId, // Associate message with chat
        },
      });

      try {
        const completion = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        });

        const generatedText = completion.data.choices[0]?.message?.content;

        // Pushes the AI response to the conversation context
        if (generatedText) {
          // Save assistant's message to the database
          await ctx.prisma.message.create({
            data: {
              userId: 'assistant', // or use the ID for assistant
              content: generatedText,
              chatId, // Associate message with chat
            },
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
  //Resets the conversation context
  reset: publicProcedure.mutation(() => {
    messages.length = 0;
  }),
});
