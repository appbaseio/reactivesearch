import React from 'react';
import { ReactiveBase } from '@appbaseio/reactivesearch';

import theme from './styles/theme';

import Header from './components/Header';
import SearchFilters from './components/SearchFilters';
import Results from './components/Results';

import Container from './styles/Container';
import Main from './styles/Main';

const App = () => (
	<Main>
		<Container>
			<ReactiveBase
				app="hackernews-live"
				url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
				theme={theme}
			>
				<Header />
				<SearchFilters />
				<Results />
			</ReactiveBase>
		</Container>
	</Main>
);

export default App;
pp;
