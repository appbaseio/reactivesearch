import React from 'react';
import ReactDOM from 'react-dom';

import { ReactiveBase, ReactiveList, SearchBox } from '@appbaseio/reactivesearch';

import { logo } from './icons';
import './index.css';

const Main = () => (
	<ReactiveBase
		app="movies-store-rich-snippets"
		url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
		enableAppbase
	>
		<div className="cover">
			<p className="logo">
				<span className="logoImg">
					{logo}
				</span>
				<span className="logoText">reactivesearch</span>
			</p>
			<p className="coverTitle">Rich snippets</p>
			<SearchBox className="searchBox" autosuggest componentId="search-box" dataField="original_title" />
		</div>
		<div className="results">
			<ReactiveList
				componentId="SearchResult"
				size={3}
				pagination
				dataField="original_title"
				URLParams
				react={{
					and: 'search-box',
				}}
				render={({ data, rawData }) => {
					const knowledgeGraph = rawData && rawData.knowledgeGraph;
					const knowledgeGraphItem = knowledgeGraph && knowledgeGraph.itemListElement[0].result;
					return (
						<div className="grid">
							<div className="sidebar">
								<div className="banner">
									{knowledgeGraphItem ? (
										<div>
											<img src={knowledgeGraphItem.image.contentUrl} className="bannerImg" alt="movie poster" />
											<div className="bannerText">{knowledgeGraphItem.name}</div>
										</div>
									) : 'No results'}
								</div>
							</div>
						</div>
					);
				}}
			/>
		</div>
	</ReactiveBase>
);

ReactDOM.render(<Main />, document.getElementById('root'));
