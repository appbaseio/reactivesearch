import { WATCH_COMPONENT } from "../constants";

export default function componentsReducer(state = {}, action) {
	if (action.type === WATCH_COMPONENT) {
		state[action.component] = getWatchList(action.react);
	}
	return state;
}

function getWatchList(depTree) {
	const list = Object.values(depTree);
	const components = [];

	list.forEach(item => {
		if (typeof item === "string") {
			components.push(item);
		} else if (Array.isArray(item)) {
			components.push(...item);
		} else if (typeof item === "object" && item !== null) {
			components.push(...getWatchList(item));
		}
	});

	return [...new Set(components)];
}
