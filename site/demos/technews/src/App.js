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
				url="https://xe6N9nDRV:51ea7a8a-6354-4b5f-83e1-12dce3b7ec47@arc-cluster-appbase-demo-ps1pgt.searchbase.io"
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
