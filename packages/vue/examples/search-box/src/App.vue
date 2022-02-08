<template>
	<div id="app">
		<ReactiveBase
			app="good-books-ds"
			url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
			:enable-appbase="true"
		>
			<SearchBox
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
				@on-data="
					(param) => {
						// do something
					}
				"
				:showClear="true"
				@valueSelected="
					(value, cause) => {
						// do something
					}
				"
				categoryField="authors.keyword"
				:defaultQuery="
					(value) => {
						return {
							query: {
								match: {
									original_title: value || 'harry potter',
								},
							},
							timeout: '1s',
						};
					}
				"
				:applyStopwords="true"
				:customStopwords="['be', 'the']"
				:enablePredictiveSuggestions="true"
				:value="value"
				@change="handleChange"
				:autosuggest="false"
			>
				<!-- <div class="suggestions" slot="renderItem" slot-scope="item">
					👋 &nbsp; {{ item.label }}
				</div> -->

				<!-- <div
					class="suggestions"
					slot="render"
					slot-scope="{
						error,
						loading,
						downshiftProps: { isOpen, highlightedIndex, getItemProps, getItemEvents },
						data: suggestions,
					}"
				>
					<div v-if="loading">loading...</div>
					<ul v-if="isOpen">
						<template v-for="suggestion in suggestions">
							<li
								style="{ background-color: highlightedIndex ? 'grey' : 'transparent' }"
								v-bind="getItemProps({ item: suggestion })"
								v-on="getItemEvents({ item: suggestion })"
								:key="suggestion._id"
							>
								{{ suggestion.label }}
							</li>
						</template>
					</ul>
				</div> -->
			</SearchBox>
			<ReactiveList
				componentId="SearchResult"
				dataField="original_title.keyword"
				className="result-list-container"
				:pagination="true"
				:size="5"
				:react="{ and: ['BookSensor'] }"
			>
				<div slot="renderItem" slot-scope="{ item }">
					<div :id="item._id" class="flex book-content" :key="item._id">
						<img :src="item.image" alt="Book Cover" class="book-image" />
						<div class="flex column justify-center ml20">
							<div class="book-header">{{ item.original_title }}</div>
							<div class="flex column justify-space-between">
								<div>
									<div>
										by <span class="authors-list">{{ item.authors }}</span>
									</div>
									<div class="ratings-list flex align-center">
										<span class="stars">
											<i
												v-for="(item, index) in Array(
													item.average_rating_rounded,
												).fill('x')"
												class="fas fa-star"
												:key="index"
											/>
										</span>
										<span class="avg-rating"
											>({{ item.average_rating }} avg)</span
										>
									</div>
								</div>
								<span class="pub-year"
									>Pub {{ item.original_publication_year }}</span
								>
							</div>
						</div>
					</div>
				</div>
			</ReactiveList>
		</ReactiveBase>
	</div>
</template>

<script>
import './styles.css';
export default {
	name: 'app',
	data() {
		return {
			value: '',
		};
	},
	methods: {
		handleChange(value, triggerQuery) {
			this.value = value;
			// Trigger the search query to update the dependent components
			triggerQuery({
				isOpen: false, // To close the suggestions dropdown; optional
			});
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
</style>
