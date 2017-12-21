import React, { Component } from "react";
import { ReactiveBase } from "@appbaseio/reactivesearch";

import theme from "./styles/theme";

import Header from "./components/Header";
import SearchFilters from "./components/SearchFilters";
import Results from "./components/Results";

import Container, { appContainer, resultsContainer } from "./styles/Container";
import FilterContainer from "./styles/FilterContainer";
import Flex, { FlexChild } from "./styles/Flex";
import { ToggleButton } from "./styles/Button";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false
		};
	}

	toggleFilters = () => {
		const { visible } = this.state;
		this.setState({
			visible: !visible
		});
	};

	render() {
		return (
			<Container>
				<ReactiveBase
					app="car-store"
					credentials="cf7QByt5e:d2d60548-82a9-43cc-8b40-93cbbe75c34c"
					theme={theme}
				>
					<Header />
					<Flex className={appContainer} direction="row-reverse">
						<FilterContainer visible={this.state.visible}>
							<SearchFilters />
						</FilterContainer>
						<FlexChild className={resultsContainer}>
							<Results />
						</FlexChild>
					</Flex>
					<ToggleButton onClick={this.toggleFilters}>
						{this.state.visible ? "🚗 SHOW CARS" : "📂 SHOW FILTERS"}
					</ToggleButton>
				</ReactiveBase>
			</Container>
		);
	}
}

export default App;
