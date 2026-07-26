import React from 'react';
import { ReactiveBase } from '@appbaseio/reactivesearch';

function App() {
	return (
		<ReactiveBase
			url="https://reactivesearch-api-9-4-0.onrender.com"
			app="good-books-ds"
			credentials="d03e6f5f33d5:49124674-554e-4343-9ab2-006b2932f5c0"
		>
			{/* Our components will go over here */}
			Hello from ReactiveSearch 👋
		</ReactiveBase>
	);
}

export default App;
