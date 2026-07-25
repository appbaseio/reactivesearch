import ReactDOM from 'react-dom/client';
import { Component } from 'react';
import { ReactiveBase } from '@appbaseio/reactivesearch';

class App extends Component {
	render() {
		return (
			<ReactiveBase
				app="earthquakes"
				url="https://reactivesearch-api-9-4-0.onrender.com"
				credentials="d03e6f5f33d5:49124674-554e-4343-9ab2-006b2932f5c0"
				enableAppbase
				mapKey="AIzaSyA9JzjtHeXg_C_hh_GdTBdLxREWdj3nsOU"
			>
				{/* // other components will go here. */}
				<div>Hello ReactiveSearch!</div>
			</ReactiveBase>
		);
	}
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
