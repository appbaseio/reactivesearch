import React from 'react';
import { ReactiveBase, TreeList, ReactiveList, SelectedFilters } from '@appbaseio/reactivesearch';
import { isJson } from '../utils';

const SearchUI = () => {
	function reactiveList(data) {
		return (
			<div className="flex book-content" key={data._id}>
				<img src={data.image} alt="Book Cover" className="book-image" />
				<div className="flex column justify-center" style={{ marginLeft: 20 }}>
					<div className="book-header">{data.name}</div>
					<div className="flex column justify-space-between">
						<div>
							<div>
								<span className="authors-list">
									{data.class} > {data.subclass}
								</span>
							</div>
							<div className="ratings-list flex align-center">
								Sale Price 💰 <b>{data.salePrice}</b>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	const setSearchParams = (urlWithQueryParams) => {
		const urlObject = new URL(urlWithQueryParams);

		let category, subCategory;
		// iterate through the key/value pairs
		for (const [key, value] of urlObject.searchParams.entries()) {
			const parsedValue = isJson(decodeURIComponent(value))
				? JSON.parse(decodeURIComponent(value))
				: null;
			if (key === 'BookSensor' && parsedValue) {
				if (Array.isArray(parsedValue)) {
					const selectedValues = parsedValue[0].split(' > ');
					category = selectedValues?.[0]
						?.replaceAll(' ', '-')
						// replace slashes to not consider slashes in the category value as path separator
						?.replaceAll('/', '∙');
					subCategory = selectedValues?.[1]
						?.replaceAll(' ', '-')
						// replace slashes to not consider slashes in the category value as path separator
						?.replaceAll('/', '∙');
				}
			}
		}

		// build URL with category and sub-category path
		const state = { category, subCategory };
		const url = `${category ?? ''}${subCategory ? '/' + subCategory : ''}`;

		window.history.pushState(state, '', '/' + url);
	};

	const getSearchParams = () => {
		const bookSensorValue = [
			window.location.pathname
				.replaceAll('-', ' ')
				// change back the special character to slash('/'),
				// changed in setSearchParams the slash is part of the string value
				.replaceAll('∙', '/')
				.split('/')
				.filter((i) => i)
				.join(' > '),
		].filter((i) => i);
		let searchParams = new URLSearchParams('');
		if (bookSensorValue.length) searchParams.set('BookSensor', JSON.stringify(bookSensorValue));
		return searchParams.toString() ? '?' + searchParams.toString() : '';
	};

	return (
		<ReactiveBase
			app="best-buy-dataset"
			url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
			enableAppbase
			getSearchParams={getSearchParams}
			setSearchParams={setSearchParams}
		>
			<div className="row">
				<div className="col">
					<TreeList
						componentId="BookSensor"
						showCount
						title="TreeList UI"
						showCheckbox
						mode="single"
						URLParams
						dataField={['class.keyword', 'subclass.keyword']}
					/>
				</div>

				<div className="col">
					<SelectedFilters />
					<ReactiveList
						componentId="SearchResult"
						dataField="original_title"
						className="result-list-container"
						from={0}
						size={5}
						renderItem={reactiveList}
						react={{
							and: ['BookSensor'],
						}}
						defaultQuery={() => ({
							track_total_hits: true,
						})}
						includeFields={['class', 'subclass', 'name', 'image', 'salePrice']}
					/>
				</div>
			</div>
		</ReactiveBase>
	);
};

export default SearchUI;
