export async function GET(req: Request, res: Response) {
	const response = await fetch(
		`https://api.dictionaryapi.dev/api/v2/entries/en/${req.query.word}`
	);
	const data = await response.json();
	console.log(data);
	// const part = data.meanings.partOfSpeech[0];
	// const definition = data.meanings.definitions[0].definition;
	// const example = data.meanings.definitions[0].example;
	// const synonyms = data.meanings.definitions[0].synonyms;
	// const antonyms = data.meanings.definitions[0].antonyms;
	return data;
}
