import { Box, Group, Text, Tooltip } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Welcome } from "../components/Welcome";
import { Sidebar } from "../components/sidebar";
import { Header } from "~/components/header";
import { HeaderMobile } from "~/components/header/mobileHeader";
import { Footer } from "~/components/footer";
import { ChatContent, type ChatItem } from "../components/chat/ChatContent";
import { ChatInput } from "../components/chat/ChatInput";
import { api } from "~/utils/api";
import React, { useState, useEffect, useRef } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { theme } from "~/config/theme";

export default function Home() {
	const mobileScreen = useMediaQuery("(max-width: 480px)");

	const { black, colors } = theme;

	const [chatItems, setChatItems] = useState<ChatItem[]>([]);
	const [waiting, setWaiting] = useState<boolean>(false);

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

		onSettled: () => {
			setWaiting(false);
		},
	});

	const resetMutation = api.ai.reset.useMutation();

	const handleUpdate = (prompt: string) => {
		setWaiting(true);

		setChatItems([
			...chatItems,
			{
				content: prompt.replace(/\n/g, "\n\n"),
				author: "User",
			},
		]);

		console.log("User sent a message:", prompt);
		console.log("Before calling mutate:", chatItems);
		console.log("Prompt value:", prompt);

		generatedTextMutation.mutate({ prompt });

		console.log("After calling mutate:", chatItems);
	};
	const handleReset = () => {
		setChatItems([]);
		resetMutation.mutate();
	};

	// START HOVER DEFINITION FUNCTIONALITY
	// TODO: Decide if this should be a separate component
	const [needDictionary, setNeedDictionary] = useState<boolean>(false);
	const [textDefinition, setTextDefinition] = useState("");
	// Define the initial state for the tooltip position
	const initialTooltipPosition = { top: 0, left: 0 };
	// Create a state variable for the tooltip position and a function to update it
	const [tooltipPosition, setTooltipPosition] = useState(
		initialTooltipPosition
	);

	// Function to handle mouseup event
	const getDictionary = async (text: string) => {
		try {
			const response = await fetch(
				`https://api.dictionaryapi.dev/api/v2/entries/en/${text}`
			);
			const data = await response.json();
			if (!data) {
				setTextDefinition(
					"Hmm. No definition found. You can try again at later time or head to the web instead."
				);
			}

			console.log("dictionaryapi response: ", data);

			const definedText = data[0].meanings.map(
				(info: {
					partOfSpeech: string;
					definitions: Array<{ definition: string }>;
				}) => {
					const partOfSpeech = info.partOfSpeech;
					const definition = info.definitions?.map((item) => item.definition);
					return `${partOfSpeech}: ${definition}`;
				}
			);

			console.log("definedText: ", definedText);

			setTextDefinition(definedText.join(" | "));

			console.log("dictionary: ", textDefinition);
		} catch (error) {
			console.error("Error fetching definition: ", error);
			setTextDefinition(
				"Whoops! Error fetching definition. You can try again at later time or head to the web instead."
			);
		}
	};

	// Add event listener for mouseup event when component mounts
	useEffect(() => {
		document.addEventListener("mouseup", (event: MouseEvent) => {
			event.preventDefault();

			const selection = window.getSelection();
			const tooltip = document.querySelector(".mantine-Tooltip-tooltip");

			if (selection?.isCollapsed || selection == null) {
				setNeedDictionary(false); // Hide tooltip
				return;
			}
			const range = selection?.getRangeAt(0);
			const rect = range?.getBoundingClientRect();
			setNeedDictionary(true); // Show tooltip
			setTooltipPosition({ top: rect.top, left: rect.left });
			if (tooltip) {
				tooltip.styles.left = `${rect.left}px`;
				tooltip.style.top = `${rect.top}px`;
			}

			const text = selection.toString();
			getDictionary(text);
		});

		//Remove event listener when component unmounts
		return () => {
			document.removeEventListener("mouseup", (event: MouseEvent) => {
				event.preventDefault();
				setNeedDictionary(false);
				setTextDefinition("");
				setTooltipPosition({ top: 0, left: 0 });
			});
		};
	}, []);

	const { isLoaded, user } = useUser();
	return (
		<>
			{isLoaded && !user && (
				<>
					<Welcome />
					<Group className="h-screen">
						<UserButton afterSignOutUrl="/" />
					</Group>
				</>
			)}

			{isLoaded && user && (
				<Box>
					<div className="tooltipGlossary">
						<div className="tooltipContent tooltipitem">
							<Text>Definition Here</Text>
						</div>
					</div>

					{mobileScreen ? <HeaderMobile onReset={handleReset} /> : <Header />}
					{mobileScreen ? null : <Sidebar onReset={handleReset} />}
					<ChatContent
						chatItems={chatItems}
						onReset={handleReset}
						loading={waiting}
					/>
					<ChatInput onUpdate={handleUpdate} waiting={waiting} />
					<Footer />
				</Box>
			)}
		</>
	);
}
