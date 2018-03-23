import React, { Component } from 'react';

import { getClassName } from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';
import Title from '../../styles/Title';
import ListItem, { container, Image } from '../../styles/ListItem';
import ReactiveList from './ReactiveList';

class ResultList extends Component {
	render() {
		return <ReactiveList {...this.props} onData={this.renderAsListItem} listClass={container} />;
	}

	renderAsListItem = (item) => {
		const result = this.props.onData(item);

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
				>
					{
						result.image
							? <Image
								src={result.image}
								small={result.image_size === 'small'}
								className={getClassName(this.props.innerClass, 'image')}
							/>
							: null
					}
					<article>
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
								? <div dangerouslySetInnerHTML={{ __html: result.description }} />
								: <div>{result.description}</div>
						}
					</article>
				</ListItem>
			);
		}

		return null;
	};
}

ResultList.propTypes = {
	innerClass: types.style,
	target: types.stringRequired,
	onData: types.func,
};

ResultList.defaultProps = {
	target: '_blank',
};

export default ResultList;

