import React from 'react';
import PostLayout from '../../../components/PostLayout';

import '../../../styles/started.css';

const GettingStarted = props => {
	return (
		<PostLayout
			sidebar="docs"
			nestedSidebar="web-reactivesearch"
			location={props.location}
			post={{ title: '' }}
		>
			<h2>Choose your UI Library</h2>
			<p>You can choose from these UI components libraries for building your search UI.</p>
			<div className="container getting-started">
				<div className="card">
					<img
						src="/images/react.jpeg"
						alt="React"
					/>
					<div className="content">
						<h2>UI Integrations</h2>
						<p>UI Integrations enables creating a storefront / site search UI visually.</p>
						<a className="btn" href="/docs/reactivesearch/ui-integrations/Overview">
							Start with UI Integrations
						</a>
					</div>
				</div>
				<div className="card">
					<img
						src="/images/react.jpeg"
						alt="React"
					/>
					<div className="content">
						<h2>React</h2>
						<p>React UI components for building data-driven search experiences</p>
						<a className="btn" href="/docs/reactivesearch/v3/overview/quickstart/">
							Start with React
						</a>
					</div>
				</div>
				<div className="card">
					<img
						src="/images/react-native.jpeg"
						alt="React Native"
					/>
					<div className="content">
						<h2>React Native</h2>
						<p>React Native UI components for data-driven search experiences</p>
						<a className="btn" href="/docs/reactivesearch/native/overview/QuickStart/">
							Start with React Native
						</a>
					</div>
				</div>
				<div className="card">
					<img
						src="/images/vue.png"
						alt="Vue"
					/>
					<div className="content">
						<h2>Vue</h2>
						<p>Vue UI components for building data-driven search experiences</p>
						<a className="btn" href="/docs/reactivesearch/vue/overview/QuickStart/">
							Start with Vue
						</a>
					</div>
				</div>
				<div className="card">
					<img src="/images/Searchbox_JS@1x.png" alt="Searchbox" />
					<div className="content">
						<h2>Searchbox</h2>
						<p>
							Vanilla JS searchbox UI component to query and display results from your
							Elasticsearch app (aka index)
						</p>
						<a className="btn" href="/docs/reactivesearch/searchbox/Quickstart/">
							Start with Searchbox
						</a>
					</div>
				</div>
				<div className="card">
					<img src="/images/Searchbox_React@1x.png" alt="React Searchbox" />
					<div className="content">
						<h2>React Searchbox</h2>
						<p>
							React searchbox UI component to query and display results from your
							Elasticsearch app (aka index) using declarative props.
						</p>
						<a className="btn" href="/docs/reactivesearch/react-searchbox/quickstart/">
							Start with React Searchbox
						</a>
					</div>
				</div>
				<div className="card">
					<img src="/images/Searchbox_Vue@1x.png" alt="Vue Searchbox" />
					<div className="content">
						<h2>Vue Searchbox</h2>
						<p>
							Vue searchbox UI component to query and display results from your
							Elasticsearch app (aka index) using declarative props.
						</p>
						<a className="btn" href="/docs/reactivesearch/vue-searchbox/quickstart/">
							Start with Vue Searchbox
						</a>
					</div>
				</div>

				<div className="card">
					<img
						src="/images/REST.png"
						alt="REST API"
					/>
					<div className="content">
						<h2>REST API</h2>
						<p>Appbase.io REST API (Elasticsearch compatible)</p>
						<a className="btn" href="/api/rest/quickstart/">
							Start with REST API
						</a>
					</div>
				</div>
				<div className="card">
					<img
						src="/images/android.jpeg"
						alt="Android Library"
					/>
					<div className="content">
						<h2>Android Library</h2>
						<p>Elasticsearch and appbase.io library for Android (and Java)</p>
						<a
							className="btn"
							href="https://github.com/appbaseio/appbase-droid"
							target="_blank"
							rel="noopener noreferrer"
						>
							Start with Android
						</a>
					</div>
				</div>
				<div className="card">
					<img
						src="/images/swift.jpeg"
						alt="Swift Library"
					/>
					<div className="content">
						<h2>Swift Library</h2>
						<p>Elasticsearch and appbase.io library for Swift iOS / MacOS</p>
						<a
							className="btn"
							href="https://github.com/appbaseio/appbase-swift"
							target="_blank"
							rel="noopener noreferrer"
						>
							Start with Swift
						</a>
					</div>
				</div>

				<div className="card">
					<img src="/images/Searchbase@1x.png" alt="Searchbase" />
					<div className="content">
						<h2>Searchbase</h2>
						<p>
							A lightweight & platform agnostic search library with some common
							utilities.
						</p>
						<a
							className="btn"
							href="/docs/reactivesearch/searchbase/overview/QuickStart/"
						>
							Start with Searchbase
						</a>
					</div>
				</div>
			</div>
		</PostLayout>
	);
};
export default GettingStarted;
