import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {
	ReactiveBase,
	RatingsFilter,
} from '@appbaseio/reactivesearch';

import './index.css';

class Main extends Component {
	render() {
		return (
			<div>RatingsFilter</div>
		);
	}
}

ReactDOM.render(<Main />, document.getElementById('root'));
