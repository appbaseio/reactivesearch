import { WATCH_COMPONENT, REMOVE_COMPONENT } from "../constants";

export default function watchManReducer(state = {}, action) {
	if (action.type === WATCH_COMPONENT) {
		return { ...state, [action.component]: getWatchList(action.react) };
	} else if (action.type === REMOVE_COMPONENT) {
		const { [action.component]: del, ...obj } = state;
		return obj;
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
