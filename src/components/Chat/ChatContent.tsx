import { Avatar, Box, Group, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { UserButton } from "@clerk/nextjs";
import { theme } from "~/config/theme";
import { type Author } from "~/utils/types";

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
	const isMobile = useMediaQuery("(max-width: 480px)");
	const { colors, black } = theme;

	return (
		<Box
			ml={isMobile ? "lg" : "250px"}
			mr="lg"
			h="70vh"
			sx={{ overflow: "scroll" }}
		>
			{chatItems.map((chatItem: ChatItem, index: number) => (
				<Stack key={index} spacing="md" m="xl">
					{chatItem.author === "User" ? (
						<Group
							p="xl"
							sx={{
								borderRadius: "10px",
								backgroundColor: "#E5E5E5",
							}}
						>
							<UserButton />
							<Text c="dimmed">{chatItem.content}</Text>
						</Group>
					) : (
						<Group
							p="xl"
							sx={{
								borderRadius: "10px",
							}}
						>
							<Avatar color={colors?.darkPink?.[6]} size="md">
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
