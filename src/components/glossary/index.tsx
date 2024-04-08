// if user hovers over any word on the screen, it will show a tooltip with the definition of the word
// Definition of the word should be fetched from the API: https://dictionaryapi.dev/

import React, { useState } from "react";
import { Text, Tooltip } from "@mantine/core";
import { theme } from "~/config/theme";



export type DictionaryDefinition = {
	partOfSpeech: string;
	definitions: Array<string>;
};

export type DefinitionProps = {
	selected: boolean;
	text?: string;
	// ?: DictionaryDefinition;
};

export const DefinitionTool = ({
	selected,
	text,
	// definition,
}: DefinitionProps) => {
	const [dictionaryDef, setDictionaryDef] = useState("");
	const { black } = theme;

	const getDefinition = async (word: string) => {
		const response = await fetch(
			`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
		);
		const data = await response.json();

		if (!data[0]) {
			setDictionaryDef("No definition found.");
			return null;
		}

		const fullDefinition = data.meanings.map(
			(info: {
				partOfSpeech: string;
				definitions: Array<{ definition: string }>;
			}) => {
				const part = info?.partOfSpeech;
				const defArr = info?.definitions?.map((item) => item.definition); // Fix: Access the 'definition' property directly
				return `${part} - ${defArr} ; `;
			}
		);
		console.log(fullDefinition);
		setDictionaryDef(fullDefinition);
		return fullDefinition || "No definition found.";
	};
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
