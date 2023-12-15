

<template>
  <SearchBox
    component-id="SearchBox"
    data-field="original_title"
    title="great people"
    class-name="grow"
    :debounce="200"
    :inner-class="{ 'selected-tag': 'mt-0' }"
  />

</template>

<script>
import { SearchBox } from '@appbaseio/reactivesearch-vue';

export default {
	name: 'SearchBoxComponent',
	components: { SearchBox },
};
</script>

<style>

</style>
