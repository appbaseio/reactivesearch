import React from "react";
import { ResultList } from "@appbaseio/reactivesearch";

const onData = ({ _source: data }) => ({
	title: data.title
});

const Results = () => (
	<ResultList
		componentId="results"
		dataField="title"
		onData={onData}
		react={{
			and: ["title", "category"]
		}}
		pagination
	/>
);

export default Results;
