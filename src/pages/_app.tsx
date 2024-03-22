import Head from "next/head";
import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import { api } from "~/utils/api";
import { MantineProvider } from "@mantine/core";
import { theme } from "../config/theme";
// import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({
	subsets: ["latin"],
});

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<>
			<Head>
				<title>Your Health Ally</title>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
			</Head>

			{/* <ClerkProvider {...pageProps}> */}
			<MantineProvider
				withGlobalStyles
				withNormalizeCSS
				theme={{ ...theme, colorScheme: "light" }}
			>
				<main className={inter.className}>
					<Component {...pageProps} />
				</main>
			</MantineProvider>
			{/* </ClerkProvider> */}
		</>
	);
};

export default api.withTRPC(MyApp);
