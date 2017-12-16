import React from "react";
import { ReactiveList } from "@appbaseio/reactivesearch";
import PropTypes from "prop-types";

import Topic from "./Topic";

import ResultItem, { resultListContainer } from "../styles/ResultItem";
import Flex, { FlexChild } from "../styles/Flex";
import Link from "../styles/Link";
import Avatar from "../styles/Avatar";
import Button from "../styles/Button";

const onResultStats = (results, time) => (
	<Flex justifyContent="flex-end" style={{ margin: "1rem" }}>
		{results} results found in {time}ms
	</Flex>
);

const onData = ({ _source: data }) => (
	<ResultItem key={data.fullname}>
		<Flex alignCenter justifyContent="center">
			<Avatar src={data.avatar} alt="User avatar" />
			<Link href={data.url} target="_blank" rel="noopener noreferrer">
				<Flex flexWrap>
					<FlexChild>{data.owner}/</FlexChild>
					<FlexChild>{data.name}</FlexChild>
				</Flex>
			</Link>
		</Flex>
		<div style={{ margin: "10px 0" }}>{data.description}</div>
		<Flex flexWrap justifyContent="center">
			{
				data.topics.slice(0, 7).map(item => <Topic key={item}>{item}</Topic>)
			}
		</Flex>
		<Flex>
			<FlexChild><Button><i className="fas fa-star" />{data.stars}</Button></FlexChild>
			<FlexChild><Button><i className="fas fa-code-branch" />{data.forks}</Button></FlexChild>
			<FlexChild><Button><i className="fas fa-eye" />{data.watchers}</Button></FlexChild>
		</Flex>
	</ResultItem>
);

const Results = () => (
	<ReactiveList
		componentId="results"
		dataField="name"
		onData={onData}
		onResultStats={onResultStats}
		react={{
			and: ["name", "language", "topics", "pushed", "created", "stars", "forks", "repo"]
		}}
		pagination
		innerClass={{
			list: "result-list-container",
			pagination: "result-list-pagination"
		}}
		className={resultListContainer}
	/>
);

onData.propTypes = {
	_source: PropTypes.object // eslint-disable-line
};

export default Results;
