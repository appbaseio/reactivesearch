import React, { Component } from "react";
import { ReactiveBase } from "@appbaseio/reactivesearch";

import Header from "./components/Header";
import SearchFilters from "./components/SearchFilters";
import Results from "./components/Results";

import theme from "./styles/theme";
import Container, { appContainer, resultsContainer } from "./styles/Container";
import Flex, { FlexChild } from "./styles/Flex";
import FilterContainer from "./styles/FilterContainer";
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
					app="producthunt"
					credentials="We5c0D8OP:b3f3b3ee-529c-41b2-b69a-84245c091105"
					type="post"
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
						{this.state.visible ? "🚗 SHOW CARS" : "📂 SHOW FILTERS"}
					</ToggleButton>
				</ReactiveBase>
			</Container>
		);
	}
}

export default App;
