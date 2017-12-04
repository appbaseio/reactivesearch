import React from "react";
import types from "@appbaseio/reactivecore/lib/utils/types";

import Histogram, { histogramContainer } from "../../../styles/Histogram";

const HistogramContainer = (props) => {
	let max = props.stats[0].doc_count;
	props.stats.forEach(item => {
		if (max < item.doc_count) {
			max = item.doc_count;
		}
	});

	const range = [];
	for (let i = props.range.start; i <= props.range.end; i += props.interval) {
		range.push(i);
	}

	return (
		<div className={histogramContainer}>
			{
				range.map((item, index) => {
					const value = props.stats.find(stat => stat.key === item) || 0;

					return (
						<Histogram
							key={item}
							width={
								index === 0 || (index === range.length - 1) ?
									`${100 / (2 * (range.length - 1))}%` :
									`${100 / (range.length - 1)}%`
							}
							height={`${(100 * value.doc_count) / max || 0}%`}
							title={value.doc_count}
						/>
					);
				})
			}
		</div>
	);
}

HistogramContainer.propTypes = {
	stats: types.stats,
	range: types.range,
	interval: types.number
}

export default HistogramContainer;
