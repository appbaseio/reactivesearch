import { computed, defineComponent, createCommentVNode, ref, onMounted, h } from 'vue';

// client only component
// render the placeholder slot on SSR
// you can manually control exactly when to show the component by the isShow prop
export default defineComponent({
	props: {
		isShow: {
			type: Boolean,
			default: undefined,
		},
	},
	setup(props, { slots }) {
		const isMounted = ref(false);
		const isShowDefaultSlot = computed(() => {
			if (props.isShow === undefined) return isMounted.value;
			return !!props.isShow && isMounted.value;
		});

		onMounted(() => {
			isMounted.value = true;
		});

		const defaultVnode = slots.default
			? h(() => slots.default && slots.default())
			: createCommentVNode('Client only rendering with empty default slot');
		const placeholderVNode = slots.placeholder
			? h(() => slots.placeholder && slots.placeholder())
			: createCommentVNode('Client only rendering component placeholder');

		return () => (isShowDefaultSlot.value ? defaultVnode : placeholderVNode);
	},
});
