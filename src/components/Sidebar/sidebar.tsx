// import { SignedIn, UserButton } from '@clerk/nextjs';
import { Button, Stack } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { theme } from "~/config/theme";
import { IconPlus } from "@tabler/icons-react";

const { colors, black } = theme;

export const Sidebar = () => {
	const [mobileOpened, { open, close }] = useDisclosure();
	const { colors } = theme;
	const iconPlus = <IconPlus size={15} />;

	return (
		<Button
			mt="xl"
			variant="white"
			color={colors?.darkPink?.[6]}
			leftIcon={iconPlus}
		>
			Start New Chat
		</Button>
	);
};
