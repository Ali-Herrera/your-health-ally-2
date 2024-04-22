import {
	Box,
	Stack,
	Group,
	Avatar,
	Skeleton,
	Text,
	List,
	Tooltip,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { type Author } from "~/utils/types";
import { UserButton } from "@clerk/nextjs";
import { theme } from "~/config/theme";
import { useState, useEffect, useRef } from "react";

export type ChatItem = {
	author: Author;
	content?: string;
	isError?: boolean;
};

export type Props = {
	chatItems: ChatItem[];
	onReset: () => void;
	loading: boolean;
};

export const ChatContent = ({ chatItems, loading }: Props) => {
	const mobileScreen = useMediaQuery("(max-width: 480px)");
	const { black, colors } = theme;

	// State to track if any user messages exist
	const [userMessageExists, setUserMessageExists] = useState(false);

	// Check if any user messages exist
	const checkUserMessages = () => {
		const exists = chatItems.some(
			(item) => item.author === "User" && item.content
		);
		setUserMessageExists(exists);
	};

	// Ref for scrolling to bottom
	const endOfChatRef = useRef<HTMLDivElement>(null);

	// Function to scroll to bottom of chat
	const scrollToBottom = () => {
		endOfChatRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	// Call the function to check user messages when component mounts or chat items change
	useEffect(() => {
		checkUserMessages();
		scrollToBottom();
	}, [chatItems]);

	// START HOVER DEFINITION FUNCTIONALITY
	// TODO: Decide if this should be a separate component
	// TODO: Decide if Tooltip should be rendered for entire element or inline with the selected text
	const [needDictionary, setNeedDictionary] = useState<boolean>(false);
	const [textDefinition, setTextDefinition] = useState("");
	const [selected, setSelected] = useState({ text: "", element: null });

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
		document.addEventListener("mouseup", handleSelectedText);

		return () => {
			document.removeEventListener("mouseup", handleSelectedText);
		};
	}, []);

	const handleSelectedText = () => {
		const text = window.getSelection().toString();
		const element = window.getSelection().anchorNode.parentNode;
		if (!text) {
			// If the selected text is empty, return without doing anything
			return;
		}
		setSelected({ text, element });
		setNeedDictionary(true);
	};

	// Call getDictionary when needDictionary changes to true
	useEffect(() => {
		if (needDictionary) {
			getDictionary(selected.text);
			setNeedDictionary(false);
		}
	}, [needDictionary]);

	return (
		<Box
			ml={mobileScreen ? "0" : "250px"}
			h="65vh"
			sx={{ overflowY: "scroll", maxWidth: "100%" }}
		>
			<Stack spacing="md">
				{/* Render initial prompt only if no user messages exist */}
				{!userMessageExists && (
					<Group p="xl" sx={{ backgroundColor: "#E5E5E5" }}>
						<Avatar size={32} alt="ChatGBT" variant="gradient" mb="sm">
							AI
						</Avatar>

						<Tooltip
							label={textDefinition}
							color={black}
							position="top"
							closeDelay={900}
							multiline
							withArrow
							opened={needDictionary}
							events={{ hover: false, focus: true, touch: true }}
						>
							<Text c={black}>
								I am an intelligent advisor that can provide information
								regarding people's health. I answer questions about
								health-related conditions and symptoms, and how to prepare for
								doctors appointments. This is for educational purposes only.
								Please see your healthcare provider for medical treatment.
							</Text>
						</Tooltip>
					</Group>
				)}

				{/* Render chat items */}
				{chatItems.map((chatItem: ChatItem, index: number) => (
					<Box key={index}>
						{chatItem.author === "User" ? (
							<Tooltip
								label={textDefinition}
								color={black}
								position="top"
								closeDelay={900}
								multiline
								withArrow
								opened={needDictionary}
								events={{ hover: false, focus: false, touch: false }}
							>
								<Group p="xl" sx={{ backgroundColor: "#E5E5E5" }}>
									<UserButton />
									{chatItem.content?.includes("\n") ? (
										<Text
											component="pre"
											sx={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
										>
											{chatItem.content}
										</Text>
									) : chatItem.content?.startsWith("- ") ? (
										<List>
											{chatItem.content.split("\n").map((item, idx) => (
												<List.Item key={idx}>{item}</List.Item>
											))}
										</List>
									) : (
										<Text>{chatItem.content}</Text>
									)}
								</Group>
							</Tooltip>
						) : (
							<Tooltip
								label={textDefinition}
								color={black}
								position="top"
								closeDelay={900}
								multiline
								withArrow
								opened={needDictionary}
								events={{ hover: false, focus: false, touch: false }}
							>
								<Group p="xl">
									<Avatar size={32} alt="ChatGBT" variant="gradient" mb="sm">
										AI
									</Avatar>
									{chatItem.content?.includes("\n") ? (
										<Text
											component="pre"
											sx={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
										>
											{chatItem.content}
										</Text>
									) : chatItem.content?.startsWith("- ") ? (
										<List>
											{chatItem.content.split("\n").map((item, idx) => (
												<List.Item key={idx}>{item}</List.Item>
											))}
										</List>
									) : (
										<Text>{chatItem.content}</Text>
									)}
								</Group>
							</Tooltip>
						)}
					</Box>
				))}

				{/* Display skeleton loading animation below loaded chat end if loading */}
				{loading && (
					<Group p="xl">
						<Skeleton height={32} circle />
						<Skeleton height={8} radius="xl" />
						<Skeleton height={8} radius="xl" width="70%" />
					</Group>
				)}

				{/* NOT INLINE WITH REST OF COMPONENT: Display Definition Component if text is selected
				{definitionNeeded && selectedText && (
					<DefinitionTool selected={definitionNeeded} text={selectedText} />
				)} */}

				{/* Empty div to scroll to when necessary */}
				<div ref={endOfChatRef} />
			</Stack>
		</Box>
	);
};
