import { scrollIntoView } from './utils';

export default {
	// eslint-disable-next-line
	props: [
		'isOpen',
		'inputValue',
		'selectedItem',
		'highlightedIndex',
		'handleChange',
		'itemToString',
		'handleMouseup'
	],
	data: () => ({
		isMouseDown: false,
		internal_isOpen: false,
		internal_inputValue: '',
		internal_selectedItem: null,
		internal_highlightedIndex: null
	}),
	computed: {
		mergedState() {
			return Object.keys(this.$props).reduce(
				(state, key) => ({
					...state,
					[key]: this.isControlledProp(key)
						? this.$props[key]
						: this[`internal_${key}`]
				}),
				{}
			);
		},

		internalItemCount() {
			return this.items.length;
		}
	},

	mounted() {
		window.addEventListener('mousedown', this.handleWindowMousedown);
		window.addEventListener('mouseup', this.handleWindowMouseup);
	},

	beforeDestroy() {
		window.removeEventListener('mousedown', this.handleWindowMousedown);
		window.removeEventListener('mouseup', this.handleWindowMouseup);
	},

	methods: {
		handleWindowMousedown() {
			this.isMouseDown = true;
		},

		handleWindowMouseup(event) {
			this.isMouseDown = false;

			if (
				(event.target === this.$refs.rootNode
					|| !this.$refs.rootNode.contains(event.target))
				&& this.mergedState.isOpen
			) {
				// TODO: handle on outer click here
				if (!this.isMouseDown) {
					this.reset();
					if (this.$props.handleMouseup) {
						this.$props.handleMouseup({
							isOpen: false
						});
					}
				}
			}
		},

		keyDownArrowDown(event) {
			event.preventDefault();
			const amount = event.shiftKey ? 5 : 1;

			if (this.mergedState.isOpen) {
				this.changeHighlightedIndex(amount);
			} else {
				this.setState({
					isOpen: true
				});

				this.setHighlightedIndex();
			}
		},

		keyDownArrowUp(event) {
			event.preventDefault();
			const amount = event.shiftKey ? -5 : -1;

			if (this.mergedState.isOpen) {
				this.changeHighlightedIndex(amount);
			} else {
				this.setState({
					isOpen: true
				});

				this.setHighlightedIndex();
			}
		},

		keyDownEnter(event) {
			if (this.mergedState.isOpen) {
				event.preventDefault();
				this.selectHighlightedItem();
			}
		},

		keyDownEscape(event) {
			event.preventDefault();
			this.reset();
		},

		selectHighlightedItem() {
			return this.selectItemAtIndex(this.mergedState.highlightedIndex);
		},

		selectItemAtIndex(itemIndex) {
			const item = this.items[itemIndex];

			if (item == null) {
				return;
			}

			this.selectItem(item);
		},

		selectItem(item) {
			if (this.$props.handleChange) {
				this.$props.handleChange(item);
			}
			this.setState({
				isOpen: false,
				highlightedIndex: null,
				selectedItem: item,
				inputValue: this.isControlledProp('selectedItem') ? '' : item
			});
		},

		changeHighlightedIndex(moveAmount) {
			if (this.internalItemCount < 0) {
				return;
			}

			const { highlightedIndex } = this.mergedState;

			let baseIndex = highlightedIndex;

			if (baseIndex === null) {
				baseIndex = moveAmount > 0 ? -1 : this.internalItemCount + 1;
			}

			let newIndex = baseIndex + moveAmount;

			if (newIndex < 0) {
				newIndex = this.internalItemCount;
			} else if (newIndex > this.internalItemCount) {
				newIndex = 0;
			}

			this.setHighlightedIndex(newIndex);
		},

		setHighlightedIndex(highlightedIndex = null) {
			this.setState({
				highlightedIndex
			});
			const element = document.getElementById(`Downshift${highlightedIndex}`);
			scrollIntoView(element, this.rootNode);
			// Implement scrollIntroView thingy
		},

		reset() {
			const { selectedItem } = this.mergedState;

			this.setState({
				isOpen: false,
				highlightedIndex: null,
				inputValue: selectedItem
			});
		},

		getItemProps({ index, item }) {
			let newIndex = index;
			if (index === undefined) {
				if (this.$props.itemToString) {
					this.items.push(this.$props.itemToString(item));
				} else {
					this.items.push(item);
				}
				newIndex = this.items.indexOf(item);
			} else {
				this.items[newIndex] = item;
			}

			return {
				id: `Downshift${newIndex}`
			};
		},

		getItemEvents({ index, item }) {
			let newIndex = index;
			if (index === undefined) {
				newIndex = this.items.indexOf(item);
			}

			const vm = this;

			return {
				mouseenter() {
					vm.setHighlightedIndex(newIndex);
				},

				click(event) {
					event.stopPropagation();
					vm.selectItemAtIndex(newIndex);
				}
			};
		},

		getInputProps({ value }) {
			const { inputValue } = this.mergedState;
			if (value !== inputValue) {
				this.setState({
					inputValue: value
				});
			}
			return {
				value: inputValue
			};
		},

		getButtonProps({ onClick, onKeyDown, onKeyUp, onBlur }) {
			return {
				click: event => {
					this.setState({
						isOpen: true,
						inputValue: event.target.value
					});
					if (onClick) {
						onClick(event);
					}
				},
				keydown: event => {
					if (event.key && this[`keyDown${event.key}`]) {
						this[`keyDown${event.key}`].call(this, event);
					}
					if (onKeyDown) {
						onKeyDown(event);
					}
				},
				keyup: event => {
					if (onKeyUp) {
						onKeyUp(event);
					}
				},
				blur: event => {
					if (onBlur) {
						onBlur(event);
					}
				}
			};
		},

		getInputEvents({
			onInput,
			onBlur,
			onFocus,
			onKeyPress,
			onKeyDown,
			onKeyUp
		}) {
			return {
				input: event => {
					this.setState({
						isOpen: true,
						inputValue: event.target.value
					});
					if (onInput) {
						onInput(event);
					}
				},
				focus: event => {
					if (onFocus) {
						onFocus(event);
					}
				},
				keydown: event => {
					if (event.key && this[`keyDown${event.key}`]) {
						this[`keyDown${event.key}`].call(this, event);
					}
					if (onKeyDown) {
						onKeyDown(event);
					}
				},
				keypress: event => {
					if (onKeyPress) {
						onKeyPress(event);
					}
				},
				keyup: event => {
					if (onKeyUp) {
						onKeyUp(event);
					}
				},
				blur: event => {
					if (onBlur) {
						onBlur(event);
					}
					// TODO: implement isMouseDown
					// this.reset()
				}
			};
		},

		getHelpersAndState() {
			const {
				getItemProps,
				getItemEvents,

				getInputProps,
				getInputEvents,

				getButtonProps
			} = this;

			return {
				getItemProps,
				getItemEvents,

				getInputProps,
				getInputEvents,

				getButtonProps,

				...this.mergedState
			};
		},

		isControlledProp(prop) {
			return this.$props[prop] !== undefined;
		},

		setState(stateToSet) {
			// eslint-disable-next-line
			Object.keys(stateToSet).map(key => {
				// eslint-disable-next-line
				this.isControlledProp(key)
					? this.$emit(`${key}Change`, stateToSet[key])
					: (this[`internal_${key}`] = stateToSet[key]);
			});

			this.$emit('stateChange', this.mergedState);
		}
	},

	render() {
		this.items = [];

		return (
			<div ref="rootNode">
				{this.$scopedSlots.default
					&& this.$scopedSlots.default({
						...this.getHelpersAndState()
					})}
			</div>
		);
	}
};
