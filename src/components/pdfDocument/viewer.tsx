import React from "react";
import ReactDOM from "react-dom";
import { PDFViewer } from "@react-pdf/renderer";
import ChatPdfDocument from "./index";

const Viewer = () => {
	return (
		<PDFViewer>
			<ChatPdfDocument
				messages={[]}
				id={""}
				title={""}
				description={null}
				createdAt={new Date()}
				updatedAt={new Date()}
				userId={""}
			/>
		</PDFViewer>
	);
};

export default Viewer;
