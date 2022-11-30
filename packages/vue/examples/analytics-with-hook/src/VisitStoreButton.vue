<template>
	<button class="visit-store-btn" @click="handleVisitStore">Visit Store</button>
</template>
<script>
export default {
    name: 'VisitStoreButton',
    inject: {
		$analytics: {
			default: null
        }
	},
    methods: {
        handleVisitStore() {
            this.$analytics.conversion({
                queryID: this.$analytics.getQueryID(),
                objects: ['Harry Potter', 'Frankenstein'],
            })
		}
	}
}
</script>
<style>
.visit-store-btn{
    background: rgb(197, 144, 108);
    border: none;
    padding: 5px;
    color: white;
    margin: 5px 0px;
    cursor: pointer;
}
</style>
