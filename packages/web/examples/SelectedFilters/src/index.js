import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import {
	ReactiveBase,
	SelectedFilters,
} from '@appbaseio/reactivesearch';

import './index.css';

class Main extends Component {
	render() {
		return (
			<div>SelectedFilters</div>
		);
	}
}

ReactDOM.render(<Main />, document.getElementById('root'));
