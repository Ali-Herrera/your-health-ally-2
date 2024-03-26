import { Box, Stack, Group, Avatar, Skeleton, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { type Author } from "~/utils/types";
// import { UserChat } from "./User";
// import { AIChat } from "./AI";
import { UserButton } from "@clerk/nextjs";
import { theme } from "~/config/theme";

export type ChatItem = {
	author: Author;
	content?: string;
	isError?: boolean;
};

export type Props = {
	chatItems: ChatItem[];
	onReset: () => void;
};

export const ChatContent = ({ chatItems, onReset }: Props) => {
	const mobileScreen = useMediaQuery("(max-width: 480px)");
	const { black } = theme;


	if (chatItems === undefined) {
		return (
			<Box
				ml={mobileScreen ? "0" : "250px"}
				h="65vh"
				sx={{ overflow: "scroll" }}
			>
				<Stack spacing="md">
					<Group p="xl">
						<Skeleton height={32} circle mb="sm" />
						<Skeleton height={12} radius="xl" mb="sm" />
						<Skeleton height={12} radius="xl" width="70%" />
					</Group>
				</Stack>
			</Box>
		);
	} else {
		return (
			<Box
				ml={mobileScreen ? "0" : "250px"}
				h="65vh"
				sx={{ overflow: "scroll" }}
			>
				{chatItems.map((chatItem: ChatItem, index: number) => (
					<Stack spacing="md" key={index}>
						{chatItem.author === "User" ? (
							<Group p="xl" sx={{ backgroundColor: "#E5E5E5" }}>
								<UserButton />
								<Text c="dimmed">{chatItem.content}</Text>
							</Group>
						) : (
							<Group p="xl">
								<Avatar size={32} alt="ChatGBT" variant="gradient" mb="sm">
									AI
								</Avatar>
								<Text c={black}>{chatItem.content}</Text>
							</Group>
						)}
					</Stack>
				))}
			</Box>
		);
	}
};
