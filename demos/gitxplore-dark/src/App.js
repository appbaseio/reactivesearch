import React, { Component } from 'react';
import { ReactiveBase, DataSearch } from '@appbaseio/reactivesearch';

import theme from './styles/theme';

import Header from './components/Header';
import Results from './components/Results';

import Container, { resultsContainer, dataSearchContainer, appContainer } from './styles/Container';
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
					app="gitxplore-latest-app"
					credentials="LsxvulCKp:a500b460-73ff-4882-8d34-9df8064b3b38"
					theme={theme}
					themePreset="dark"
				>
					<Flex direction="row-reverse" className={appContainer}>
						<Header currentTopics={this.state.currentTopics} setTopics={this.setTopics} />
						<FlexChild className={resultsContainer}>
							<DataSearch
								componentId="repo"
								dataField={['name', 'description', 'name.raw', 'fullname', 'owner', 'topics']}
								placeholder="Search Repos"
								iconPosition="left"
								URLParams
								className={dataSearchContainer}
								innerClass={{
									input: 'search-input',
								}}
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
