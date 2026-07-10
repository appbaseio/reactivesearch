import ReactDOM from 'react-dom/client';

import { ReactiveBase } from '@appbaseio/reactivesearch';

import './index.css';
import App from './App';

const Main = () => (
	<ReactiveBase
		app="movies-store-app"
		credentials="d03e6f5f33d5:49124674-554e-4343-9ab2-006b2932f5c0"
		url="https://reactivesearch-api-9-4-0.onrender.com"
	>
		<App />
	</ReactiveBase>
);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
