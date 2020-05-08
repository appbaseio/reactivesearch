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
				url="https://IkwcRqior:cda6348c-37c9-40f6-a144-de3cb18b57a0@arc-cluster-appbase-tryout-k8dsnj.searchbase.io"
				enableAppbase
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
