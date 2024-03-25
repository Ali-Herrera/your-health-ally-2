// import { SignedIn, UserButton } from '@clerk/nextjs';
import { Button, Stack } from "@mantine/core";
import { theme } from "~/config/theme";
import { IconPlus } from "@tabler/icons-react";

const { colors, black } = theme;

export const Sidebar = () => {
	const { colors } = theme;
	const iconPlus = <IconPlus size={15} />;
	// export const Sidebar = ({ onReset, waiting }: Props)

	return (
		<Stack
			spacing="md"
			bg={colors?.darkPink?.[6]}
			w="250px"
			m={0}
			style={{
				position: "fixed",
				height: "100%",
				zIndex: "1" /* Stay on top */,
				top: "0" /* Stay at the top */,
				left: "0",
				overflowX: "hidden",
			}}
		>
			<Button
				mt="xl"
				m="lg"
				variant="white"
				color={colors?.darkPink?.[6]}
				leftIcon={iconPlus}
			>
				Start New Chat
			</Button>
		</Stack>
	);
};
