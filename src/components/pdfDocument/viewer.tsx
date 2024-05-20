import React from "react";
import ReactDOM from "react-dom";
import { PDFViewer } from "@react-pdf/renderer";
import ChatPdfDocument from "./index";

const Viewer = () => {
	return (
		<PDFViewer>
			<ChatPdfDocument />
		</PDFViewer>
	);
};

export default Viewer;
