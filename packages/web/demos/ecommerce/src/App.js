import React, { Component } from "react";
import { ReactiveBase } from "@appbaseio/reactivesearch";

import theme from "./styles/theme";

import Header from "./components/Header";
import SearchFilters from "./components/SearchFilters";
import Results from "./components/Results";

import Container, { appContainer, resultsContainer } from "./styles/Container";
import FilterContainer from "./styles/FilterContainer";
import Flex, { FlexChild } from "./styles/Flex";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: true
		};
	}
	render() {
		return (
			<Container>
				<ReactiveBase
					app="car-store"
					credentials="cf7QByt5e:d2d60548-82a9-43cc-8b40-93cbbe75c34c"
					theme={theme}
				>
					<Header />
					<Flex className={appContainer}>
						<FilterContainer visible={this.state.visible}>
							<SearchFilters />
						</FilterContainer>
						<FlexChild flex={3} className={resultsContainer}>
							<Results />
						</FlexChild>
					</Flex>
				</ReactiveBase>
			</Container>
		);
	}
}

export default App;
