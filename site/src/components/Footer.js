import React from 'react';
import { Footer, Title } from '@appbaseio/designkit';

const getTitleStyle = (configName) => {
	if (configName === 'vue') {
		return {
			opacity: 0.5,
			color: '#ffffff',
		};
	}
	return {};
};
const getLinkStyle = (configName) => {
	if (configName === 'vue') {
		return {
			color: '#ffffff',
		};
	}
	return {};
};

const titleStyle = {
	margin: '0.9rem 0px',
};
// eslint-disable-next-line
export default ({ configName }) => (
	<Footer>
		<Footer.Brand>
			<img
				width="100%"
				src="https://opensource.appbase.io/reactivesearch/images/logo.svg"
				alt="appbase.io"
			/>
		</Footer.Brand>
		<Footer.Links>
			<Footer.List>
				<Title style={{ ...titleStyle, ...getTitleStyle(configName) }}>
					Reactive &lt;x
				</Title>
				<li>
					<a
						target="_blank"
						style={getLinkStyle(configName)}
						rel="noopener noreferrer"
						href="https://opensource.appbase.io/reactivesearch"
					>
						React
					</a>
				</li>
				<li>
					<a
						target="_blank"
						style={getLinkStyle(configName)}
						rel="noopener noreferrer"
						href="https://opensource.appbase.io/reactivesearch/native"
					>
						React Native
					</a>
				</li>
				<li>
					<a
						target="_blank"
						style={getLinkStyle(configName)}
						rel="noopener noreferrer"
						href="https://opensource.appbase.io/reactivesearch/vue"
					>
						Vue.JS
					</a>
				</li>
				<li>
					<a
						target="_blank"
						style={getLinkStyle(configName)}
						rel="noopener noreferrer"
						href="https://opensource.appbase.io/reactivemaps"
					>
						ReactiveMaps
					</a>
				</li>
			</Footer.List>

			<Footer.List>
				<Title style={{ ...titleStyle, ...getTitleStyle(configName) }}>Documentation</Title>
				<li>
					<a
						target="_blank"
						style={getLinkStyle(configName)}
						rel="noopener noreferrer"
						href="https://opensource.appbase.io/reactive-manual/getting-started/reactivesearch.html"
					>
						Quick Start Guide
					</a>
				</li>
				<li>
					<a
						target="_blank"
						style={getLinkStyle(configName)}
						rel="noopener noreferrer"
						href="https://opensource.appbase.io/reactive-manual/base-components/textfield.html"
					>
						Base Components
					</a>
				</li>
				<li>
					<a
						target="_blank"
						style={getLinkStyle(configName)}
						rel="noopener noreferrer"
						href="https://opensource.appbase.io/reactive-manual/map-components/geodistanceslider.html"
					>
						Map Components
					</a>
				</li>
				<li>
					<a
						target="_blank"
						style={getLinkStyle(configName)}
						rel="noopener noreferrer"
						href="https://opensource.appbase.io/reactive-manual/search-components/datasearch.html"
					>
						Search Components
					</a>
				</li>
				<li>
					<a
						target="_blank"
						style={getLinkStyle(configName)}
						rel="noopener noreferrer"
						href="https://opensource.appbase.io/reactive-manual/result-components/resultlist.html"
					>
						Result Components
					</a>
				</li>
			</Footer.List>

			<Footer.List>
				<Title style={{ ...titleStyle, ...getTitleStyle(configName) }}>Community</Title>
				<li>
					<a
						target="_blank"
						style={getLinkStyle(configName)}
						rel="noopener noreferrer"
						href="https://github.com/appbaseio/reactivesearch/"
					>
						GitHub
					</a>
				</li>
				<li>
					<a
						target="_blank"
						style={getLinkStyle(configName)}
						rel="noopener noreferrer"
						href="https://gitter.im/appbaseio/reactivesearch"
					>
						Gitter
					</a>
				</li>
				<li>
					<a
						target="_blank"
						style={getLinkStyle(configName)}
						rel="noopener noreferrer"
						href="https://stackoverflow.com/questions/tagged/reactivesearch"
					>
						Stackoverflow
					</a>
				</li>
				<li>
					<a
						target="_blank"
						style={getLinkStyle(configName)}
						rel="noopener noreferrer"
						href="https://twitter.com/appbaseio"
					>
						Twitter
					</a>
				</li>
			</Footer.List>

			<Footer.List>
				<Title style={{ ...titleStyle, ...getTitleStyle(configName) }} className="heading">
					More
				</Title>
				<li>
					<a
						target="_blank"
						style={getLinkStyle(configName)}
						rel="noopener noreferrer"
						href="https://medium.appbase.io/"
					>
						Medium Publication
					</a>
				</li>
				<li>
					<a
						target="_blank"
						style={getLinkStyle(configName)}
						rel="noopener noreferrer"
						href="http://docs.appbase.io/"
					>
						Appbase.io Docs
					</a>
				</li>
				<li>
					<a
						target="_blank"
						style={getLinkStyle(configName)}
						rel="noopener noreferrer"
						href="mailto:support@appbase.io"
					>
						Support Email
					</a>
				</li>
			</Footer.List>
		</Footer.Links>
	</Footer>
);
