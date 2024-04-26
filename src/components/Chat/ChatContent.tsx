import {
	Box,
	Stack,
	Group,
	Avatar,
	Skeleton,
	Text,
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



	return (

			<Box
				ml={mobileScreen ? "0" : "250px"}
				h="65vh"
				sx={{ overflowY: "scroll", maxWidth: "100%" }}
			>
				{" "}
				<Stack spacing="md">
					{/* Render initial prompt only if no user messages exist */}
					{!userMessageExists && (
						<Group p="xl" sx={{ backgroundColor: "#E5E5E5" }}>
							<Avatar size={32} alt="ChatGBT" variant="gradient" mb="sm">
								AI
							</Avatar>

							<Text c={black}>
								I am an intelligent advisor that can provide information
								regarding people's health. I answer questions about
								health-related conditions and symptoms, and how to prepare for
								doctors appointments. This is for educational purposes only.
								Please see your healthcare provider for medical treatment.
							</Text>
						</Group>
					)}

					{/* Render chat items */}
					{chatItems.map((chatItem: ChatItem, index: number) => (
						<Box key={index} data-id={index}>
							{chatItem.author === "User" ? (
								<Group
									p="xl"
									sx={{ backgroundColor: "#E5E5E5" }}
									data-id={index}
								>
									<UserButton />
									{needDictionary && (
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
											{chatItem.content?.includes("\n") ? (
												<Text
													component="pre"
													sx={{
														wordWrap: "break-word",
														whiteSpace: "pre-wrap",
													}}
												>
													{chatItem.content}
												</Text>
											) : (
												<Text>{chatItem.content}</Text>
											)}
										</Tooltip>
									)}
								</Group>
							) : (
								<Group p="xl" data-id={index}>
									<Avatar size={32} alt="ChatGBT" variant="gradient" mb="sm">
										AI
									</Avatar>

									{chatItem.content?.includes("\n") ? (
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
											<Text
												component="pre"
												sx={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
											>
												{chatItem.content}
											</Text>
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
											events={{ hover: false, focus: true, touch: true }}
										>
											<Text>{chatItem.content}</Text>
										</Tooltip>
									)}
								</Group>
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

					{/* Empty div to scroll to when necessary */}
					<div ref={endOfChatRef} />
				</Stack>
			</Box>
	);
};
