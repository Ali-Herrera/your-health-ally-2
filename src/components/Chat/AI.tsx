import { Avatar, Group, Skeleton, Text } from "@mantine/core";
import { theme } from "~/config/theme";
import { type Author } from "~/utils/types";

export type ChatItem = {
	author: Author;
	content?: string;
	isError?: boolean;
};

type Props = {
	chatItems: ChatItem[];
	// onReset: () => void;
};

export const AIChat = ({ chatItems }: Props) => {
	const { black } = theme;

	if (!chatItems) {
		return (
			<Group p="xl">
				<Skeleton height={32} circle mb="sm" />
				<Skeleton height={8} radius="xl" />
				<Skeleton height={8} mt={6} radius="xl" />
				<Skeleton height={8} mt={6} width="70%" radius="xl" />
			</Group>
		);
	} else {
		return chatItems.map((chatItem: ChatItem, index: number) => (
			<Group p="xl" key={index}>
				<Avatar size={32} alt="ChatGBT" variant="gradient" mb="sm">
					AI
				</Avatar>
				<Text c={black}>{chatItem.content}</Text>
			</Group>
		));
	}
};
