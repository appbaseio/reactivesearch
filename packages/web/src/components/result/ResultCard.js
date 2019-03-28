import React, { Component } from 'react';

import types from '@appbaseio/reactivecore/lib/utils/types';
import Title from '../../styles/Title';
import Card, { Image } from '../../styles/Card';

class ResultCard extends Component {
	static Image = ({ src, ...props }) => (
		<Image style={{ backgroundImage: `url(${src})` }} {...props} />
	);
	static Title = ({ children, ...props }) => <Title {...props}>{children}</Title>;
	static Description = ({ children, ...props }) => <article {...props}>{children}</article>;

	render() {
		const {
			children, href, target, ...props
		} = this.props;

		return (
			<Card
				href={href}
				target={target}
				rel={target === '_blank' ? 'noopener noreferrer' : null}
				{...props}
			>
				{children}
			</Card>
		);
	}
}

ResultCard.Image.displayName = 'ResultCardImage';

ResultCard.propTypes = {
	children: types.children,
	target: types.stringRequired,
	href: types.string,
};

ResultCard.defaultProps = {
	target: '_blank',
};

export default ResultCard;
