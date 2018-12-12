import React from 'react';
import { ReactiveList } from '@appbaseio/reactivesearch';
import PropTypes from 'prop-types';

import ResultItem, { resultItemDetails } from '../styles/ResultItem';
import Flex, { FlexChild } from '../styles/Flex';
import Link from '../styles/Link';

function timeSince(date) {
	const seconds = Math.floor((new Date() - date) / 1000);

	let interval = Math.floor(seconds / 31536000);

	if (interval >= 1) {
		const postfix = interval === 1 ? ' year' : ' years';
		return interval + postfix;
	}
	interval = Math.floor(seconds / 2592000);
	if (interval > 1) {
		return `${interval} months`;
	}
	interval = Math.floor(seconds / 86400);
	if (interval > 1) {
		return `${interval} days`;
	}
	interval = Math.floor(seconds / 3600);
	if (interval > 1) {
		return `${interval} hours`;
	}
	interval = Math.floor(seconds / 60);
	if (interval > 1) {
		return `${interval} minutes`;
	}
	return `${Math.floor(seconds)} seconds`;
}

const onResultStats = stats => (
	<Flex justifyContent="flex-end" style={{ padding: '0 1rem' }}>
		{stats.totalResults} results found in {stats.time}ms
	</Flex>
);

const onData = data => (
	<ResultItem key={data._id}>
		<div dangerouslySetInnerHTML={{ __html: data.title }} />
		<div dangerouslySetInnerHTML={{ __html: data.text }} />
		<Flex className={resultItemDetails} style={{ paddingTop: 5, marginTop: 5 }}>
			{!!data.parent && (
				<FlexChild>
					parent{' '}
					<Link
						href={`https://news.ycombinator.com/item?id=${data.parent}`}
						target="_blank"
						rel="noopener noreferrer"
					>
						{data.parent}
					</Link>
				</FlexChild>
			)}
			<FlexChild>{data.score} points</FlexChild>
			<FlexChild>
				<Link
					href={`https://news.ycombinator.com/user?id=${data.by}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					{data.by}
				</Link>
			</FlexChild>
			<FlexChild>{timeSince(new Date(data.time * 1000))} ago</FlexChild>
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
			and: ['title', 'category', 'time'],
		}}
		pagination
	/>
);

onData.propTypes = {
	_source: PropTypes.object // eslint-disable-line
};

export default Results;
