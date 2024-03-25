import {
	Avatar,
	Box,
	Group,
	Loader,
	Skeleton,
	Stack,
	Text,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { UserButton } from "@clerk/nextjs";
import { theme } from "~/config/theme";
import { type Author } from "~/utils/types";
import { useState, useEffect } from "react";

export type ChatItem = {
	author: Author;
	content?: string;
	isError?: boolean;
};

type Props = {
	chatItems: ChatItem[];
	waiting?: boolean;
	onReset?: (prompt: string) => void;
};

export const ChatContent = ({ chatItems, onReset, waiting }: Props) => {
	const mobileScreen = useMediaQuery("(max-width: 480px)");
	const { colors, black } = theme;


	return (
		<Box ml={mobileScreen ? "lg" : "250px"} mr="lg" h="70vh">
      <Stack spacing="md" mb="xl">
			{chatItems.map((chatItem: ChatItem, index: number) => (
					{chatItem.author === "User" ? (
						<Group
            
							p="xl"
							sx={{
								borderRadius: "10px",
							}}
						>
							<UserButton />
							<Text c="dimmed">{chatItem.content}</Text>
						</Group>
					) : waiting ? (
							<Loader color={black} variant="dots" size="md" m="xl" />
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
          ))}
          </Stack>
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
