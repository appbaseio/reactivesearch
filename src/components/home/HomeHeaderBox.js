import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';

import { Icon } from '../common';
import { Spirit } from '../../styles/spirit-styles';

const HomeHeaderBox = ({ to, title, color, icon, children }) => (
	<Link
		to={to}
		className="col-12 col-4-ns pa5 pa8-ns pa10-l pt8-l flex flex-column-ns items-start tdn content-stretch home-main-box-shadow db br4 bg-white"
	>
		<Icon name={icon} className={`w10 h-auto w12-ns stroke-w--1-5 mr3 mb2 stroke-${color}`} />
		<div className="flex flex-column justify-between flex-auto">
			<div>
				<h2 className={`${Spirit.h4} mt0 mt2-ns darkgrey flex-shrink-1`}>{title}</h2>
				<p className={`${Spirit.small} midgrey`}>{children}</p>
			</div>
			<span className={`${color} dib mt2 link fw5 f7 f5-ns flex items-center`}>
				Learn more
				<Icon name="arrow-right" className={`w3 h3 ml2 fill-${color}`} />
			</span>
		</div>
	</Link>
);

HomeHeaderBox.propTypes = {
	to: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	color: PropTypes.string.isRequired,
	icon: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
};

export default HomeHeaderBox;
