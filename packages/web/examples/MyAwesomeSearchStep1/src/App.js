import React from 'react';
import { ReactiveBase } from '@appbaseio/reactivesearch';

function App() {
	return (
		<ReactiveBase
			url="https://appbase-demo-ansible-abxiydt-arc.searchbase.io"
			app="good-books-ds"
			credentials="04717bb076f7:be54685e-db84-4243-975b-5b32ee241d31"
		>
			{/* Our components will go over here */}
			Hello from ReactiveSearch 👋
		</ReactiveBase>
	);
}

export default App;
