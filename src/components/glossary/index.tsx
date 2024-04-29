// // if user hovers over any word on the screen, it will show a tooltip with the definition of the word
// // Definition of the word should be fetched from the API: https://dictionaryapi.dev/

// import React, { useState } from "react";
// import { Text, Tooltip } from "@mantine/core";
// import { theme } from "~/config/theme";

// export type Tool = {
// 	selected: boolean;
// 	text?: string;
// };

// export const DefinitionTool = ({ selected, text,  }: Tool) => {
// 	const [textDefinition, setTextDefinition] = useState("");
// 	const { black } = theme;

// 	const getDictionary = async () => {
// 		try {
// 			const response = await fetch(
// 				`https://api.dictionaryapi.dev/api/v2/entries/en/${text}`
// 			);
// 			const data = await response.json();
//             if (!data) {
//                 setTextDefinition("Hmm. No definition found. You can try again at later time or head to the web instead.");
//             }

// 			console.log("dictionaryapi response: ", data);

// 			const definedText = data[0].meanings.map(
// 				(info: {
// 					partOfSpeech: string;
// 					definitions: Array<{ definition: string }>;
// 				}) => {
// 					const partOfSpeech = info.partOfSpeech;
// 					const definition = info.definitions?.map((item) => item.definition);
// 					return `${partOfSpeech}: ${definition}`;
// 				}
// 			);

// 			console.log("definedText: ", definedText);

// 			setTextDefinition(definedText.join(" | "));

//                 console.log("dictionary: ", textDefinition);

// 		} catch (error) {
// 			console.error("Error fetching definition: ", error);
// 			setTextDefinition("Whoops! Error fetching definition. You can try again at later time or head to the web instead.");
// 		}
// 	};

// 	if (selected) {
// 		setTimeout(() => {
// 			getDictionary();
// 		}, 1000);
        
// 	}

// 	return (
// 		<Tooltip
// 			label={textDefinition}
// 			// events={{ hover: true, focus: true, touch: true }}
// 			multiline
// 			width={220}
// 			color="dark"
// 			position="top"
// 			closeDelay={500}
// 		>
// 			<Text c={black}>FETCHED: {textDefinition}</Text>
// 		</Tooltip>
// 	);
// };

// export default DefinitionTool;
