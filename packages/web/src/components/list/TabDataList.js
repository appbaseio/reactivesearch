import { getComponent, hasCustomRenderer } from '@appbaseio/reactivecore/lib/utils/helper';
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
					const { data, value, handleChange } = params;
					if (hasCustomRenderer(props)) {
						return getComponent(props);
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
export default TabDataList;
