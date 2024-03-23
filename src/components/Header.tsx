// import { SignedIn, UserButton } from '@clerk/nextjs';
import { Box, Header as MantineHeader, Flex } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { theme } from "~/config/theme";
import PinkLogo from "../../public/logo/logo-pink-dark.png";
import Image from "next/image";
import { ReactNode } from "react";
import MobileSidebar from "./Sidebar/mobileSidebar";

type HeaderProps = {
	children?: ReactNode;
};

export const Header: React.FC<HeaderProps> = ({ children }) => {
	const isMobile = useMediaQuery("(max-width: 480px)");
	const { colors, white } = theme;
	//

	return (
		<MantineHeader height={80}>
			<Flex m="md" direction="row" align="center" justify="space-between">
				<Image
					src={PinkLogo}
					alt="Your Health Ally Logo"
					width={96}
					height={54}
				/>
				{isMobile ? <MobileSidebar /> : null}
				{/* <SignedIn>
          <UserButton />
        </SignedIn> */}
			</Flex>
		</MantineHeader>
	);
};
