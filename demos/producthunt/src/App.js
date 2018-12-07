import React, { Component } from 'react';
import { ReactiveBase } from '@appbaseio/reactivesearch';

import Header from './components/Header';
import SearchFilters from './components/SearchFilters';
import Results from './components/Results';

import theme from './styles/theme';
import Container, { appContainer, resultsContainer } from './styles/Container';
import Flex, { FlexChild } from './styles/Flex';
import FilterContainer from './styles/FilterContainer';
import { ToggleButton } from './styles/Button';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
		};
	}

	toggleFilters = () => {
		const { visible } = this.state;
		this.setState({
			visible: !visible,
		});
	};

	render() {
		return (
			<Container>
				<ReactiveBase
					app="ph-dataset"
					credentials="NPWzzJQT0:e367967e-9005-4b8a-94b2-28d1f8b49d1d"
					type="ph-dataset"
					theme={theme}
				>
					<Header />
					<Flex className={appContainer}>
						<FilterContainer visible={this.state.visible}>
							<SearchFilters />
						</FilterContainer>
						<FlexChild className={resultsContainer}>
							<Results />
						</FlexChild>
					</Flex>
					<ToggleButton onClick={this.toggleFilters}>
						{this.state.visible ? '😻 SHOW PRODUCTS' : '📂 SHOW FILTERS'}
					</ToggleButton>
				</ReactiveBase>
			</Container>
		);
	}
}

export default App;
