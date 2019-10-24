export const deprecatePropWarning = (propName, replaceWith) => {
	console.warn(`${propName} prop will be deprecated in the next release. Please replace it with ${replaceWith} before upgrading to the next major version.`);
}
