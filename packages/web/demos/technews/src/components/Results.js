import React from "react";
import { ReactiveList } from "@appbaseio/reactivesearch";
import PropTypes from "prop-types";

import ResultItem from "../styles/ResultItem";
import Flex, { FlexChild } from "../styles/Flex";

const onData = ({ _source: data }) => (
	<ResultItem key={data.id}>
		<div dangerouslySetInnerHTML={{ __html: data.title }} />
		<div dangerouslySetInnerHTML={{ __html: data.text }} />
		<Flex>
			<FlexChild>
				<b>Parent:</b> {data.parent}
			</FlexChild>
			<FlexChild>
				<b>Score:</b> {data.score}
			</FlexChild>
			<FlexChild>
				<b>By:</b> {data.by}
			</FlexChild>
			<FlexChild>
				<b>Time:</b> {data.time}
			</FlexChild>
		</Flex>
	</ResultItem>
);

const Results = () => (
	<ReactiveList
		componentId="results"
		dataField="title"
		onData={onData}
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
