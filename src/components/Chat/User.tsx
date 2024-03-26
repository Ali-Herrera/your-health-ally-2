import { Group, Text } from "@mantine/core";
import { UserButton } from "@clerk/nextjs";
import { type Author } from "~/utils/types";

export type ChatItem = {
	author: Author;
	content?: string;
	isError?: boolean;
};

type Props = {
	chatItems: ChatItem[];
};

export const UserChat = ({ chatItems }: Props) => {
	return chatItems.map((chatItem: ChatItem, index: number) => (
		<Group
			key={index}
			p="xl"
			sx={{
				width: "100%",
				backgroundColor: "#E5E5E5",
			}}
		>
			<UserButton />
			<Text c="dimmed">{chatItem.content}</Text>
		</Group>
	));
};
