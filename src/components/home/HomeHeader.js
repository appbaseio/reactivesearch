import React from 'react';

import { NavBar, Icon } from '../common';
import { Spirit } from '../../styles/spirit-styles';

// Custom headings must be React components. You should include the <NavBar /> component
// somewhere in it. You can optionally set the theme of the navbar to `dark` or `light`.
const HomeHeader = () => (
	<div className="gh-bg-home bb b--whitegrey">
		<header className="top-0 left-0 right-0 bg-white fixed z-999">
			<NavBar theme="dark" />
		</header>
		<div
			className={`${
				Spirit.page.xl
			} pb5 pt10 pt15-ns pt20-l pb10-ns pb15-l flex items-between bt bn-ns b--white-10 home-header`}
		>
			<div>
				<h1 className="ma0 mt8 pt5 pa0 f2 f1-ns f-headline-l white header-heading-shadow">
					Appbase Documentation
				</h1>
				<p className={`${Spirit.sectionSubHeading} f2 lightgrey`}>
					Appbase.io is a hosted Elasticsearch service with built-in publish/subscribe
					support for streaming document updates and query results.
				</p>
			</div>
			<div className="home-header-graphics">
				<div>
					<img src="images/searcUI@3x.png" />
					<img src="images/search-relevancy@3x.png" />
				</div>
				<div>
					<img src="images/search-relevancy@3x.png" />
					<img src="images/analytics@3x.png" />
				</div>
			</div>
		</div>
	</div>
);

export default HomeHeader;
