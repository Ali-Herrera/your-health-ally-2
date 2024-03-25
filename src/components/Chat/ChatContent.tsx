import { Avatar, Box, Group, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { UserButton } from "@clerk/nextjs";
import { theme } from "~/config/theme";
import { type Author } from "~/utils/types";
import { useEffect } from "react";

export type ChatItem = {
	author: Author;
	content?: string;
	isError?: boolean;
};

type Props = {
	chatItems: ChatItem[];
	waiting?: boolean;
	onReset: () => void;
};

export const ChatContent = ({ chatItems, onReset }: Props) => {
	const mobileScreen = useMediaQuery("(max-width: 480px)");
	const { colors, black } = theme;

	useEffect(() => {
		
	}
	)

	return (
		<Box ml={mobileScreen ? "0" : "250px"} h="65vh" sx={{ overflow: "scroll" }}>
			{chatItems.map((chatItem: ChatItem, index: number) => (
				<Stack key={index} spacing="md">
					{chatItem.author === "User" ? (
						<Group
							p="xl"
							sx={{
								width: "100%",
								backgroundColor: "#E5E5E5",
							}}
						>
							<UserButton />
							<Text c="dimmed">{chatItem.content}</Text>
						</Group>
					) : (
						<Group p="xl">
							<Avatar size={32} alt="ChatGBT" variant="gradient">
								AI
							</Avatar>
							<Text c={black}>{chatItem.content}</Text>
						</Group>
					)}
				</Stack>
			))}
		</Box>
	);
};

{
	/* TODO: ERROR HANDLING
				 <div
            className={clsx("ml-5 mt-1 box-border", {
              "text-white": !chatItem.isError,
              "text-red-500": chatItem.isError,
            })}
          >   
          </div> */
}
