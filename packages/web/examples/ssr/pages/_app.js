/* eslint-disable react/prop-types */
import React from 'react';
import './styles/airbnb.css';
import '../components/index.css';

export default function MyApp({ Component, pageProps }) {
	return <Component {...pageProps} />;
}
