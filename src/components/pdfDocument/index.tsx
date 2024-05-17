import { PrismaClient, Chat, Message } from "@prisma/client";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
	page: {
		flexDirection: "row",
		backgroundColor: "#E4E4E4",
	},
	section: {
		margin: 10,
		padding: 10,
		flexGrow: 1,
	},
});

interface ChatWithMessages extends Chat {
	messages: Message[];
}

const ChatPdfDocument: React.FC<ChatWithMessages> = ({ messages }) => (
	<Document>
		<Page size='A4' style={styles.page}>
			{messages.map((message, index) => (
				<View key={index} style={styles.section}>
					<Text>{message.content}</Text>
					<Text>{new Date(message.createdAt).toLocaleString()}</Text>
				</View>
			))}
		</Page>
	</Document>
);

export default ChatPdfDocument;
