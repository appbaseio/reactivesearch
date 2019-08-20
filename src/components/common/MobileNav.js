import React from 'react';
import ReactDropdown from 'react-dropdown';
import { globalHistory } from '@reach/router';
import Search from './search/HomeSearch';
import Icon from './Icon';

import MobileLinks from './MobileLinks';

const getValue = () => {
	if (globalHistory) {
		const path = globalHistory.location && globalHistory.location.pathname;
		if (path && path.startsWith('/docs/reactivesearch/v2')) {
			return 'React - v2';
		}
		if (path && path.startsWith('/docs/reactivesearch/vue')) {
			return 'Vue';
		}
		if (path && path.startsWith('/docs/reactivesearch/native')) {
			return 'Native';
		}
	}

	return 'React - v3';
};

const getFileName = value => {
	switch (value) {
		case 'Native':
			return 'native-reactivesearch';
		case 'Vue':
			return 'vue-reactivesearch';
		case 'React - v2':
			return 'web-v2-reactivesearch';
		default:
			return 'web-reactivesearch';
	}
};

const getVersionName = value => {
	switch (value) {
		case 'Native':
			return 'Native';
		case 'Vue':
			return 'Vue';
		case 'React - v2':
			return 'v2';
		default:
			return 'v3';
	}
};

const getIconName = value => {
	switch (value) {
		case 'Native':
			return 'native-bw';
		case 'Vue':
			return 'vue-bw';
		case 'React - v2':
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
						{/* <div className="relative home-search-container mb5">
							<Search />
						</div> */}
						<h2 className="f4 mb2 lh-h5 lh-h4-l fw6 ma0 pa0  mt0 mt2-ns darkgrey">
							Guides
						</h2>
						<p className="f5 lh-h5 lh-h4-l fw4 ma0 pa0 mt0 mt2-ns middarkgrey mb2">
							Step wise guide from making your search app to securing it.
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
							<span className="middarkgrey">ReactiveSearch {getVersionName(rs)}</span>
							<Icon className="dropdown-content-icon ml2" name={getIconName(rs)} />
						</h2>
						<p className="f5 lh-h5 lh-h4-l fw4 ma0 pa0 mt0 mt2-ns middarkgrey mb2">
							Read about ReactiveSearch Libraries and how to integrate and adapt it in
							your app.
						</p>
						<ReactDropdown
							options={['React - v3', 'React - v2', 'Native', 'Vue']}
							value={rs}
							className="version-switcher shadow-3 br2"
							menuClassName="br2 shadow-3"
							arrowOpen={
								<Icon className="inline middarkgrey w2" name="arrow-up-small" />
							}
							arrowClosed={
								<Icon className="inline middarkgrey w2" name="arrow-down-small" />
							}
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
