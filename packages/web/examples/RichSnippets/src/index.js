import React from 'react';
import ReactDOM from 'react-dom';

import { ReactiveBase } from '@appbaseio/reactivesearch';

import './index.css';

const Main = () => (
	<ReactiveBase
		app="movies-store-rich-snippets"
		url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
		enableAppbase
	>
		Hello world!
	</ReactiveBase>
);

ReactDOM.render(<Main />, document.getElementById('root'));
