import Head from "next/head";
import { AppShell, Button, Box, Group, Stack, Burger } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
// import { Sidebar } from "~/components/Sidebar";
// import { Header } from "~/components/Header";
import { ChatContent, type ChatItem } from "~/components/Chat/ChatContent";
import { ChatInput } from "~/components/Chat/ChatInput";
import { api } from "~/utils/api";
import { useRef, useState } from "react";
import React from "react";
import { theme } from "~/config/theme";
import PinkLogo from "../../public/logo/logo-pink-dark.png";
import Image from "next/image";
import { IconPlus } from "@tabler/icons-react";

export default function Home() {
	const { colors, white } = theme;
	const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
	// const isMobile = useMediaQuery("(max-width: 480px)");
	const iconPlus = <IconPlus size={15} />;

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
		<AppShell
			header={{ height: 80 }}
			layout="alt"
			aside={{
				width: 250,
				breakpoint: "sm",
				collapsed: { mobile: !mobileOpened },
			}}
		>
			<AppShell.Header bg={white}>
				<Group m="md" justify="flex-start" style={{ alignContent: "center" }}>
					<Burger
						opened={mobileOpened}
						onClick={toggleMobile}
						hiddenFrom="sm"
						size="sm"
					/>

					<Image
						src={PinkLogo}
						alt="Your Health Ally Logo"
						//Original Size 1920 by 1080...Reduced to 96 by 54 (5% of original size)
						width={96}
						height={54}
					/>
					{/* <SignedIn>
          <UserButton />
        </SignedIn> */}
				</Group>
			</AppShell.Header>
			<AppShell.Navbar
				bg={colors?.darkPink?.[6]}
				style={{
					borderColor: colors?.darkPink?.[9],
				}}
			>
				<Box m="md">
					{/* {isMobile ? <Button
						mt="xl"
						variant="white"
						color={colors?.darkPink?.[6]}
						onClick={toggleMobile}
						visibleFrom="sm"
					>
						Close
					</Button> : null} */}
					<Button
						mt="xl"
						variant="white"
						color={colors?.darkPink?.[6]}
						leftSection={iconPlus}
						justify="center"
					>
						Start New Chat
					</Button>
				</Box>
			</AppShell.Navbar>

			<AppShell.Main>
				<Button onClick={toggleMobile} visibleFrom="sm"></Button>
				<ChatContent chatItems={chatItems} />
				<ChatInput onUpdate={handleUpdate} />
			</AppShell.Main>
		</AppShell>
	);
}
{
	/* // function setWaiting(arg0: boolean) {
//   throw new Error('Function not implemented.');
// } */
}
