import React from 'react';
import ReactDOM from 'react-dom';

import { ReactiveBase } from '@appbaseio/reactivesearch';

import './index.css';
import App from './App';

const Main = () => (
	<ReactiveBase
		app="movies-store-app"
		credentials="b6bf924c4fb1:770dc0a7-7c11-415f-a5f1-88fa24633063"
		url="https://appbase-demo-ansible-abxiydt-arc.searchbase.io"
		enableAppbase
	>
		<App />
	</ReactiveBase>
);

ReactDOM.render(<Main />, document.getElementById('root'));
