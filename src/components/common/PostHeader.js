import React from 'react';
import PropTypes from 'prop-types';

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { Link } from 'gatsby';

import { Spirit } from '../../styles/spirit-styles';
import { getPostHeaderConfig } from '../../utils/getPostHeaderConfig';

const PostHeader = ({ location }) => {
	const { title, subtitle, bgClass, mainLink, subLink } = getPostHeaderConfig(location);

	const switchDocs = value => {
		if (location.pathname.includes('/reactivesearch')) {
			if (value.value === 'v0.10 - Native') {
				window.location.href = `${window.location.origin}/reactivesearch/native`;
			} else if (value.value === 'v1 - Vue') {
				window.location.href = `${window.location.origin}/reactivesearch/vue`;
			} else if (value.value === 'v3 - Web') {
				window.location.href = `${
					window.location.origin
				}/reactivesearch/v3/overview/quickstart`;
			} else if (value.value === 'v2 - Web') {
				window.location.href = `${window.location.origin}/reactivesearch/v2`;
			}
		}
	};

	if (title) {
		return (
			<div className={bgClass}>
				<div
					className={`${
						Spirit.page.xl
					} pt12 pb4 pt-vw1-ns pb-vw1-ns white pl10 pl0-ns post-header`}
				>
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
					<Dropdown
						options={['v3 - Web', 'v2 - Web', 'v0.10 - Native', 'v1 - Vue']}
						value="v3 - Web"
						onChange={switchDocs}
					/>
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
