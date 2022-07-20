import { getComponent, hasCustomRenderer } from '@appbaseio/reactivecore/lib/utils/helper';
import { bool, string } from 'prop-types';
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
										>{item.key}({item.doc_count})
										</TabLink>
									))}
								</TabContainer>
							</Container>
						);
					}
					return (
						<Container>
							<TabContainer>
								{data.map(item => (
									<TabLink
										onClick={() => handleChange(item.value)}
										selected={item.value === value}
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

TabDataList.propTypes = {
	showCount: bool,
	dataField: string,
	displayAsVertical: bool,
};
export default TabDataList;
