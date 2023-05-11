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
				:enableAI="true"
			>
				<template
					#render="{
							downshiftProps: {
									isOpen,
									getItemProps,
									highlightedIndex,
									selectedItem,
								},
							AIData: { answer: aiAnswer, showAIScreen },
							data
					}"
				>
						<div v-if="isOpen">
							<div v-if="showAIScreen" class="suggestions">
								<div
									:style="{
										alignSelf: 'flex-start',
										margin: 8,
										maxWidth: '70%',
									}"
									>
									<div
										:style="{
										display: 'inline-block',
										maxWidth: '100%',
										backgroundColor: '#f1f1f1',
										color: 'black',
										borderRadius: '16px',
										padding: '8px 16px',
										whiteSpace: 'pre-wrap',
										wordWrap: 'break-word',
										}"
									>
										{{aiAnswer || "Loading..."}}
									</div>
								</div>
							</div>
							<div v-else>
								No suggestions
							</div>
						</div>
				</template>
			</search-box>
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
.spinner {
  position: absolute;
  height: 80vh;
  width: 100vw;
  left: 0px;
  display: flex;
  justify-content: center;
  padding-top: 50px;
  z-index: 1;
  background-color: white;
}
.headingTag {
  background: linear-gradient(
    30deg,
    rgb(59, 130, 246) 0%,
    rgb(59, 130, 246) 0%,
    rgb(255, 42, 111) 100%
  );
  margin-right: auto;
  border-radius: var(--bs-border-radius);
  padding: 5px 10px;
}
.suggestions {
  position: absolute;
  z-index: 2;
  box-shadow: #9597a1 0px 8px 24px;
  background: white;
  width: 100%;
  border-radius: 0px 0px 10px 10px;
  max-height: 500px;
  overflow: auto;
  font-size: 0.9rem;
}
.suggestionHeading {
  font-size: 0.8rem;
  font-weight: bold;
}
.suggestion {
  background-color: white;
  color: var(--bs-black);
  font-weight: normal;
  padding: 10px 15px;
  width: 100%;
  height: 100%;
  display: block;
  text-decoration: none;
  position: relative;
}
.activeSuggestion,
.activeSuggestion:hover {
  background-color: var(--bs-primary);
  color: white;
  padding: 10px 15px;
  width: 100%;
  height: 100%;
  display: block;
  text-decoration: none;
  position: relative;
}
.suggestionTitle {
  text-transform: uppercase;
  font-weight: bold;
  width: 50%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.suggestionBreadcrumb {
  padding: 0.25rem;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  position: absolute;
  top: 2px;
  max-width: 30%;
  right: 10px;
  background-color: #eee;
  color: #6c757d;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: var(--bs-border-radius);
}
.suggestionDescription {
  margin-top: 0.25rem;
  width: 100%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
@media (max-width: 500px) {
  .suggestionDescription {
    -webkit-line-clamp: 3;
  }
  .suggestionBreadcrumb {
    position: relative;
    top: 0;
    right: 0;
    font-size: 0.7rem;
    display: block;
    max-width: 100%;
  }
  .suggestionTitle {
    width: 100%;
  }
}
.suggestionIcon {
  max-width: 3rem;
  margin: auto;
}
.selectedSuggestion {
  font-weight: bold;
}
</style>
