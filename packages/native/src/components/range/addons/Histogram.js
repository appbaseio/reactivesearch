import React from 'react';
import { View } from 'react-native';

import types from '@appbaseio/reactivecore/lib/utils/types';

const Histogram = (props) => {
	let max = props.stats[0].doc_count;
	props.stats.forEach((item) => {
		if (max < item.doc_count) {
			max = item.doc_count;
		}
	});

	const range = [];
	for (let i = props.range.start; i <= props.range.end; i += props.interval) {
		range.push(i);
	}

	return (
		<View
			style={{
				flex: 1,
				flexDirection: 'row',
				height: 50,
				alignItems: 'flex-end',
				paddingHorizontal: props.paddingHorizontal,
			}}
		>
			{range.map((item) => {
				const value = props.stats.find(stat => stat.key === item) || 0;

				return (
					<View
						key={item}
						style={{
							backgroundColor: '#efefef',
							width: `${100 / range.length}%`,
							height: `${(100 * value.doc_count) / max || 0}%`,
							...props.barStyle,
						}}
					/>
				);
			})}
		</View>
	);
};

Histogram.propTypes = {
	stats: types.stats,
	range: types.range,
	interval: types.number,
	paddingHorizontal: types.number,
	barStyle: types.style,
};

export default Histogram;
