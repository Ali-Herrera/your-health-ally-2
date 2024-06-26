import { Footer as MantineFooter, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { theme } from "~/config/theme";

export const Footer = () => {
	const mobileScreen = useMediaQuery("(max-width: 480px)");
	const { white } = theme;
	return (
		<MantineFooter
			height="auto"
			bg={white}
			withBorder={false}
			ml={mobileScreen ? "0px" : "250px"}
			style={{
				position: "relative",
				bottom: 0,
				display: "flex",
				alignContent: "center",
				justifyContent: "center",
			}}
		>
			<Text c="dimmed" m="xs" style={{ fontSize: "10px" }}>
				© YOUR HEALTH ALLY {new Date().getFullYear()}
			</Text>
			<Text c="dimmed" fs="italic" m="xs" style={{ fontSize: "10px" }}>
				This is not medical advice. This is for educational purposes only.
				Please see your healthcare provider for medical treatment.
			</Text>
		</MantineFooter>
	);
};
