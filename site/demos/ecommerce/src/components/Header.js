import React from 'react';
import { CategorySearch } from '@appbaseio/reactivesearch';

import Navbar, { title } from '../styles/Navbar';
import Flex, { FlexChild } from '../styles/Flex';
import { categorySearchContainer } from '../styles/Container';

export default () => (
	<Navbar>
		<Flex alignCenter responsive justifyContent="space-between">
			<FlexChild className={title}>Car Store</FlexChild>
			<FlexChild className={categorySearchContainer}>
				<CategorySearch
					dataField="model"
					categoryField="brand.keyword"
					componentId="category"
					placeholder="Search for cars..."
					iconPosition="left"
					react={{
						and: 'brand',
					}}
				/>
			</FlexChild>
		</Flex>
	</Navbar>
);
