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

	const getDefinition = async () => {
		const response = await fetch(
			`https://api.dictionaryapi.dev/api/v2/entries/en/${text}`
		);
		const data = await response.json();

		if (!data[0]) {
			setDictionaryDef("No definition found.");
		}

		const fullDefinition = data.meanings.map(
			(info: {
                partOfSpeech: string,
                definitions: Array<DefinitionsItem>,
            }) => {
				const partSp = info?.partOfSpeech;
				const define = info?.definitions?.map((item) => item.definition); // Fix: Access the 'definition' property directly
				return `${partSp} - ${define} ; `;
			}
		);
		console.log(fullDefinition);
		setDictionaryDef(fullDefinition);
		return fullDefinition;
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
