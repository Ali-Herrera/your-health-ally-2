import { Box, Button, Flex, Space, Stack, Text } from "@mantine/core";
import { theme } from "../config/theme";

type Props = {
	onReset: () => void;
};

export const Sidebar = ({ onReset }: Props) => {
	const { colors, white } = theme;

	return (
		<Flex
			justify="flex-start"
			align="center"
			direction="column"
			sx={{
				margin: "0",
				padding: "10px",
				position: "fixed",
				width: "250px",
				height: "100%",
				zIndex: 20,
				top: "0",
				left: "0",
				overflowX: "hidden",
				backgroundColor: colors?.darkPink?.[6],
			}}
		>
			<Space h="lg" />
			<Box h={100} sx={{ borderBottom: colors?.darkPink?.[9] }}>
				<Button onClick={onReset}>Start New Chat</Button>
			</Box>

			<Stack
				h={300}
				// bg="var(--mantine-color-body)"
				align="stretch"
				justify="center"
				// gap="lg"
			>
				<Text c={white}>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit...
				</Text>
				<Button.Group>
					<Button
						variant="white"
						size="compact-md"
						sx={{ marginBottom: "10px", border: "1px solid #4C1732" }}
					>
						Open
					</Button>
					<Button
						variant="white"
						size="compact-md"
						sx={{ marginBottom: "10px", border: "1px solid #4C1732" }}
					>
						Delete
					</Button>
				</Button.Group>
			</Stack>
		</Flex>
	);
};
