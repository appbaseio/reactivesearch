import React from 'react';
import ReactDropdown from 'react-dropdown';
import { globalHistory } from '@reach/router';
import Search from './search/HomeSearch';
import Icon from './Icon';

import MobileLinks from './MobileLinks';

const getValue = () => {
	const path = globalHistory.location.pathname;
	if (window) {
		if (path && path.startsWith('/docs/reactivesearch/v2')) {
			return 'v2 - Web';
		}
		if (path && path.startsWith('/docs/reactivesearch/vue')) {
			return 'v1 - Vue';
		}
		if (path && path.startsWith('/docs/reactivesearch/native')) {
			return 'v0.12 - Native';
		}
	}

	return 'v3 - Web';
};

const getFileName = value => {
	switch (value) {
		case 'v0.10 - Native':
			return 'native-reactivesearch';
		case 'v1 - Vue':
			return 'vue-reactivesearch';
		case 'v2 - Web':
			return 'web-v2-reactivesearch';
		default:
			return 'web-reactivesearch';
	}
};

const getIconName = value => {
	switch (value) {
		case 'v0.10 - Native':
			return 'native-bw';
		case 'v1 - Vue':
			return 'vue-bw';
		case 'v2 - Web':
			return 'react-bw';
		default:
			return 'react-bw';
	}
};

class MobileNav extends React.Component {
	state = {
		open: false,
		rs: getValue(),
	};

	handleSidebar = () => {
		this.setState(prevState => ({
			open: !prevState.open,
		}));
	};

	switchDocs = value => {
		this.setState({
			rs: value.value,
		});
	};

	render() {
		const { open, rs } = this.state;
		return (
			<div className="mobile-nav">
				<div onClick={this.handleSidebar}>
					<Icon name="hamburger" className="hamburger" />
				</div>
				<div className={`mobile-sidebar pa5 pb10 ${open ? 'open' : ''}`}>
					<div className="mobile-nav-container">
						<div className="relative home-search-container mb5">
							<Search />
						</div>
						<h2 className="f4 mb2 lh-h5 lh-h4-l fw6 ma0 pa0  mt0 mt2-ns darkgrey">
							Guides
						</h2>
						<p className="f5 lh-h5 lh-h4-l fw4 ma0 pa0 mt0 mt2-ns middarkgrey mb2">
							Discover how to integrate and adapt Appbaseio's technology into popular
							frameworks and platforms.
						</p>
						<div className="mt5 mb3">
							<div className="mobile-links-container">
								<MobileLinks file="docs" />
							</div>
						</div>
						<h2 className="f4 mt6 mb2 lh-h5 lh-h4-l fw6 ma0 pa0 darkgrey">
							API Reference
						</h2>
						<p className="f5 lh-h5 lh-h4-l fw4 ma0 pa0 mt0 mt2-ns middarkgrey mb2">
							Discover how to integrate and adapt Appbaseio's technology into popular
							frameworks and platforms.
						</p>
						<div className="mt5 mb3">
							<div className="mobile-links-container">
								<MobileLinks file="api-reference" />
							</div>
						</div>
						<h2 className="f4 mt6 mb2 lh-h5 lh-h4-l fw6 ma0 pa0 darkgrey between">
							<span className="middarkgrey">ReactiveSearch</span>
							<Icon className="dropdown-content-icon ml2" name={getIconName(rs)} />
						</h2>
						<p className="f5 lh-h5 lh-h4-l fw4 ma0 pa0 mt0 mt2-ns middarkgrey mb2">
							Discover how to integrate and adapt Appbaseio's technology into popular
							frameworks and platforms.
						</p>
						<ReactDropdown
							options={['v3 - Web', 'v2 - Web', 'v0.10 - Native', 'v1 - Vue']}
							value={rs}
							onChange={this.switchDocs}
						/>
						<div className="mt5 mb3">
							<div className="mobile-links-container">
								<MobileLinks file={getFileName(rs)} />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default MobileNav;
