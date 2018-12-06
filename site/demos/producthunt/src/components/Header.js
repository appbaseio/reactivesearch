import React from 'react';
import { DataSearch } from '@appbaseio/reactivesearch';

import Navbar, { title, navbarContent } from '../styles/Navbar';
import Flex, { FlexChild } from '../styles/Flex';
import { dataSearchContainer } from '../styles/Container';

const Header = () => (
	<Navbar>
		<Flex alignCenter responsive justifyContent="space-between" className={navbarContent}>
			<FlexChild className={title}>Product Search</FlexChild>
			<FlexChild className={dataSearchContainer}>
				<DataSearch
					componentId="search"
					dataField={[
						'name',
						'tagline',
						'name.autosuggest',
						'name.keyword',
						'tagline.autosuggest',
						'tagline.keyword',
					]}
					iconPosition="left"
					placeholder="Discover products..."
					URLParams
					filterLabel="Search"
					autosuggest
				/>
			</FlexChild>
		</Flex>
	</Navbar>
);

export default Header;
