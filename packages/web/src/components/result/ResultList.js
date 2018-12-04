import React, { Component } from 'react';

import { getClassName } from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';
import Title from '../../styles/Title';
import ListItem, { container, Image } from '../../styles/ListItem';
import ReactiveList from './ReactiveList';

class ResultList extends Component {
	static generateQueryOptions = props => ReactiveList.generateQueryOptions(props);

	renderAsListItem = (item, triggerClickAnalytics) => {
		const result = this.props.renderData(item);

		if (result) {
			return (
				<ListItem
					key={item._id}
					href={result.url}
					image={!!result.image}
					small={result.image_size === 'small'}
					className={getClassName(this.props.innerClass, 'listItem')}
					target={this.props.target}
					rel={this.props.target === '_blank' ? 'noopener noreferrer' : null}
					onClick={triggerClickAnalytics}
					{...result.containerProps}
				>
					{result.image ? (
						<Image
							src={result.image}
							small={result.image_size === 'small'}
							className={getClassName(this.props.innerClass, 'image')}
						/>
					) : null}
					<article>
						{typeof result.title === 'string' ? (
							<Title
								dangerouslySetInnerHTML={{
									__html: result.title,
								}}
								className={getClassName(this.props.innerClass, 'title')}
							/>
						) : (
							<Title className={getClassName(this.props.innerClass, 'title')}>
								{result.title}
							</Title>
						)}
						{typeof result.description === 'string' ? (
							<div
								dangerouslySetInnerHTML={{
									__html: result.description,
								}}
							/>
						) : (
							<div>{result.description}</div>
						)}
					</article>
				</ListItem>
			);
		}

		return null;
	};

	render() {
		const { renderData, ...props } = this.props;

		return <ReactiveList {...props} renderData={this.renderAsListItem} listClass={container} />;
	}
}

ResultList.propTypes = {
	innerClass: types.style,
	target: types.stringRequired,
	renderData: types.func,
};

ResultList.defaultProps = {
	target: '_blank',
};

export default ResultList;
