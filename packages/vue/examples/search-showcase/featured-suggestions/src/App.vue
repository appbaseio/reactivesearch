<template>
	<div id="app">
		<reactive-base
		app="movies-demo-app"
		url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
		>
			<search-box
				className="result-list-container"
				componentId="BookSensor"
				:dataField="['original_title', 'original_title.search']"
				:URLParams="true"
				:size="10"
				searchboxId="q_and_a_search_ui"
				:autosuggest="true"
				:enablePopularSuggestions="true"
				:popularSuggestionsConfig="{ size: 3, minChars: 2, index: 'good-books-ds', sectionLabel: '<b>Popular suggestions 🙌🏻</b>', }"
				:enableRecentSuggestions="true"
				:recentSuggestionsConfig="{
					size: 3,
					index: 'good-books-ds',
					minChars: 4,
					sectionLabel: '<b>Recent suggestions 🙌🏻</b>',
				}"
			/>
		</reactive-base>
	</div>
</template>

<script>
import './styles.css';
import { ReactiveBase, ReactiveList, SearchBox } from '@appbaseio/reactivesearch-vue';

export default {
	name: 'app',
	components: { ReactiveBase, ReactiveList, SearchBox },
};
</script>

<style>
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
}
</style>
