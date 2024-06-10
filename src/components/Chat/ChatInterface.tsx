import { Box } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { ChatContent, type ChatItem } from "~/components/Chat/ChatContent";
import { ChatInput } from "~/components/Chat/ChatInput";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Sidebar } from "../sidebar";
import { HeaderMobile } from "../header/mobileHeader";
import { Header } from "../header";
import { Author } from "~/utils/types";
import { useQueryClient } from "@tanstack/react-query";
const { jsPDF } = require("jspdf"); // will automatically load the node version

interface ChatInterfaceProps {
	userId: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ userId }) => {
	const mobileScreen = useMediaQuery("(max-width: 480px)");
	const [chatItems, setChatItems] = useState<ChatItem[]>([]);
	const [waiting, setWaiting] = useState<boolean>(false);
	const { isLoaded, user } = useUser();
	const [currentChat, setCurrentChat] = useState<string | null>(null);
	const queryClient = useQueryClient();

	// TRPC mutations
	const startNewChatMutation = api.chat.startNewChat.useMutation();
	const deleteChatMutation = api.delete.deleteChat.useMutation();

	const handleUpdate = (prompt: string, chatId: string, author: Author) => {
		setWaiting(true);
		setChatItems((prevChatItems) => [
			...prevChatItems,
			{ content: prompt, author: author },
		]);
		setWaiting(false);
	};

	const handleStartNewChat = async () => {
		try {
			const newChat = await startNewChatMutation.mutateAsync();
			const newChatId = newChat?.chatId ?? "";
			setCurrentChat(newChatId);
			setChatItems([]);
		} catch (error) {
			console.error("Failed to start new chat:", error);
		}
	};

	const handleDeleteChat = async (chatId: string) => {
		try {
			await deleteChatMutation.mutateAsync({ chatId });
			// Invalidate the query to refetch the chat list
			queryClient.invalidateQueries(["api.chat.getAll"]);
		} catch (error) {
			console.error("Error deleting chat:", error);
			// Handle error
		}
	};

	const handleRevisitChat = (chatId: string) => {
		setCurrentChat(chatId);
		// You can fetch the chat title here if needed
	};

	const handleGeneratePDF = (chatId: string) => {
		// setCurrentChat(chatId);

		// Generate PDF
		const doc = new jsPDF();
		doc.text(`Chat Transcript: ${chatId}`, 10, 10);
		chatItems.forEach((item, index) => {
			doc.text(`${item.author}: ${item.content}`, 10, 20 + index * 10);
		});
		doc.save(`chat-transcript-${chatId}.pdf`);
	};

	const getMessagesByChatId = api.chat.getMessagesByChatId.useQuery(
		{ chatId: currentChat || "" },
		{ enabled: !!currentChat }
	);

	useEffect(() => {
		if (getMessagesByChatId.data) {
			const messages: ChatItem[] = getMessagesByChatId.data.map(
				(message: any) => ({
					author: message.userId === userId ? "User" : "AI",
					content: message.content,
				})
			);
			setChatItems([...messages]);
		}
	}, [getMessagesByChatId.data]);

	return (
		<Box>
			{isLoaded && user && (
				<>
					{mobileScreen ? (
						<HeaderMobile
							onStartNewChat={handleStartNewChat}
							onRevisitChat={handleRevisitChat}
							onDeleteChat={handleDeleteChat}
							onGeneratePDF={handleGeneratePDF}
						/>
					) : (
						<Header />
					)}
					{!mobileScreen && (
						<Sidebar
							onStartNewChat={handleStartNewChat}
							onDeleteChat={handleDeleteChat}
							onRevisitChat={handleRevisitChat}
							onGeneratePDF={handleGeneratePDF}
							chats={undefined}
						/>
					)}
					<ChatContent chatItems={chatItems} loading={waiting} />
					<ChatInput
						onUpdate={handleUpdate}
						waiting={waiting}
						userId={user.id}
						currentChat={currentChat}
						onStartNewChat={handleStartNewChat}
					/>
				</>
			)}
		</Box>
	);
};

export default ChatInterface;
