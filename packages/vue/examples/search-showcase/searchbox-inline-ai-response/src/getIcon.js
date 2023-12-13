export function getIcon(keywords = []) {
	if (keywords.includes('vue')) {
		return '/vue.svg';
	}
	if (keywords.includes('flutter')) {
		return '/flutter.svg';
	}
	if (keywords.includes('react')) {
		return '/react.svg';
	}
	return '/block.svg';
}
