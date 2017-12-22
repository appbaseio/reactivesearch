import React from "react";
import types from "@appbaseio/reactivecore/lib/utils/types";

import Histogram, { histogramContainer } from "../../../styles/Histogram";

const getWidth = (index, range, item, props) => {
	let diff;
	if (index < range.length - 1) {
		diff = range[index + 1].key - item.key;
	} else {
		diff = props.range.end - item.key;
	}
	const fullRange = props.range.end - props.range.start;
	return `${(diff / fullRange) * 100}%`;
};

const HistogramContainer = (props) => {
	let max = props.stats[0].doc_count;
	props.stats.forEach((item) => {
		if (max < item.doc_count) {
			max = item.doc_count;
		}
	});

	let range = [...props.stats];
	if (props.stats.length) {
		if (range[0].key > props.range.start) {
			range = [{ key: props.range.start, doc_count: 0 }, ...range];
		}
		const lastElement = range[range.length - 1];
		if (lastElement.key + props.interval < props.range.end) {
			range = [...range, { key: props.interval + lastElement.key, doc_count: 0 }];
		}
	}

	return (
		<div className={histogramContainer}>
			{
				range.map((item, index) => (
					<Histogram
						key={item.key}
						width={getWidth(index, range, item, props)}
						height={`${(100 * item.doc_count) / max || 0}%`}
						title={item.doc_count}
					/>
				))
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
