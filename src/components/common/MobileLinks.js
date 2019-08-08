import React from 'react';
import { Link } from 'gatsby';
import getSidebarFile from './sidebar/getSidebarFile';
import Icon from './Icon';
import { Spirit } from '../../styles/spirit-styles';

class MobileLinks extends React.Component {
	state = {
		open: null,
	};

	toggleLinks = link => {
		this.setState(prevState => ({
			open: prevState.open === link ? null : link,
		}));
	};

	render() {
		const { file } = this.props;
		const { open } = this.state;
		const sidebarFile = getSidebarFile(file);

		return (
			<div>
				{sidebarFile.groups.map(item => {
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
									<Icon name={item.icon} className="dropdown-content-icon mr2" />
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
