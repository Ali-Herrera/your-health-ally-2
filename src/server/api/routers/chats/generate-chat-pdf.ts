import { z } from "zod";
import {
	createTRPCRouter,
	privateProcedure,
	publicProcedure,
} from "~/server/api/trpc";
import { PrismaClient, Chat } from "@prisma/client";
import { Author, AI_AUTHOR_ID } from "~/utils/types";
import { addUserDataToChats } from "~/utils/chat-utils";

const prisma = new PrismaClient();

// In your api.chat file
export const getById = async (id: string) => {
	return await prisma.chat.findUnique({
		where: { id },
	});
};
