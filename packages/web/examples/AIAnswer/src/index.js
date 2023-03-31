import ReactDOM from 'react-dom/client';

import {
	ReactiveBase,
	SearchBox,
	ReactiveList,
	ResultCard,
	SelectedFilters,
	AIAnswer,
} from '@appbaseio/reactivesearch';

import './index.css';

const Main = () => (
	<ReactiveBase
		app="good-books-ds"
		url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
		reactivesearchAPIConfig={{
			recordAnalytics: false,
			userId: 'jon',
		}}
		themePreset="dark"
	>
		<div className="row">
			<div className="col">
				<SearchBox
					title="SearchBox"
					dataField={['original_title', 'original_title.search']}
					componentId="BookSensor"
					URLParams
					enterButton
					highlight={false}
					defaultValue="Grasshopper Jungle"
				/>
				<AIAnswer
					componentId="ai-answer"
					placeholder="Ask your question!"
					showVoiceInput
					showIcon
					react={{ and: 'BookSensor' }}
					AIConfig={{
						docTemplate:
							'${source.text} is ${source.summary} with url as ${source.url}',
						queryTemplate: 'Answer the following: ${value}',
						topDocsForContext: 7,
					}}
					title={<b>AI Chatbox 🤩</b>}
					enterButton={true}
					onData={(param) => {
						console.log('param', param);
					}}
					// render={({ loading, data, error, rawData }) => {
					// 	if (loading) {
					// 		return 'loading...';
					// 	}
					// 	if (error) {
					// 		return <pre>JSON.stringify(error)</pre>;
					// 	}
					// 	if (data && Array.isArray(data)) {
					// 		return (
					// 			<div style={{ width: '80%', margin: '0 auto', padding: '20px' }}>
					// 				{data.map((message, index) => {
					// 					const isSender = message.role === 'user';
					// 					const messageStyle = {
					// 						backgroundColor: isSender ? '#cce5ff' : '#f8f9fa',
					// 						padding: '10px',
					// 						borderRadius: '7px',
					// 						marginBottom: '10px',
					// 						maxWidth: '80%',
					// 						alignSelf: isSender ? 'flex-end' : 'flex-start',
					// 						display: 'inline-block',
					// 						border: '1px solid',
					// 						color: isSender ? '#004085' : '#383d41',
					// 						position: 'relative',
					// 						whiteSpace: 'pre-wrap',
					// 					};

					// 					return (
					// 						<div
					// 							key={index}
					// 							style={{
					// 								display: 'flex',
					// 								justifyContent: isSender
					// 									? 'flex-end'
					// 									: 'flex-start',
					// 							}}
					// 						>
					// 							<div style={messageStyle}>{message.content}</div>
					// 						</div>
					// 					);
					// 				})}
					// 			</div>
					// 		);
					// 	}
					// }}
				/>
				<br />
				<SelectedFilters />
				<ReactiveList
					componentId="SearchResult"
					dataField="original_title"
					size={10}
					className="result-list-container"
					pagination
					react={{
						and: 'BookSensor',
					}}
					render={({ data }) => (
						<ReactiveList.ResultCardsWrapper>
							{data.map((item) => (
								<ResultCard id={item._id} key={item._id}>
									<ResultCard.Image src={item.image} />
									<ResultCard.Title>
										<div
											className="book-title"
											dangerouslySetInnerHTML={{
												__html: item.original_title,
											}}
										/>
									</ResultCard.Title>

									<ResultCard.Description>
										<div className="flex column justify-space-between">
											<div>
												<div>
													by{' '}
													<span className="authors-list">
														{item.authors}
													</span>
												</div>
												<div className="ratings-list flex align-center">
													<span className="stars">
														{
															/* eslint-disable */
															Array(item.average_rating_rounded)
																.fill('x')
																.map((_, index) => (
																	<i
																		className="fas fa-star"
																		key={index}
																	/>
																))
															/* eslint-enable */
														}
													</span>
													<span className="avg-rating">
														({item.average_rating} avg)
													</span>
												</div>
											</div>
											<span className="pub-year">
												Pub {item.original_publication_year}
											</span>
										</div>
									</ResultCard.Description>
								</ResultCard>
							))}
						</ReactiveList.ResultCardsWrapper>
					)}
				/>
			</div>
		</div>
	</ReactiveBase>
);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
