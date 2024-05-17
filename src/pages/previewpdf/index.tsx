import React from "react";
import Viewer from "../../components/pdfDocument";

const PreviewPDF = () => {
	return (
		<Viewer
			messages={[]}
			id={""}
			title={""}
			description={null}
			createdAt={new Date()}
			updatedAt={new Date()}
			userId={""}
		/>
	);
};

export default PreviewPDF;
