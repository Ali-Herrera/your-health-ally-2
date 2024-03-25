import { Button, Drawer, Group, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMenu2, IconPlus } from "@tabler/icons-react";
import Image from "next/image";
import logoIcon from "../../../public/icon/heart-pink-dark.png";
import { theme } from "~/config/theme";

export default function MobileSidebar() {
	const [opened, { open, close }] = useDisclosure(false);
	const { colors, white, black } = theme;
	const iconPlus = <IconPlus size={15} />;
	// onReset: () => void;

	return (
		<>
			{/* DRAWER OPEN */}
			<Drawer
				opened={opened}
				onClose={close}
				position="left"
				size="100%"
				title={
					<Image
						src={logoIcon}
						alt="Your Health Ally Logo"
						style={{ width: "100px", height: "100px" }}
					/>
				}
				sx={{
					root: {
						backgroundColor: white,
					},
					// HEADER + CLOSE BUTTON STYLES
					"& .mantine-Drawer-header": {
						margin: "10px 50px 10px 15px",
						display: "flex",
						alignContent: "center",
						justifyContent: "center",
					},

					"& .mantine-Drawer-close svg": {
						color: black,
						transform: "scale(1.75)",
						stroke: "currentColor",
						strokeWidth: "1",
					},
					"& .mantine-Drawer-close": {
						outline: "none",
						border: "none",
					},
					["& .mantine-Drawer-close:hover"]: {
						backgroundColor: "rgba(0,0,0,0)",
					},
					["& .mantine-Drawer-close:active"]: {
						backgroundColor: "rgba(0,0,0,0)",
					},
					["& .mantine-Drawer-close svg:focus"]: {
						outline: "none",
						border: "none",
					},
				}}
			>
				<Stack>
					<Group
						sx={{
							color: black,
							padding: "5px 7px",
							":active": {
								backgroundColor: colors?.darkPink?.[6],
								borderRadius: "6px",
								opacity: "0.5",
								padding: "5px 7px",
							},
						}}
					>
						<Button
							mt="xl"
							leftIcon={iconPlus}
						>
							Start New Chat
						</Button>
					</Group>
				</Stack>
			</Drawer>

			{/* DRAWER CLOSED - DEFAULT */}
			<Group align="center" position="left">
				<IconMenu2
					stroke={2.5}
					size="30px"
					onClick={open}
					style={{ color: black }}
					aria-label="Sidebar Menu"
				/>
			</Group>
		</>
	);
}
