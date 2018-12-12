import React from 'react';
import { ReactiveList } from '@appbaseio/reactivesearch';
import PropTypes from 'prop-types';

import Topic from './Topic';

import ResultItem, { resultListContainer, resultCardHeader } from '../styles/ResultItem';
import Flex, { FlexChild } from '../styles/Flex';
import Link from '../styles/Link';
import Avatar from '../styles/Avatar';
import Button from '../styles/Button';

const onResultStats = stats => (
	<Flex justifyContent="flex-end">
		{stats.totalResults} results found in {stats.time}ms
	</Flex>
);

const onData = (data, currentTopics, toggleTopic) => (
	<ResultItem key={data.fullname}>
		<Flex alignCenter justifyContent="center" className={resultCardHeader}>
			<Avatar src={data.avatar} alt="User avatar" />
			<Link href={data.url} target="_blank" rel="noopener noreferrer">
				<Flex flexWrap>
					<FlexChild>{data.owner}/</FlexChild>
					<FlexChild>{data.name}</FlexChild>
				</Flex>
			</Link>
		</Flex>
		<div style={{ margin: '10px 0', color: '#424242' }}>{data.description}</div>
		<Flex flexWrap justifyContent="center">
			{data.topics.slice(0, 7).map(item => (
				<Topic key={item} active={currentTopics.includes(item)} toggleTopic={toggleTopic}>
					{item}
				</Topic>
			))}
		</Flex>
		<Flex>
			<FlexChild>
				<Button>
					<i className="fas fa-star" />
					{data.stars}
				</Button>
			</FlexChild>
			<FlexChild>
				<Button>
					<i className="fas fa-code-branch" />
					{data.forks}
				</Button>
			</FlexChild>
			<FlexChild>
				<Button>
					<i className="fas fa-eye" />
					{data.watchers}
				</Button>
			</FlexChild>
		</Flex>
	</ResultItem>
);

const Results = ({ toggleTopic, currentTopics }) => (
	<ReactiveList
		componentId="results"
		dataField="name"
		renderData={data => onData(data, currentTopics, toggleTopic)}
		onResultStats={onResultStats}
		react={{
			and: ['name', 'language', 'topics', 'pushed', 'created', 'stars', 'forks', 'repo'],
		}}
		pagination
		innerClass={{
			list: 'result-list-container',
			pagination: 'result-list-pagination',
			resultsInfo: 'result-list-info',
			poweredBy: 'powered-by',
		}}
		className={resultListContainer}
		size={6}
		sortOptions={[
			{
				label: 'Best Match',
				dataField: '_score',
				sortBy: 'desc',
			},
			{
				label: 'Most Stars',
				dataField: 'stars',
				sortBy: 'desc',
			},
			{
				label: 'Fewest Stars',
				dataField: 'stars',
				sortBy: 'asc',
			},
			{
				label: 'Most Forks',
				dataField: 'forks',
				sortBy: 'desc',
			},
			{
				label: 'Fewest Forks',
				dataField: 'forks',
				sortBy: 'asc',
			},
			{
				label: 'A to Z',
				dataField: 'owner.raw',
				sortBy: 'asc',
			},
			{
				label: 'Z to A',
				dataField: 'owner.raw',
				sortBy: 'desc',
			},
			{
				label: 'Recently Updated',
				dataField: 'pushed',
				sortBy: 'desc',
			},
			{
				label: 'Least Recently Updated',
				dataField: 'pushed',
				sortBy: 'asc',
			},
		]}
	/>
);

Results.propTypes = {
	toggleTopic: PropTypes.func,
	currentTopics: PropTypes.arrayOf(PropTypes.string),
};

export default Results;
