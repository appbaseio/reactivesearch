<script setup>
import { getServerState } from '@appbaseio/reactivesearch-vue';
import Search from '../components/search.vue';

// eslint-disable-next-line no-undef
const route = useRoute();
// eslint-disable-next-line no-unused-vars,no-undef
const { data, pending, error, refresh } = await useAsyncData(() =>
	getServerState(Search, route.query),
);
// eslint-disable-next-line no-unused-vars
const initialState = data.value;
</script>

<template>
  <div>
    <search :initial-state="initialState" />
  </div>
</template>
