import React, { Component } from 'react';
import Container from '../../styles/Container';
import { TabLink } from '../../styles/Tabs';

import SingleDataList from './SingleDataList';


// eslint-disable-next-line react/prefer-stateless-function
class TabDataList extends Component {
	render() {
		const { props } = this;
		return (
			<SingleDataList
				{...props}
				render={(params) => {
					const { data } = params;
					if (typeof (props.render) === 'function') {
						return props.render(params);
					}
					return (
						<Container>
							{data.map(item => (
								<TabLink href={`#${item.label}`}>{item.label}</TabLink>
							))}
						</Container>
					);
				}

				}
			/>
		);
	}
}
export default TabDataList;
