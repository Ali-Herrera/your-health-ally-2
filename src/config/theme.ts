// to override the default Mantine theme in /components

import { MantineThemeOverride } from "@mantine/core";

// To view Mantine default theme.colors: https://mantine.dev/colors-generator/

// To generate a color array:
// 1. Go to: https://omatsuri.app/color-shades-generator
// 2. Set saturation shift to 0% and drag darken/lighten % slider all the way to the right.
// 3. Slowly drag darken/lighten slider to the left until desired primary shade is the 7th item.
// 4. Copy and paste the color array into this theme object and delete any items past 9.

export const theme: MantineThemeOverride = {
	// theme.colors
	colors: {
		darkPink: [
			"#EECDDE", // 0 = Lightest
			"#DF9DBE",
			"#D272A3",
			"#C84D8B",
			"#B63777",
			"#9D2E66",
			"#872657", // 6 = darkPink
			"#6F2048",
			"#5C1C3C",
			"#4C1732", // 9 = Darkest
		],
		pink: [
			"#EAC8D9",
			"#E0A7C4",
			"#D789B1",
			"#D16D9F",
			"#CB5290",
			"#C83A82",
			"#B83075", // 6 = pink
			"#A12D68",
			"#8E2A5D",
			"#7C2752",
		],
		teal: [
			"#B3E0DC",
			"#81CDC6",
			"#4FB9AF",
			"#28A99E",
			"#05998C",
			"#048C7F",
			"#037C6E", // 6 = teal
			"#036C5F",
			"#025043",
			"#01432E",
		],
		yellow: [
			"#FFFAE4",
			"#FEF4CF",
			"#FAE8A0", // 2 = Color Palette Ideas doc
			"#F7DB6E",
			"#F5D043",
			"#F4C929",
			"#F3C519", // 6 = yellow
			"#D8AE0B",
			"#C09A00",
			"#A68500",
		],
		orange: [
			"#FFF3E5",
			"#FDE5D2",
			"#F6C8A5", // 2 = Color Palette Idea doc
			"#EFAA74",
			"#EB914C",
			"#E88131",
			"#E77722", // 6 = orange
			"#CD6616",
			"#B7590F",
			"#A04C04",
		],
		red: [
			"#FBF5F6",
			"#F0D8DA",
			"#E6BCC0",
			"#DEA1A8",
			"#D78891",
			"#D2717B",
			"#CE5A67", // 6 = red (a soft red)
			"#C54856",
			"#B83D4B",
			"#A53A46",
		],
	},
	// theme.black, theme.white, theme.primaryColor, theme.primaryShade
	black: "#1A1910",
	white: "#F9F9F9",

	primaryColor: "darkPink",
	primaryShade: 8,

	// Added components for examples as we build the app
	defaultGradient: {
		from: "darkPink",
		to: "pink",
		deg: 20,
	},
	// ?? dot notation needed for components ??
	components: {
		Avatar: {
			defaultProps: {
				radius: 100,
			},
			styles: () => ({
				placeholder: {
					fontWeight: 500,
				},
			}),
		},
		Button: {
			defaultProps: {
				loaderPosition: "center",
				radius: "md",
			},
			//@ts-ignore
			styles: () => ({
				":disabled": {
					filter: "grayscale(100%)",
				},
			}),
		},
	},
};
