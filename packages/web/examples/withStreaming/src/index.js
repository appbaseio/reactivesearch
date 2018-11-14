import Appbase from 'appbase-js';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
	ReactiveBase,
	DataSearch,
	SelectedFilters,
	ResultList,
} from '@appbaseio/reactivesearch';

const streamingData = {
	genres: 'Action',
	original_language: 'English',
	original_title: 'Star Wars: The Last Jedi',
	overview:
		'Rey develops her newly discovered abilities with the guidance of Luke Skywalker, who is unsettled by the strength of her powers. Meanwhile, the Resistance prepares to do battle with the First Order.',
	poster_path: '/kOVEVeg59E0wsnXmF9nrh6OmWII.jpg',
	release_year: 2017,
	tagline: 'Episode VIII - The Last Jedi',
};

const appbaseRef = Appbase({
	url: 'https://scalr.api.appbase.io',
	app: 'streaming-demo',
	credentials: 'MpdmF7Z7C:f61f9b71-a3d0-4c8d-97a8-88b8106b553a',
});

const indexNewData = () =>
	new Promise((resolve, reject) => {
		appbaseRef
			.index({
				type: 'movies',
				body: streamingData,
			}).then(() => {
				resolve();
			}).catch((e) => {
				reject(e);
			});
	});

const onData = res => ({
	image: `https://image.tmdb.org/t/p/w92${res.poster_path}`,
	title: res.original_title,
	description: (
		<div>
			<p
				style={{ fontSize: '16px', lineHeight: '24px' }}
				dangerouslySetInnerHTML={{ __html: res.tagline }}
			/>
			<p
				style={{
					color: '#888',
					margin: '8px 0',
					fontSize: '13px',
					lineHeight: '18px',
				}}
				dangerouslySetInnerHTML={{ __html: res.overview }}
			/>
			<div>{res.genres ? <span className="tag">{res.genres}</span> : null}</div>
		</div>
	),
});

class Main extends Component {
	indexData = () => {
		this.hideJSONBlock();
		indexNewData();
	};

	renderIndexBlock = () => (
		<div style={{ marginTop: 0 }} className="search-field-container full-row">
			<div>
				<h3>Streaming updates</h3>
				<p>
					We will add a new movie to our dataset. Once added,
					it will appear in realtime in the existing results if it matches
					the search query.
				</p>
			</div>
			<button
				onClick={this.indexData}
			>
				Add New Movie
			</button>
		</div>
	);

	render() {
		return (
			<ReactiveBase
				app="streaming-demo"
				credentials="40TQvTOh4:302fc9bd-31b8-4794-b58d-e9adecc9b05b"
				className="search-app"
				theme={{
					colors: {
						primaryColor: '#FF307A',
					},
				}}
				style={{
					backgroundColor: '#fff',
					padding: '40px',
					borderRadius: '2px',
					textAlign: 'left',
				}}
			>
				{this.renderIndexBlock()}
				<header>
					<h2>
						The Movies Store{' '}
						<span role="img" aria-label="books">
							🎥
						</span>
					</h2>

					<DataSearch
						componentId="search"
						dataField={['original_title', 'original_title.search']}
						showIcon={false}
						placeholder="Search movies..."
						autosuggest={false}
						filterLabel="Search"
						fieldWeights={[10, 2]}
						highlight
						style={{
							maxWidth: '400px',
							margin: '0 auto',
						}}
					/>
				</header>

				<SelectedFilters style={{ marginTop: 20 }} />

				<div>
					<ResultList
						componentId="results"
						dataField="name"
						react={{
							and: ['search', 'genres', 'original_language', 'release_year'],
						}}
						size={4}
						onData={onData}
						className="right-col"
						innerClass={{
							listItem: 'list-item',
							resultStats: 'result-stats',
						}}
						pagination
						stream
					/>
				</div>
			</ReactiveBase>
		);
	}
}

ReactDOM.render(<Main />, document.getElementById('root'));
