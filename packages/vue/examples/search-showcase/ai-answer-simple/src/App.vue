<template>
	<div id="app">
		<reactive-base
			app="good-books-ds"
			url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
			themePreset="light"
		>
			<search-box
				className="result-list-container"
				componentId="BookSensor"
				:dataField="['original_title', 'original_title.search']"
				:URLParams="true"
				:size="10"
				:enablePopularSuggestions="true"
				:popularSuggestionsConfig="{ size: 3, minChars: 2, index: 'good-books-ds' }"
				:enableRecentSuggestions="true"
				:recentSuggestionsConfig="{
					size: 3,
					index: 'good-books-ds',
					minChars: 4,
				}"
				:autosuggest="true"
			/>
			<div class="ai-answer-container">
				<a-i-answer
					className="ai-answer"
					componentId="AIComponent"
					:react="{ and: ['BookSensor'] }"
					title="AI Chat Box"
					:showInput="false"
				></a-i-answer>
			</div>
		</reactive-base>
	</div>
</template>

<script>
import './styles.css';
import { ReactiveBase, ReactiveList, SearchBox, AIAnswer } from '@appbaseio/reactivesearch-vue';

export default {
	name: 'app',
	components: { ReactiveBase, ReactiveList, SearchBox, AIAnswer },
	methods: {
		getMessageStyle(message) {
			const isSender = message.role === 'user';
			return {
				backgroundColor: isSender ? '#cce5ff' : '#f8f9fa',
				padding: '10px',
				borderRadius: '7px',
				marginBottom: '10px',
				maxWidth: '80%',
				alignSelf: isSender ? 'flex-end' : 'flex-start',
				display: 'inline-block',
				border: '1px solid',
				color: isSender ? '#004085' : '#383d41',
				position: 'relative',
				whiteSpace: 'pre-wrap',
			};
		},
	},
};
</script>

<style>
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
}
.ai-answer-container{
	display: block;
    margin: 40px;
}
</style>
