import React from 'react';
import { DataSearch } from '@appbaseio/reactivesearch';

import Navbar, { title, navbarContent } from '../styles/Navbar';
import Flex, { FlexChild } from '../styles/Flex';
import { dataSearchContainer } from '../styles/Container';

const Header = () => (
	<Navbar>
		<Flex
			alignCenter
			responsive
			justifyContent="space-between"
			className={navbarContent}
		>
			<FlexChild className={title}>Good<b>Books</b></FlexChild>
			<FlexChild className={dataSearchContainer}>
				<DataSearch
					componentId="search"
					dataField={['original_title', 'authors']}
					placeholder="Find your next favorite book..."
					URLParams
					filterLabel="Search"
					react={{
						and: ['series', 'rating', 'authors'],
					}}
				/>
			</FlexChild>
		</Flex>
	</Navbar>
);

export default Header;
