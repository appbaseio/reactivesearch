import React, { Component } from "react";
import { ReactiveBase } from "@appbaseio/reactivesearch";

import Header from "./components/Header";
import SearchFilters from "./components/SearchFilters";
import Results from "./components/Results";

import Container from "./styles/Container";

const App = () => (
	<Container>
		<ReactiveBase
			app="hackernews-live"
			credentials="kxBY7RnNe:4d69db99-6049-409d-89bd-e1202a2ad48e"
		>
			<Header />
			<SearchFilters />
			<Results />
		</ReactiveBase>
	</Container>
);

export default App;
