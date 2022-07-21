import { getComponent, hasCustomRenderer } from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { bool } from 'prop-types';
import React, { Component } from 'react';
import { TabLink, TabContainer } from '../../styles/Tabs';

import SingleDataList from './SingleDataList';


// eslint-disable-next-line react/prefer-stateless-function
class TabDataList extends Component {
	render() {
		const { props } = this;
		const { renderItem } = props;
		const defaultItem = item => `${item.label} ${props.showCount && item.count ? `(${item.count})` : ''}`;
		return (
			<SingleDataList
				{...props}
				showSearch={false}
				render={(params) => {
					const {
						data, value, handleChange,
					} = params;
					if (hasCustomRenderer(props)) {
						return getComponent(props);
					}
					return (
						<TabContainer vertical={props.displayAsVertical}>
							{data.map(item => (
								<TabLink
									onClick={() => handleChange(item.value)}
									selected={item.value === value}
									vertical={props.displayAsVertical}
									key={item.value}
								>
									{renderItem ? (renderItem(item)) : defaultItem(item)}
								</TabLink>
							))}
						</TabContainer>
					);
				}

				}
			/>
		);
	}
}

TabDataList.defaultProps = {
	displayAsVertical: false,
};

TabDataList.propTypes = {
	displayAsVertical: bool,
	children: types.func,
	componentId: types.stringRequired,
	dataField: types.stringRequired,
	onChange: types.func,
	react: types.react,
	title: types.title,
	URLParams: types.bool,
	showCount: types.bool,
	render: types.func,
	renderItem: types.func,
	renderNoResults: types.func,
	index: types.string,
};
export default TabDataList;
