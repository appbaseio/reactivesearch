import { hasCustomRenderer } from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { bool } from 'prop-types';
import React from 'react';
import { TabLink, TabContainer } from '../../styles/Tabs';

import SingleDataList from './SingleDataList';

const TabDataList = (props) => {
	const { renderItem } = props;
	const defaultItem = item => `${item.label} ${props.showCount && item.count ? `(${item.count})` : ''}`;

	if (hasCustomRenderer(props)) {
		return <SingleDataList {...props} showSearch={false} />;
	}
	return (
		<SingleDataList
			{...props}
			showSearch={false}
			render={(params) => {
				const {
					data, value, handleChange,
				} = params;

				return (
					<TabContainer vertical={props.displayAsVertical}>
						{data.map(item => (
							<TabLink
								onClick={() => handleChange(item.value)}
								selected={item.value === value}
								vertical={props.displayAsVertical}
								key={item.value}
							>
								{renderItem
									? (renderItem(item.label, item.count, item.value === value))
									: defaultItem(item)}
							</TabLink>
						))}
					</TabContainer>
				);
			}

			}
		/>
	);
};

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
