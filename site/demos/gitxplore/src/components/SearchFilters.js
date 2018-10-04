import React from 'react';
import PropTypes from 'prop-types';
import {
	MultiDropdownList,
	SingleDropdownRange,
	RangeSlider,
} from '@appbaseio/reactivesearch';

import Tooltip from '@wtjs/tooltip';

import Flex, { FlexChild } from '../styles/Flex';
import { filtersContainer } from '../styles/Container';

const SearchFilters = ({ currentTopics, setTopics, visible }) => (
	<Flex direction="column" hidden={!visible} className={filtersContainer}>
		<FlexChild margin="10px">
			<MultiDropdownList
				componentId="language"
				dataField="language.raw"
				title="Language"
				placeholder="Select languages"
				URLParams
				react={{ and: ['topics', 'pushed', 'created', 'forks', 'stars'] }}
			/>
		</FlexChild>
		<FlexChild margin="10px">
			<MultiDropdownList
				componentId="topics"
				dataField="topics.raw"
				title="Repo Topics"
				placeholder="Select topics"
				size={1000}
				queryFormat="and"
				URLParams
				defaultSelected={currentTopics}
				onValueChange={setTopics}
				react={{ and: ['language', 'pushed', 'created', 'forks', 'stars'] }}
			/>
		</FlexChild>
		<FlexChild margin="10px">
			<SingleDropdownRange
				componentId="pushed"
				dataField="pushed"
				URLParams
				title="Last Active"
				placeholder="Repo last active"
				data={[
					{ start: 'now-1M', end: 'now', label: 'Last 30 days' },
					{ start: 'now-6M', end: 'now', label: 'Last 6 months' },
					{ start: 'now-1y', end: 'now', label: 'Last year' },
				]}
			/>
		</FlexChild>
		<FlexChild margin="10px">
			<SingleDropdownRange
				componentId="created"
				dataField="created"
				title="Created"
				placeholder="Repo created"
				URLParams
				data={[
					{
						start: '2017-01-01T00:00:00Z',
						end: '2017-12-31T23:59:59Z',
						label: '2017',
					},
					{
						start: '2016-01-01T00:00:00Z',
						end: '2016-12-31T23:59:59Z',
						label: '2016',
					},
					{
						start: '2015-01-01T00:00:00Z',
						end: '2015-12-31T23:59:59Z',
						label: '2015',
					},
					{
						start: '2014-01-01T00:00:00Z',
						end: '2014-12-31T23:59:59Z',
						label: '2014',
					},
					{
						start: '2013-01-01T00:00:00Z',
						end: '2013-12-31T23:59:59Z',
						label: '2013',
					},
					{
						start: '2012-01-01T00:00:00Z',
						end: '2012-12-31T23:59:59Z',
						label: '2012',
					},
					{
						start: '2011-01-01T00:00:00Z',
						end: '2011-12-31T23:59:59Z',
						label: '2011',
					},
					{
						start: '2010-01-01T00:00:00Z',
						end: '2010-12-31T23:59:59Z',
						label: '2010',
					},
					{
						start: '2009-01-01T00:00:00Z',
						end: '2009-12-31T23:59:59Z',
						label: '2009',
					},
					{
						start: '2008-01-01T00:00:00Z',
						end: '2008-12-31T23:59:59Z',
						label: '2008',
					},
					{
						start: '2007-01-01T00:00:00Z',
						end: '2007-12-31T23:59:59Z',
						label: '2007',
					},
				]}
			/>
		</FlexChild>
		<FlexChild margin="10px">
			<RangeSlider
				componentId="stars"
				title="Repo Stars"
				dataField="stars"
				range={{ start: 0, end: 300000 }}
				showHistogram={false}
				rangeLabels={{
					start: '0 Stars',
					end: '300K Stars',
				}}
				innerClass={{
					label: 'range-label',
				}}
			/>
		</FlexChild>
		<FlexChild margin="10px">
			<RangeSlider
				componentId="forks"
				title="Repo Forks"
				dataField="forks"
				range={{ start: 0, end: 180500 }}
				showHistogram={false}
				rangeLabels={{
					start: '0 Forks',
					end: '180K Forks',
				}}
				innerClass={{
					label: 'range-label',
				}}
				handleTooltip={(children, value) => (
					<Tooltip render={value}>
						{children}
					</Tooltip>)
				}
			/>
		</FlexChild>
	</Flex>
);

SearchFilters.propTypes = {
	currentTopics: PropTypes.arrayOf(PropTypes.string),
	setTopics: PropTypes.func,
	visible: PropTypes.bool,
};

export default SearchFilters;
