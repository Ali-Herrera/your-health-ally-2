import { PrismaClient, Chat, Message } from "@prisma/client";

const prisma = new PrismaClient();

interface ChatWithMessages extends Chat {
	messages: Message[];
}

async function getChatHistoryWithMessages(
	chatId: string
): Promise<ChatWithMessages | null> {
	return await prisma.chat.findUnique({
		where: { id: chatId },
		include: { messages: true }, // Include messages in the result
	});
}
