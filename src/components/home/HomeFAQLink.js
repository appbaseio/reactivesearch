import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';

import { Spirit } from '../../styles/spirit-styles';

const HomeFAQLink = ({ to, title, children }) => (
	<Link to={to} className="midgrey home-faq-question link dib pt1 pb5">
		<h4 className={`${Spirit.h5} blue dib`}>{title} &raquo;</h4>
		<p className={`${Spirit.small} mt0`}>{children}</p>
	</Link>
);

HomeFAQLink.propTypes = {
	to: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
};

export default HomeFAQLink;
