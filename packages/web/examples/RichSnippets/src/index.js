import ReactDOM from 'react-dom/client';

import { ReactiveBase, ReactiveList, SearchBox } from '@appbaseio/reactivesearch';

import { logo, Star } from './icons';
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
				size={15}
				pagination
				dataField="original_title"
				URLParams
				react={{
					and: 'search-box',
				}}
				showResultStats={false}
				render={({ data, rawData, resultStats }) => {
					const knowledgeGraph = rawData && rawData.knowledgeGraph;
					const knowledgeGraphItem = knowledgeGraph
												&& knowledgeGraph.itemListElement[0]
												&& knowledgeGraph.itemListElement[0].result;
					return (
						<div className="grid">

							<div className="resultStats">
								{resultStats.numberOfResults ? `Found ${resultStats.numberOfResults} results in ${resultStats.time}ms` : ''}
							</div>
							<div className="sidebar">
								{knowledgeGraphItem ? (
									<a href={knowledgeGraphItem.detailedDescription ? knowledgeGraphItem.detailedDescription.url : '#'} target="_blank" className="banner" rel="noreferrer">
										<div>
											{knowledgeGraphItem.image ? (<img src={knowledgeGraphItem.image.contentUrl} className="bannerImg" alt="movie poster" />) : null}
											<h3 className="bannerText">{knowledgeGraphItem.name}</h3>
											<p>{knowledgeGraphItem.detailedDescription.articleBody.substr(0, 100).concat('...')
											}
											</p>
										</div>
									</a>
								) : null}
							</div>
							<div className="list main">
								{data.map(item => (
									<div key={item.id} className="card">
										<img className="cardImg" src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} alt="movie" />
										<div className="cardTitle">{item.title}</div>
										<div className="flex">
											<div className="cardBadge bold uppercase">{item.adult ? 'A' : 'UA'}</div>
											<div className="cardBadge uppercase">{item.original_language}</div>
											<div className="cardBadge">{item.release_year}</div>
										</div>
										<div className="ratings flex">
											<Star size={15} />
											<div>{item.vote_average}</div>
										</div>
									</div>
								))}
							</div>
						</div>
					);
				}}
			/>
		</div>
	</ReactiveBase>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
