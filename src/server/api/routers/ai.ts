import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { Configuration, OpenAIApi } from 'openai';
import { TRPCError } from '@trpc/server';
import axios from 'axios';

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

type Message = {
  role: 'user' | 'system' | 'assistant';
  content: string;
};

const messages: Message[] = [];

export const aiRouter = createTRPCRouter({
  generateText: publicProcedure
    .input(z.object({ prompt: z.string() }))
    .mutation(async ({ input }) => {
      const { prompt } = input;

      console.log(prompt);

      // Prompt engineering
      messages.push({
        role: 'system',
        content:
          "You are an intelligent advisor that can provide information regarding people's health. You answer their questions about health-related conditions and symptoms, and what type of doctors they may want to see, and what types of questions to bring to the doctor with them and provide them with readiness checklists for appointments.",
      });

      messages.push({
        role: 'user',
        content: prompt,
      });

      try {
        const completion = await openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages,
        });

        const generatedText = completion.data.choices[0]?.message?.content;

        if (generatedText) {
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
});
