<template>
	<button @click="handleSave">Save Search</button>
</template>
<script>
export default {
	name: 'SaveSearchButton',
    inject: {
		$analytics: {
			default: null
        }
	},
    methods: {
        handleSave() {
            this.$analytics.saveSearch({
                queryID: this.$analytics.getQueryID(),
            })
		}
	}
}
</script>
