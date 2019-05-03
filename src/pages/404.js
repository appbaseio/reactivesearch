import React from 'react';
import { Link } from 'gatsby';

import { Spirit } from '../styles/spirit-styles';
import { Layout } from '../components/common/layout';
import { Icon } from '../components/common';

const NotFoundPage = () => (
	<Layout headerDividerStyle="shadow">
		<div className={`${Spirit.page.m} pt-vw5 pb-vw5 flex flex-column items-center`}>
			<Icon name="four-o-four-icon" className="w15 h-auto stroke-lightgrey" />
			<h1 className={Spirit.h1}>404</h1>
			<p className={`${Spirit.p} midgrey`}>You just hit a route that doesn&#39;t exist.</p>
			<div className="flex mt5">
				<Link to="/" className="pa2 dib blue hover-darkgrey link br b--whitegrey">
					Docs
				</Link>
				<a href="https://appbase.io" className="pa2 dib blue hover-darkgrey link">
					Appbase.io
				</a>
			</div>
		</div>
	</Layout>
);

export default NotFoundPage;
