import { getComponent, hasCustomRenderer } from '@appbaseio/reactivecore/lib/utils/helper';
import types from '@appbaseio/reactivecore/lib/utils/types';
import { bool } from 'prop-types';
import React, { Component } from 'react';
import Container from '../../styles/Container';
import { TabLink, TabContainer } from '../../styles/Tabs';

import SingleDataList from './SingleDataList';


// eslint-disable-next-line react/prefer-stateless-function
class TabDataList extends Component {
	render() {
		const { props } = this;
		return (
			<SingleDataList
				{...props}
				render={(params) => {
					const {
						data, value, handleChange, rawData,
					} = params;
					if (hasCustomRenderer(props)) {
						return getComponent(props);
					}
					if (props.showCount) {
						// eslint-disable-next-line no-shadow
						const data = rawData && rawData.aggregations[props.dataField];
						const buckets = data && data.buckets;
						return (
							<Container>
								<TabContainer vertical={props.displayAsVertical}>
									{buckets && buckets.map(item => (
										<TabLink
											onClick={() => handleChange(item.key)}
											selected={item.key === value}
											key={item.key}
											vertical={props.displayAsVertical}
										>{item.key}({item.doc_count})
										</TabLink>
									))}
								</TabContainer>
							</Container>
						);
					}
					return (
						<Container>
							<TabContainer vertical={props.displayAsVertical}>
								{data.map(item => (
									<TabLink
										onClick={() => handleChange(item.value)}
										selected={item.value === value}
										vertical={props.displayAsVertical}
										key={item.value}
									>
										{item.label}
									</TabLink>
								))}
							</TabContainer>
						</Container>
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
	selectAllLabel: types.string,
	showSearch: types.bool,
	title: types.title,
	URLParams: types.bool,
	showCount: types.bool,
	render: types.func,
	renderNoResults: types.func,
	index: types.string,
};
export default TabDataList;
