import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { extractCritical } from 'emotion-server';

export default class MyDocument extends Document {
	static getInitialProps({ renderPage }) {
		// for emotion-js
		const page = renderPage();
		const styles = extractCritical(page.html);
		return { ...page, ...styles };
	}

	constructor(props) {
		// for emotion-js
		super(props);
		const { __NEXT_DATA__, ids } = props;
		if (ids) {
			__NEXT_DATA__.ids = ids;
		}
	}

	render() {
		return (
			<html lang="en">
				<Head>
					<link rel="stylesheet" href="/_next/static/style.css" />
					<meta charSet="utf-8" />
					<meta name="viewport" content="initial-scale=1.0, width=device-width" />
					{/* for emotion-js */}
					<style dangerouslySetInnerHTML={{ __html: this.props.css }} />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</html>
		);
	}
}
