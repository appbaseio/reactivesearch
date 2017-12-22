import React, { Component } from 'react';
import { ReactiveBase, CategorySearch } from '@appbaseio/reactivesearch';

import theme from './styles/theme';

import Header from './components/Header';
import Results from './components/Results';

import Container, { resultsContainer, categorySearchContainer, appContainer } from './styles/Container';
import Flex, { FlexChild } from './styles/Flex';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentTopics: [],
		};
	}

	setTopics = (currentTopics) => {
		this.setState({
			currentTopics: currentTopics || [],
		});
	}

	toggleTopic = (topic) => {
		const { currentTopics } = this.state;
		const nextState = currentTopics.includes(topic)
			? currentTopics.filter(item => item !== topic)
			: currentTopics.concat(topic);
		this.setState({
			currentTopics: nextState,
		});
	}

	render() {
		return (
			<Container>
				<ReactiveBase
					app="gitxplore-latest"
					credentials="W7ZomvYgQ:df994896-a25d-4d4e-8724-e26659b93001"
					theme={theme}
				>
					<Flex direction="row-reverse" className={appContainer}>
						<Header currentTopics={this.state.currentTopics} setTopics={this.setTopics} />
						<FlexChild className={resultsContainer}>
							<CategorySearch
								componentId="repo"
								dataField={['name', 'description', 'name.raw', 'fullname', 'owner', 'topics']}
								categoryField="language.raw"
								queryFormat="and"
								placeholder="Search Repos"
								URLParams
								className={categorySearchContainer}
							/>
							<Results currentTopics={this.state.currentTopics} toggleTopic={this.toggleTopic} />
						</FlexChild>
					</Flex>
				</ReactiveBase>
			</Container>
		);
	}
}

export default App;
