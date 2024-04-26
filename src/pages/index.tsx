import { Box, Group, Text } from "@mantine/core";
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
import styles from "./index.module.css";

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
	// Create a ref for the tooltip
	const tooltipRef = useRef<HTMLDivElement | null>(null);
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

	useEffect(() => {
		const handleMouseUp = (event: MouseEvent) => {
			event.preventDefault();

			if (tooltipRef.current) {
				const tooltip = tooltipRef.current;
				const selection = window.getSelection();

				if (selection?.isCollapsed || selection == null) {
					setNeedDictionary(false); // Hide tooltip
					return;
				}
				setNeedDictionary(true); // Show tooltip

				const selectedText = selection.toString().trim();
				getDictionary(selectedText);

				const rect = selection.getRangeAt(0).getBoundingClientRect();
				tooltip.style.display = "block";
				// prettier-ignore
				tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.clientWidth / 2}px`;
				tooltip.style.top = `${rect.top - tooltip.clientHeight}px`;
			}
		};

		// Add event listener when the component mounts
		document.addEventListener("mouseup", handleMouseUp);

		// Remove event listener when the component unmounts
		return () => {
			document.removeEventListener("mouseup", handleMouseUp);
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
					<div
						ref={tooltipRef}
						style={{
							position: "absolute",
							zIndex: 100,
							backgroundColor: "#1a1910",
							borderRadius: "5px",
							padding: "0px 10px",
							color: "white",
							display: "none", // Uncomment this line once no errors
						}}
					>
						<p
							style={{
								fontSize: "14px",
								padding: "5px 10px",
							}}
						>
							{needDictionary ? textDefinition : "Select a word to define"}
						</p>
						<div
							style={{
								content: '""',
								display: "block",
								border: "5px solid",
								borderColor: "#1a1910 transparent transparent transparent",
								position: "absolute",
								left: "50%",
								transform: "translateX(-50%)",
							}}
						></div>
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
