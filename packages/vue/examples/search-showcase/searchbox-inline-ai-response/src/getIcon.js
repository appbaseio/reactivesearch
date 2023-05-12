import reactIcon from './react.svg';
import vueIcon from './vue.svg';
import flutterIcon from './flutter.svg';
import blockIcon from './block.svg';

// eslint-disable-next-line import/prefer-default-export
export function getIcon(keywords = []) {
	if (keywords.includes('vue')) {
		return vueIcon;
	} if (keywords.includes('flutter')) {
		return flutterIcon;
	} if (keywords.includes('react')) {
		return reactIcon;
	}
	return blockIcon;
}
