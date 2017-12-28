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
					app="good-books-live"
					credentials="sHZWU7AYJ:d1e2922c-035c-429f-bfe4-62aa38b1c395"
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
						{
							this.state.visible
							&& <span><i className="fas fa-book" /> Show Books</span>
						}
						{
							!this.state.visible
							&& <span><i className="fas fa-sliders-h" /> Show Filters</span>
						}
					</ToggleButton>
				</ReactiveBase>
			</Container>
		);
	}
}

export default App;
