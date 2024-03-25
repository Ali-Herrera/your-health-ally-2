import { Button, Group, Textarea } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconSend } from "@tabler/icons-react";
import { theme } from "../../config/theme";
import { useState, useEffect } from "react";

type Props = {
	onUpdate: (prompt: string) => void;
	waiting?: boolean;
};

export const ChatInput = ({ onUpdate, waiting }: Props) => {
	const isMobile = useMediaQuery("(max-width: 480px)");
	const { colors } = theme;

	const [prompt, setPrompt] = useState<string>("");
	const [rows, setRows] = useState<number>(2);

	useEffect(() => {
		const lines = prompt.split(/\r*\n/).length;
		setRows(Math.max(2, Math.min(lines, 8)));
	  }, [prompt]);

	const handleUpdate = () => {
		setPrompt("");
		onUpdate(prompt);
	};

	return (
		<Group position="center" ml={isMobile ? "lg" : "250px"} mr="lg">
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
				disabled={waiting}
				rows={rows}
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
