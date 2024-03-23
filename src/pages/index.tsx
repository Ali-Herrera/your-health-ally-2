import { Box } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { Header } from "~/components/header";
import { Sidebar } from "~/components/Sidebar/sidebar";
import { Footer } from "~/components/footer";
import { ChatContent, type ChatItem } from "~/components/Chat/ChatContent";
import { ChatInput } from "~/components/Chat/ChatInput";
import { api } from "~/utils/api";
import { useRef, useState } from "react";
import React from "react";

export default function Home() {
	const isMobile = useMediaQuery("(max-width: 480px)");

	const [chatItems, setChatItems] = useState<ChatItem[]>([]);
	const scrollToRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		setTimeout(
			() => scrollToRef.current?.scrollIntoView({ behavior: "smooth" }),
			100
		);
	};

	const generatedTextMutation = api.ai.generateText.useMutation({
		onSuccess: (data) => {
			setChatItems([
				...chatItems,
				{
					content: data.generatedText,
					author: "AI",
				},
			]);
		},

		onError: (error) => {
			setChatItems([
				...chatItems,
				{
					content: error.message ?? "An error occurred",
					author: "AI",
					isError: true,
				},
			]);
		},

		// onSettled: () => {
		//   setWaiting(false);
		//   scrollToBottom();
		// },
	});

	// const resetMutation = api.ai.reset.useMutation();

	const handleUpdate = (prompt: string) => {
		// setWaiting(true);

		setChatItems([
			...chatItems,
			{
				content: prompt.replace(/\n/g, "\n\n"),
				author: "User",
			},
		]);

		scrollToBottom();

		console.log("User sent a message:", prompt);
		console.log("Before calling mutate:", chatItems);
		console.log("Prompt value:", prompt);

		generatedTextMutation.mutate({ prompt });

		console.log("After calling mutate:", chatItems);
		console.log("OpenAI API Key:", process.env.NEXT_PUBLIC_OPENAI_API_KEY);
	};

	return (
		<Box>
			<Header />
			{isMobile ? null : <Sidebar />}
			<ChatContent chatItems={chatItems} />
			<ChatInput onUpdate={handleUpdate} />
			<Footer />
		</Box>
	);
}

// function setWaiting(arg0: boolean) {
//   throw new Error('Function not implemented.');
// }
