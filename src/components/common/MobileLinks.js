import React from 'react';
import { globalHistory } from '@reach/router';
import { Link } from 'gatsby';
import getSidebarFile from './sidebar/getSidebarFile';
import Icon from './Icon';
import { Spirit } from '../../styles/spirit-styles';

class MobileLinks extends React.Component {
	constructor(props) {
		super();
		const link = globalHistory && globalHistory.location && globalHistory.location.pathname;
		const { file } = props;
		const sidebarFile = getSidebarFile(file);
		const items = sidebarFile.groups
			? sidebarFile.groups
					.filter(item => !!item.items)
					.reduce((agg, item) => {
						const parsedItems = item.items.map(links => ({
							...links,
							topic: item.group,
						}));

						return [...parsedItems, ...agg];
					}, [])
			: sidebarFile.items;
		let group = null;
		if (link) {
			group = items.find(item => item.link === link);
		}

		this.state = {
			open: group ? group.topic : null,
		};
	}

	toggleLinks = link => {
		this.setState(prevState => ({
			open: prevState.open === link ? null : link,
		}));
	};

	render() {
		const { open } = this.state;
		const { file } = this.props;
		const sidebarFile = getSidebarFile(file);

		if (sidebarFile.items) {
			return (
				<div className="guide-box-links pl3 pa2">
					{sidebarFile.items.map(link => (
						<div key={link.link} className="guide-link">
							<div className="link-dot" />
							<Link
								className={`${Spirit.p} link ${
									window &&
									window.location &&
									window.location.pathname === link.link
										? 'blue fw6 active-link'
										: 'hover-blue'
								} midlightgrey  `}
								to={link.link}
							>
								{link.title}
							</Link>
						</div>
					))}
				</div>
			);
		}

		return (
			<div>
				{sidebarFile.groups &&
					sidebarFile.groups.map(item => {
						if (!item.items) {
							return null;
						}
						return (
							<div key={item.group}>
								<div
									className="middarkgrey-d2 link hover-blue nowrap fw6 nowrap f5 pa3 pb1 mr3 mr3-l nl3 dropdown-link"
									onClick={() => this.toggleLinks(item.group)}
								>
									{item.icon && (
										<Icon
											name={item.icon}
											className="dropdown-content-icon mr2"
										/>
									)}
									{item.group}
								</div>
								{item.group === open ? (
									<div className="guide-box-links pl3 pa2">
										{item.items.map(link => (
											<div key={link.link} className="guide-link">
												<div className="link-dot" />
												<Link
													className={`${Spirit.p} link ${
														window &&
														window.location &&
														window.location.pathname === link.link
															? 'blue fw6 active-link'
															: 'hover-blue'
													} midlightgrey  `}
													to={link.link}
												>
													{link.title}
												</Link>
											</div>
										))}
									</div>
								) : null}
							</div>
						);
					})}
			</div>
		);
	}
}
export default MobileLinks;
