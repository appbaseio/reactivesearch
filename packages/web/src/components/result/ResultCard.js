import React, { Component } from 'react';
import { oneOfType } from 'prop-types';
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
			children, href, target, id, ...props
		} = this.props;

		return (
			<Card
				id={id}
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
	id: oneOfType([types.string, types.number]),
	href: types.string,
};

ResultCard.defaultProps = {
	target: '_blank',
};

export default ResultCard;
