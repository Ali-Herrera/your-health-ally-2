// import Head from "next/head";
// import Html from "next/document";
import { type AppType } from "next/app";
import { Inter } from "next/font/google";
import { api } from "~/utils/api";
import { MantineProvider } from "@mantine/core";
import { theme } from "../config/theme";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  subsets: ['latin'],
});

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<>
			<ClerkProvider {...pageProps}>
				<MantineProvider
					withGlobalStyles
					withNormalizeCSS
					theme={{ ...theme, colorScheme: "light" }}
				>
					<main className={inter.className}>
						<Component {...pageProps} />
					</main>
				</MantineProvider>
			</ClerkProvider>
		</>
	);
};

export default api.withTRPC(MyApp);
