import Head from "next/head";

import { Box, Button, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { NavBar } from "~/components/NavBar";
import { Header } from "~/components/header";
import { ChatContent, type ChatItem } from "~/components/Chat/ChatContent";
import { ChatInput } from "~/components/Chat/ChatInput";
import { api } from "~/utils/api";
import { useRef, useState } from "react";
import React from "react";

export default function Home() {
	const [opened, { toggle }] = useDisclosure();
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
		// // // setWaiting(true);

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
			<AppShell
				header={{ height: 60 }}
				navbar={{
					width: 300,
					breakpoint: "sm",
					collapsed: { mobile: !opened },
				}}
				padding="md"
			>
				<Header>
					<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
					<div>Logo</div>
				</Header>

				<NavBar />

				<AppShell.Main>
					<ChatContent chatItems={chatItems} />
					<ChatInput onUpdate={handleUpdate} />
				</AppShell.Main>
			</AppShell>
		</Box>
	);
}
// function setWaiting(arg0: boolean) {
//   throw new Error('Function not implemented.');
// }
