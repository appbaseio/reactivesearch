import React from 'react';
import { CategorySearch } from '@appbaseio/reactivesearch';

import Navbar, { title } from '../styles/Navbar';
import Flex, { FlexChild } from '../styles/Flex';
import { categorySearchContainer } from '../styles/Container';

const Header = () => (
	<Navbar>
		<Flex
			alignCenter
			responsive
			justifyContent="space-between"
		>
			<FlexChild className={title}>Good<b>Books</b></FlexChild>
			<FlexChild className={categorySearchContainer}>
				<CategorySearch
					dataField="name"
					categoryField="brand.raw"
					componentId="category"
					placeholder="Find your next read..."
				/>
			</FlexChild>
		</Flex>
	</Navbar>
);

export default Header;
