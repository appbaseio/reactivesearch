import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';

import { Spirit } from '../../styles/spirit-styles';
import { getPostHeaderConfig } from '../../utils/getPostHeaderConfig';

const PostHeader = ({ location }) => {
	const { title, subtitle, bgClass, mainLink, subLink } = getPostHeaderConfig(location);

	if (title) {
		return (
			<div className={bgClass}>
				<div className={`${Spirit.page.xl} pt12 pb4 pt-vw1-ns pb-vw1-ns white pl10 pl0-ns`}>
					<h1 className={`${Spirit.h4} gh-integration-header-shadow`}>
						<Link
							to={mainLink}
							className={`link dim ${subtitle ? `white-80 fw3` : `white`}`}
						>
							{title}
						</Link>
						{subtitle ? (
							<Link
								to={subLink}
								className="link white dim titleslash-white pl4 ml4 relative"
							>
								{subtitle}
							</Link>
						) : null}
					</h1>
				</div>
			</div>
		);
	}
	return null;
};

PostHeader.propTypes = {
	location: PropTypes.shape({
		pathname: PropTypes.string.isRequired,
	}).isRequired,
};

export default PostHeader;
