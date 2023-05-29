<template>
	<div id="app">
		<reactive-base
			app="good-books-ds"
			url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
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
				:value="val"
				@change="onChange"
			>
				<template
					#render="{
						error,
						loading,
						downshiftProps: { isOpen, highlightedIndex, getItemProps, getItemEvents },
						data: suggestions,
					}"
				>
					<div class="pill-wrapper" v-if="isOpen && !!val">
						<button
								class="pill-btn"
								v-for="(suggestion, idx) in suggestions"
								:key="suggestion._id"
								v-bind="getItemProps({
									item: suggestion,
									index: idx
								})"
								v-on="getItemEvents({
									item: suggestion,
									index: Number(idx)
								})"
						>
								{{ suggestion.label }}
							</button>
					</div>
				</template>
			</search-box>
			<reactive-list
				componentId="SearchResult"
				dataField="original_title.keyword"
				className="result-list-container"
				:pagination="true"
				:size="5"
				:react="{ and: ['BookSensor'] }"
			>
				<template #renderItem="{ item }">
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
				</template>
			</reactive-list>
		</reactive-base>
	</div>
</template>

<script>
import './styles.css';
import { ReactiveBase, ReactiveList, SearchBox } from '@appbaseio/reactivesearch-vue';

export default {
	name: 'app',
	components: { ReactiveBase, ReactiveList, SearchBox },
	data(){
		return {
			val: ''
		}
	},
	methods:{
		// eslint-disable-next-line no-console
		log: console.log,
		onChange (val){
			this.val = val;
		}
	}
};
</script>

<style>
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
}

.pill-wrapper {
	width: 100%;
	display: flex;
	gap: 10px;
	overflow: auto;
	margin-top: 10px;
}
.pill-wrapper::-webkit-scrollbar {
	height: 0px;
}

.pill-wrapper:hover::-webkit-scrollbar {
	height: 2px;
}

.pill-wrapper::-webkit-scrollbar-track {
	box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.3);
}

.pill-wrapper::-webkit-scrollbar-thumb {
	background-color: darkgrey;
	outline: 1px solid slategrey;
}

.pill-btn {
	background-color: #ddd;
	border: none;
	color: black;
	padding: 10px 20px;
	text-align: center;
	text-decoration: none;
	display: inline-block;
	margin: 4px 2px;
	cursor: pointer;
	border-radius: 16px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	flex: 0 0 fit-content;
	max-width: 250px;
}

.pill-btn:hover {
	filter: brightness(0.8);
}
</style>
