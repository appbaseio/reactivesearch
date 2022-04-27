/* global google */
function reduce(obj, fn, acc) {
	return Object.keys(obj).reduce((newAcc, key) => fn(newAcc, obj[key], key), acc);
}

function forEach(obj, fn) {
	Object.keys(obj).forEach(key => fn(obj[key], key));
}
export function applyUpdaterToNextProps(updaterMap, prevProps, nextProps, instance) {
	const map: any = {};

	const iter = (fn: any, key: string): void => {
		const nextValue = nextProps[key];

		if (nextValue !== prevProps[key]) {
			map[key] = nextValue;
			fn(instance, nextValue);
		}
	};

	forEach(updaterMap, iter);

	return map;
}

export function registerEvents(props, instance, eventMap) {
	const registeredList = reduce(
		eventMap,
		(acc, googleEventName, onEventName) => {
			if (typeof props[onEventName] === 'function') {
				acc.push(
					google.maps.event.addListener(instance, googleEventName, props[onEventName]),
				);
			}

			return acc;
		},
		[],
	);

	return registeredList;
}

function unregisterEvent(registered: google.maps.MapsEventListener): void {
	google.maps.event.removeListener(registered);
}

export function unregisterEvents(events: google.maps.MapsEventListener[] = []): void {
	events.forEach(unregisterEvent);
}

export function applyUpdatersToPropsAndRegisterEvents({
	updaterMap,
	eventMap,
	prevProps,
	nextProps,
	instance,
}) {
	const registeredEvents = registerEvents(nextProps, instance, eventMap);

	applyUpdaterToNextProps(updaterMap, prevProps, nextProps, instance);

	return registeredEvents;
}
