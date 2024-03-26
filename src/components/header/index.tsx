import { Header as MantineHeader, Flex } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import PinkLogo from "../../../public/logo/logo-pink-dark.png";
import Image from "next/image";
import { ReactNode } from "react";
import { SignedIn, UserButton } from "@clerk/nextjs";

type HeaderProps = {
	children?: ReactNode;
};

export const Header: React.FC<HeaderProps> = ({ children }) => {
	const mobileScreen = useMediaQuery("(max-width: 480px)");

	return (
		<MantineHeader height={80} ml={mobileScreen ? "0px" : "250px"}>
			<Flex m="md" direction="row" align="center" justify="space-between">
				<Image
					src={PinkLogo}
					alt="Your Health Ally Logo"
					width={96}
					height={54}
				/>
				<SignedIn>
					<UserButton />
				</SignedIn>
			</Flex>
		</MantineHeader>
	);
};
