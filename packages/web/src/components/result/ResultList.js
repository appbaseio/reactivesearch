import React, { Component } from 'react';
import types from '@appbaseio/reactivecore/lib/utils/types';
import Title from '../../styles/Title';
import ListItem from '../../styles/ListItem';
import ResultListImage from './addons/ResultListImage';

class ResultList extends Component {
	static Image = ResultListImage;
	static Content = ({ children, ...props }) => <article {...props}>{children}</article>;
	static Title = ({ children, ...props }) => <Title {...props}>{children}</Title>;
	static Description = ({ children, ...props }) => <div {...props}>{children}</div>;

	state = {
		hasImage: false,
	};

	componentDidMount() {
		let hasImage = false;
		React.Children.forEach(this.props.children, (o) => {
			if (!hasImage && o.type && o.type.name === ResultListImage.name) {
				hasImage = true;
			}
		});
		// eslint-disable-next-line
		this.setState({
			hasImage,
		});
	}

	render() {
		const {
			children, href, small, target, ...props
		} = this.props;
		const { hasImage } = this.state;
		return (
			<ListItem
				href={href}
				image={hasImage}
				small={small}
				target={target}
				rel={target === '_blank' ? 'noopener noreferrer' : null}
				{...props}
			>
				{children}
			</ListItem>
		);
	}
}

ResultList.propTypes = {
	children: types.children,
	target: types.stringRequired,
	href: types.string,
	small: types.bool,
};

ResultList.defaultProps = {
	target: '_blank',
	small: false,
};

export default ResultList;
