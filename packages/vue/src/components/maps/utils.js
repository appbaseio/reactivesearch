export const infoWindowMappedProps = {
	content: {
		type: Object,
		twoWay: true,
	},
	options: {
		type: Object,
		required: false,
		default() {
			return {};
		},
	},
	position: {
		type: Object,
		twoWay: true,
	},
	zIndex: {
		type: Number,
		twoWay: true,
	},
};
/**
 * This function helps you to bind events from Google Maps API to Vue events
 *
 * @param  {Object} vueInst the Vue instance
 * @param  {Object} googleMapsInst the Google Maps instance
 * @param  {string[]} events an array of string with all events that you want to bind
 * @returns {void}
 */
export function bindEvents(vueInst, googleMapsInst, events) {
	events.forEach((eventName) => {
		if (vueInst.$gmapOptions.autoBindAllEvents || vueInst.$listeners[eventName]) {
			googleMapsInst.addListener(eventName, (ev) => {
				vueInst.$emit(eventName, ev);
			});
		}
	});
}

/**
 * Function that helps you to capitalize the first letter on a word
 *
 * @param  {string} text the text that you want to capitalize
 * @returns {string}
 */
export function capitalizeFirstLetter(text) {
	return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Function that helps you to get all non nullable props from a component
 *
 * @param  {Object} vueInst the Vue component instance
 * @param  {Object} props the props object
 * @returns {Object}
 */
export function getPropsValues(vueInst, props) {
	return Object.keys(props).reduce((acc, prop) => {
		if (vueInst[prop] !== undefined) {
			acc[prop] = vueInst[prop];
		}
		return acc;
	}, {});
}

/**
 * This function is a helper for return to the user the internal Google Maps promise
 * and can wait until it is ready.
 * This piece of code was orignally written by sindresorhus and can be seen here
 * @see https://github.com/sindresorhus/lazy-value/blob/master/index.js
 *
 *  @param  {Function} fn a function that actually return the promise or async value
 * @returns {Function} anonymous function that returns the value returned by the fn parameter
 */
export function getLazyValue(fn) {
	let called = false;
	let ret;

	return () => {
		if (!called) {
			called = true;
			ret = fn();
		}

		return ret;
	};
}

/**
 * Strips out the extraneous properties we have in our
 * mapped props definitions
 *
 * @param {Object} mappedProps the mapped props object
 * @returns {Object}
 */
export function mappedPropsToVueProps(mappedProps) {
	return Object.entries(mappedProps)
		.map(([key, prop]) => {
			const value = {};

			if ('type' in prop) value.type = prop.type;
			if ('default' in prop) value.default = prop.default;
			if ('required' in prop) value.required = prop.required;

			return [key, value];
		})
		.reduce((acc, [key, val]) => {
			acc[key] = val;
			return acc;
		}, {});
}

/**
 * This function simulates a down arrow key event when user
 * hits return (enter) on the autocomplete component selection
 * the first occurrence in the list.
 *
 * This piece of code was orignally written by amirnissim
 * and has been ported to Vanilla.js by GuillaumeLeclerc
 * @see http://stackoverflow.com/a/11703018/2694653
 *
 * @param  {Object} input the HTML input node element reference
 * @returns {void}
 */
export function downArrowSimulator(input) {
	// eslint-disable-next-line no-underscore-dangle -- Is old style should be analyzed
	const _addEventListener = input.addEventListener ? input.addEventListener : input.attachEvent;

	/**
	 * Add event listener wrapper that will replace to default addEventListener or attachEvent function
	 *
	 * @param  {string} type the event type
	 * @param  {Function} listener function should be executed when the event is fired
	 * @returns {void}
	 */
	function addEventListenerWrapper(type, listener) {
		// Simulate a 'down arrow' keypress on hitting 'return' when no pac suggestion is selected,
		// and then trigger the original listener.
		if (type === 'keydown') {
			const origListener = listener;
			// eslint-disable-next-line no-param-reassign -- Is old style this should be analyzed
			listener = (event) => {
				const suggestionSelected = document
					? document.getElementsByClassName('pac-item-selected').length > 0
					: null;
				if (event.which === 13 && !suggestionSelected) {
					const simulatedEvent = document.createEvent('Event');
					simulatedEvent.keyCode = 40;
					simulatedEvent.which = 40;
					origListener.apply(input, [simulatedEvent]);
				}
				origListener.apply(input, [event]);
			};
		}
		_addEventListener.apply(input, [type, listener]);
	}

	input.addEventListener = addEventListenerWrapper;
	input.attachEvent = addEventListenerWrapper;
}

/**
   * When you have two-way bindings, but the actual bound value will not equal
   * the value you initially passed in, then to avoid an infinite loop you
   * need to increment a counter every time you pass in a value, decrement the
   * same counter every time the bound value changed, but only bubble up
   * the event when the counter is zero.
   *
   * @param  {Function} fn Function to be executed to determine if the event was executed
   *
      Example:

      Let's say DrawingRecognitionCanvas is a deep-learning backed canvas
      that, when given the name of an object (e.g. 'dog'), draws a dog.
      But whenever the drawing on it changes, it also sends back its interpretation
      of the image by way of the @newObjectRecognized event.

      <input
        type="text"
        placeholder="an object, e.g. Dog, Cat, Frog"
        v-model="identifiedObject" />
      <DrawingRecognitionCanvas
        :object="identifiedObject"
        @newObjectRecognized="identifiedObject = $event"
        />

      new TwoWayBindingWrapper((increment, decrement, shouldUpdate) => {
        this.$watch('identifiedObject', () => {
          // new object passed in
          increment()
        })
        this.$deepLearningBackend.on('drawingChanged', () => {
          recognizeObject(this.$deepLearningBackend)
            .then((object) => {
              decrement()
              if (shouldUpdate()) {
                this.$emit('newObjectRecognized', object.name)
              }
            })
        })
      })
   */
export function twoWayBindingWrapper(fn) {
	let counter = 0;

	fn(
		() => {
			counter += 1;
		},
		() => {
			counter = Math.max(0, counter - 1);
		},
		() => counter === 0,
	);
}

/**
 * Watch the individual properties of a PoD object, instead of the object
 * per se. This is different from a deep watch where both the reference
 * and the individual values are watched.
 *
 * In effect, it throttles the multiple $watch to execute at most once per tick.
 *
 * @param  {Object} vueInst the component instance
 * @param  {string[]} propertiesToTrack string array with all properties that you want to track
 * @param  {Function} handler function to be fired when the prop change
 * @param  {boolean} immediate=false
 * @returns {void}
 */
export function watchPrimitiveProperties(vueInst, propertiesToTrack, handler, immediate = false) {
	let isHandled = false;

	/**
	 * Function in charge to execute the handler function if it was not fired
	 *
	 * @returns void
	 */
	function requestHandle() {
		if (!isHandled) {
			isHandled = true;
			vueInst.$nextTick(() => {
				isHandled = false;
				handler();
			});
		}
	}

	propertiesToTrack.forEach((prop) => {
		vueInst.$watch(prop, requestHandle, { immediate });
	});
}

/**
 * Binds the properties defined in props to the google maps instance.
 * If the prop is an Object type, and we wish to track the properties
 * of the object (e.g. the lat and lng of a LatLng), then we do a deep
 * watch. For deep watch, we also prevent the _changed event from being
 * emitted if the data source was external.
 *
 * @param  {Object} vueInst the component instance
 * @param  {Object} googleMapsInst the Google Maps instance
 * @param  {Object} props object with the component props tha should be synched with the Google Maps instances props
 * @returns {void}
 */
export function bindProps(vueInst, googleMapsInst, props) {
	Object.keys(props).forEach((attribute) => {
		const { twoWay, type, trackProperties, noBind } = props[attribute];

		if (!noBind) {
			const setMethodName = `set${capitalizeFirstLetter(attribute)}`;
			const getMethodName = `get${capitalizeFirstLetter(attribute)}`;
			const eventName = `${attribute.toLowerCase()}_changed`;
			const initialValue = vueInst[attribute];

			if (typeof googleMapsInst[setMethodName] === 'undefined') {
				throw new Error(
					// TODO: Analyze all disabled rules in the file
					// eslint-disable-next-line no-underscore-dangle -- old code should be analyzed
					`${setMethodName} is not a method of (the Maps object corresponding to) ${vueInst.$options._componentTag}`,
				);
			}

			// We need to avoid an endless
			// propChanged -> event emitted -> propChanged -> event emitted loop
			// although this may really be the user's responsibility
			if (type !== Object || !trackProperties) {
				// Track the object deeply
				vueInst.$watch(
					attribute,
					() => {
						const attributeValue = vueInst[attribute];

						googleMapsInst[setMethodName](attributeValue);
					},
					{
						immediate: typeof initialValue !== 'undefined',
						deep: type === Object,
					},
				);
			} else {
				watchPrimitiveProperties(
					vueInst,
					trackProperties.map((prop) => `${attribute}.${prop}`),
					() => {
						googleMapsInst[setMethodName](vueInst[attribute]);
					},
					vueInst[attribute] !== undefined,
				);
			}

			if (
				twoWay
				&& (vueInst.$gmapOptions.autoBindAllEvents || vueInst.$listeners[eventName])
			) {
				googleMapsInst.addListener(eventName, () => {
					vueInst.$emit(eventName, googleMapsInst[getMethodName]());
				});
			}
		}
	});
}

export default {
	bindEvents,
	bindProps,
	capitalizeFirstLetter,
	getPropsValues,
	getLazyValue,
	mappedPropsToVueProps,
	downArrowSimulator,
	twoWayBindingWrapper,
	watchPrimitiveProperties,
};
