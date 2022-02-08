const prettier = require('prettier');

const isHtmlString = (received) => received && typeof received === 'string' && received[0] === '<';

const isVueWrapper = (received) =>
	received && typeof received === 'object' && typeof received.isVueInstance === 'function';

const getStyleElements = () => {
	const elements = [...document.querySelectorAll('style[data-emotion]')];
	return elements;
};

const getNodes = (node, nodes = []) => {
	if (node.children) {
		node.children.forEach((child) => getNodes(child, nodes));
	}
	if (node.data && node.data.class) {
		nodes.push(node);
	}
	return nodes;
};

const getClassNamesFromNodes = (nodes) => nodes.map((node) => node.data.class.split(' ')[0]);

const getPrettyStylesFromClassNames = (classNames, styleElements) => {
	const allStyles = [];
	styleElements.forEach((styleElement) => {
		const currentStyles = styleElement.innerHTML;
		classNames.forEach((className) => {
			const currentClassName = currentStyles.substring(1, className.length + 1);
			if (currentClassName === className) {
				const stylesEnd = currentStyles.indexOf('/*# sourceMappingURL');
				const hasBabelPlugin = stylesEnd !== -1;
				const styles = hasBabelPlugin
					? currentStyles.substring(0, stylesEnd)
					: currentStyles;
				allStyles.push(prettier.format(styles, { parser: 'css' }));
			}
		});
	});
	const prettyStyles = allStyles.join('\n');
	return prettyStyles;
};

const getPrettyHtmlFromNode = (node) => {
	const html = (isVueWrapper(node) ? node.html() : node) || '';
	const htmlWithRemovedServerRenderedText = html.replace(/ data-server-rendered="true"/, '');
	const prettyHtml = prettier
		.format(htmlWithRemovedServerRenderedText, {
			parser: 'html',
		})
		.replace(/\r?\n?[^\r\n]*$/, '');
	return prettyHtml;
};

const getSnapshot = (styles, html) => {
	if (styles.length === 0) return html;
	return `${styles}\n${html}`;
};

module.exports = {
	test(received) {
		return isHtmlString(received) || isVueWrapper(received);
	},
	print(received) {
		const prettyHtml = getPrettyHtmlFromNode(received);
		const rootNode = received.vnode;
		const nodes = getNodes(rootNode);
		const classNames = getClassNamesFromNodes(nodes);
		const styleElements = getStyleElements();
		const prettyStyles = getPrettyStylesFromClassNames(classNames, styleElements);
		const snapshot = getSnapshot(prettyStyles, prettyHtml);
		return snapshot;
	},
};
