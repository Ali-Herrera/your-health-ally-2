// if user hovers over any word on the screen, it will show a tooltip with the definition of the word
// Definition of the word should be fetched from the API: https://dictionaryapi.dev/

import React, { useState } from "react";
import { Text, Tooltip } from "@mantine/core";
import { theme } from "~/config/theme";

export type Tool = {
	selected: boolean;
	text?: string;
};

export const DefinitionTool = ({ selected, text }: Tool) => {
	const [dictionaryDef, setDictionaryDef] = useState("");
	const { black } = theme;

	type DefinitionsItem = {
		definition: string;
	};

	// 429 ERROR-TOO MANY REQUESTS. Wait X minutes for the API to be available.
	// Fix: Add a delay before fetching the definition
	// Fix: Only fetch the definition if the text selection has changed
	const getDefinition = async () => {
		try {
			const response = await fetch(
				`https://api.dictionaryapi.dev/api/v2/entries/en/${text}`
			);
			const data = await response.json();

			if (!data[0]) {
				setDictionaryDef("No definition found.");
			}
			console.log("DATA : ", data[0]);
			const fullDefinition = data[0].meanings[0].map(
				(info: {
					partOfSpeech: string;
					definitions: Array<DefinitionsItem>;
				}) => {
					const partOfSp = info?.partOfSpeech;
					const define = info?.definitions?.map((item) => item.definition);
					return `${partOfSp} - ${define} ; `;
				}
			);
			console.log(fullDefinition);
			setDictionaryDef(fullDefinition);
			return fullDefinition;
		} catch (error) {
			console.error("Error fetching definition: ", error);
			setDictionaryDef("Server error. Please try again later.");
		}
	};

	if (selected) {
		getDefinition();
	}
	return (
		<Tooltip
			label={dictionaryDef}
			events={{ hover: true, focus: true, touch: true }}
			multiline
			width={220}
			position="top"
			openDelay={500}
			closeDelay={500}
		>
			<Text c={black}>{}</Text>
		</Tooltip>
	);
};

export default DefinitionTool;
