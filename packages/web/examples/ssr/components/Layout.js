import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

const Layout = ({ children, title = '⚡ SSR with Reactivesearch' }) => (
	<div>
		<Head>
			<title>{title}</title>
		</Head>
		{children}
	</div>
);

Layout.propTypes = {
	children: PropTypes.any, // eslint-disable-line
	title: PropTypes.string,
};

export default Layout;
