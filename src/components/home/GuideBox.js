import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';

import { Spirit } from '../../styles/spirit-styles';

const GuideBox = ({ links, description, title, color, index }) => (
	<div className="guide-box br4 db br4 mt6 mb2">
		<div>
			<div className="guide-title mb3">
				<h2 className="guide-index mr2 mb0 mt0 middarkgrey">{index + 1}</h2>
				<h2 className={`${Spirit.h3} mt0 mb0 darkgrey flex-shrink-1`}>{title}</h2>
			</div>
			<p className={`${Spirit.p} midgrey`}>{description}</p>
		</div>
		<div className="guide-box-links">
			{links.map(item => (
				<div className="guide-link" key={item.title}>
					<div className="link-dot" />
					<Link className={`${Spirit.p} midlightgrey link hover-blue`} to={item.link}>
						{item.title}
					</Link>
				</div>
			))}
		</div>
	</div>
);

export default GuideBox;
