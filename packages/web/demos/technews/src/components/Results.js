import React from "react";
import { ReactiveList } from "@appbaseio/reactivesearch";
import PropTypes from "prop-types";

import ResultItem, { resultItemDetails } from "../styles/ResultItem";
import Flex, { FlexChild } from "../styles/Flex";

const onResultStats = (results, time) => (
	<Flex justifyContent="flex-end" style={{ padding: "0 1rem" }}>
		{results} results found in {time}ms
	</Flex>
)

const onData = ({ _source: data }) => (
	<ResultItem key={data.id}>
		<div dangerouslySetInnerHTML={{ __html: data.title }} />
		<div dangerouslySetInnerHTML={{ __html: data.text }} />
		<Flex className={resultItemDetails}>
			<FlexChild>
				{data.parent}
			</FlexChild>
			<FlexChild>
				{data.score}
			</FlexChild>
			<FlexChild>
				{data.by}
			</FlexChild>
			<FlexChild>
				{data.time}
			</FlexChild>
		</Flex>
	</ResultItem>
);

const Results = () => (
	<ReactiveList
		componentId="results"
		dataField="title"
		onData={onData}
		onResultStats={onResultStats}
		react={{
			and: ["title", "category"]
		}}
		pagination
	/>
);

onData.propTypes = {
	_source: PropTypes.object	// eslint-disable-line
};

export default Results;
