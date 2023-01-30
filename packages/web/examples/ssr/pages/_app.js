/* eslint-disable react/prop-types */
import React from 'react';
import './styles/movies.css';
import '../components/index.css';

export default function MyApp({ Component, pageProps }) {
	return <Component {...pageProps} />;
}
