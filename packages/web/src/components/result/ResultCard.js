import React, { Component } from 'react';

import { getClassName } from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';
import ReactiveList from './ReactiveList';
import Title from '../../styles/Title';
import Card, { container, Image } from '../../styles/Card';

class ResultCard extends Component {
	static generateQueryOptions = props => ReactiveList.generateQueryOptions(props);

	renderAsCard = (item) => {
		const result = this.props.onData(item);

		if (result) {
			return (
				<Card
					key={item._id}
					href={result.url}
					className={getClassName(this.props.innerClass, 'listItem')}
					target={this.props.target}
					rel={this.props.target === '_blank' ? 'noopener noreferrer' : null}
				>
					<Image
						style={{ backgroundImage: `url(${result.image})` }}
						className={getClassName(this.props.innerClass, 'image')}
					/>
					{
						typeof result.title === 'string'
							? <Title
								dangerouslySetInnerHTML={{ __html: result.title }}
								className={getClassName(this.props.innerClass, 'title')}
							/>
							: (
								<Title className={getClassName(this.props.innerClass, 'title')}>
									{result.title}
								</Title>
							)
					}
					{
						typeof result.description === 'string'
							? <article dangerouslySetInnerHTML={{ __html: result.description }} />
							: <article>{result.description}</article>
					}
				</Card>
			);
		}

		return null;
	};

	render() {
		const { onData, ...props } = this.props;

		return (
			<ReactiveList
				{...props}
				onData={this.renderAsCard}
				listClass={container}
			/>
		);
	}
}

ResultCard.propTypes = {
	innerClass: types.style,
	target: types.stringRequired,
	onData: types.func,
};

ResultCard.defaultProps = {
	target: '_blank',
};

export default ResultCard;
