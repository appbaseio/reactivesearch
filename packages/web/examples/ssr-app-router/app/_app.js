/* eslint-disable react/prop-types */
import React from 'react';
import App from 'next/app';
import { getServerState } from '@appbaseio/reactivesearch';

import '../styles/movies.css';
import '../styles/index.css';
import Main from './page';

class MyApp extends App {
	static async getInitialProps({ Component, ctx }) {
	  let pageProps = {};

	  if (Component.getInitialProps) {
			pageProps = await Component.getInitialProps(ctx);
	  }

	  // Perform your server-side data fetching or initialization here
	  let initialState = {};
	  initialState = await getServerState(Main, ctx.resolvedUrl);

	  return { pageProps, initialState };
	}

	render() {
	  const { Component, pageProps, initialState } = this.props;

	  return <Component {...pageProps} initialState={initialState} />;
	}
}

export default MyApp;
