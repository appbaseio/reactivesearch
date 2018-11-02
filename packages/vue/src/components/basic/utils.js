import computeScrollIntoView from 'compute-scroll-into-view';
/**
 * Scroll node into view if necessary
 * @param {HTMLElement} node the element that should scroll into view
 * @param {HTMLElement} rootNode the root element of the component
 */
// eslint-disable-next-line
export const scrollIntoView = (node, rootNode) => {
	if (node === null) {
		return;
	}

	const actions = computeScrollIntoView(node, {
		boundary: rootNode,
		block: 'nearest',
		scrollMode: 'if-needed'
	});
	actions.forEach(({ el, top, left }) => {
		el.scrollTop = top;
		el.scrollLeft = left;
	});
};
