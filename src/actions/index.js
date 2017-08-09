import {
	ADD_COMPONENT,
	REMOVE_COMPONENT
} from "../constants";

export function addComponent(component) {
	return {
		type: ADD_COMPONENT,
		component
	};
}

export function removeComponent(component) {
	return {
		type: REMOVE_COMPONENT,
		component
	};
}
