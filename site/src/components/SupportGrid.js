import React from 'react';
import { Grid, Card, Title } from '@appbaseio/designkit';

// eslint-disable-next-line
export default ({ configName }) => {
	const imagePrefix = configName === 'vue' ? '/images/vue' : '/images/support';
	return (
		<Grid
			size={4}
			lgSize={2}
			smSize={1}
			gutter="20px"
			lgGutter="12px"
			smGutter="0px"
			style={{
				marginTop: '60px',
			}}
		>
			<Card big href="https://opensource.appbase.io/reactive-manual">
				<img src={`${imagePrefix}/Documentation.svg`} alt="Documentation" />
				<Title>Documentation</Title>
				<p>
					Dive in to learn all about{' '}
					<span
						style={{
							color: '#0033FF',
						}}
					>
						Reactive X
					</span>{' '}
					development for all platforms.
				</p>
			</Card>
			<Card big href="https://medium.appbase.io">
				<img src={`${imagePrefix}/Tutorials.svg`} alt="Tutorials" />
				<Title>Tutorials</Title>
				<p>Go from scratch to a full app with these tutorial guides.</p>
			</Card>
			<Card big href="https://appbase.io/support">
				<img
					src={`${imagePrefix}/Support.png`}
					alt="Support"
				/>
				<Title>Support</Title>
				<p>
					Get first-class support from appbase.io for your{' '}
					<span
						style={{
							color: '#0033FF',
						}}
					>
						Reactive X
					</span>{' '}
					app.
				</p>
			</Card>
			<Card big href="https://gitter.im/appbaseio/reactivesearch">
				<img src={`${imagePrefix}/Gitter.svg`} alt="Gitter" />
				<Title>Gitter</Title>
				<p>
					Join our community on Gitter. We
					{"'"}
					re always around and happy to help.
				</p>
			</Card>
		</Grid>
	);
};
