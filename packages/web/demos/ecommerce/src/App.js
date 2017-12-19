import React, { Component } from "react";
import { ReactiveBase } from "@appbaseio/reactivesearch";

import theme from "./styles/theme";

import Header from "./components/Header";
import SearchFilters from "./components/SearchFilters";
import Results from "./components/Results";

import Container, { appContainer } from "./styles/Container";
import Flex, { FlexChild } from "./styles/Flex";

class App extends Component {
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
						<FlexChild flex={1}>
							<SearchFilters />
						</FlexChild>
						<FlexChild flex={3}>
							<Results />
						</FlexChild>
					</Flex>
				</ReactiveBase>
			</Container>
		);
	}
}

export default App;
