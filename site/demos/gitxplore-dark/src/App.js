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
					app="gitxplore-app"
					url="https://xe6N9nDRV:51ea7a8a-6354-4b5f-83e1-12dce3b7ec47@arc-cluster-appbase-demo-ps1pgt.searchbase.io"
					enableAppbase
					theme={theme}
					themePreset="dark"
				>
					<Flex direction="row-reverse" className={appContainer}>
						<Header currentTopics={this.state.currentTopics} setTopics={this.setTopics} />
						<FlexChild className={resultsContainer}>
							<DataSearch
								componentId="repo"
								dataField={['name', 'description', 'name.keyword', 'fullname', 'owner', 'topics']}
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
