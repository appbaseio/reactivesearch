import React from "react";
import { ReactiveList } from "@appbaseio/reactivesearch";
import PropTypes from "prop-types";

import ResultItem, { resultItemDetails } from "../styles/ResultItem";
import Flex, { FlexChild } from "../styles/Flex";
import Link from "../styles/Link";
import Avatar from "../styles/Avatar";

const onResultStats = (results, time) => (
	<Flex justifyContent="flex-end" style={{ padding: "0 1rem" }}>
		{results} results found in {time}ms
	</Flex>
);

const onData = ({ _source: data }) => (
	<ResultItem key={data.fullname}>
		<Flex>
			<Avatar src={data.avatar} alt="User avatar" />
			<Link href={data.url} target="_blank" rel="noopener noreferrer">{data.owner}/{data.name}</Link>
		</Flex>
		<div>{data.description}</div>
		<div>
			{
				data.topics.map(item => <div key={item}>{item}</div>)
			}
		</div>
		<Flex>
			<FlexChild>{data.stars} | </FlexChild>
			<FlexChild>{data.forks} | </FlexChild>
			<FlexChild>{data.watchers} </FlexChild>
		</Flex>
	</ResultItem>
);

const Results = () => (
	<ReactiveList
		componentId="results"
		dataField="name"
		onData={onData}
		// onResultStats={onResultStats}
		react={{
			and: ["name", "language"]
		}}
		pagination
	/>
);

onData.propTypes = {
	_source: PropTypes.object // eslint-disable-line
};

export default Results;
