import { Button, Group, Textarea } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { theme } from "../../config/theme";
import { useState } from "react";

type Props = {
	onUpdate: (prompt: string) => void;
};

export const ChatInput = ({ onUpdate }: Props) => {
	const { colors } = theme;

	const [prompt, setPrompt] = useState<string>("");
	const handleUpdate = () => {
		setPrompt("");
		onUpdate(prompt);
	};

	return (
		<Group position="center">
			<Textarea
				placeholder="What questions do you have?"
				aria-label="Type your message here"
				radius="md"
				style={{
					width: "90%",
				}}
				value={prompt}
				onChange={(e) => setPrompt(e.currentTarget.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter" && !e.shiftKey) {
						handleUpdate();
					}
				}}
			/>
			<Button
				size="sm"
				radius="md"
				aria-label="Send message"
				sx={{
					backgroundColor: colors?.darkPink?.[6],
				}}
				onClick={handleUpdate}
			>
				<IconSend size={20} style={{ bottom: "5px", alignSelf: "center" }} />
			</Button>
		</Group>
	);
};
