<template>
	<div id="app">
		<link
			rel="stylesheet"
			href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.1/css/all.min.css"
			integrity="sha512-gMjQeDaELJ0ryCI+FtItusU9MkAifCZcGq789FrzkiM49D8lbDhoaUaIX4ASU187wofMNlgBJ4ckbrXM9sE6Pg=="
			crossorigin="anonymous"
			referrerpolicy="no-referrer"
		>
		<reactive-base
			app="good-books-ds"
			url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
		>
			<div class="container">
				<div id="row">
					<search-box
						componentId="BookSensor"
						:dataField="['original_title', 'original_title.search']"
						:URLParams="true"
						:size="10"
						:autosuggest="true"
						class="searchbox"
					>
						<template
							#render="{
								error,
								loading,
								downshiftProps: { isOpen, highlightedIndex, getItemProps, getItemEvents },
								data: suggestions,
							}"
						>
							<div class="pill-wrapper" v-if="isOpen">
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
				</div>
				<div class="row">
					<reactive-list
						:pagination="true"
						:size="10"
						:react="{ and: ['BookSensor'] }"
						component-id="SearchResult"
						data-field="original_title.keyword"
					>

						<template #render="{ data }">
						<ResultCardsWrapper>
							<ResultCard
							v-for="result in data"
							:key="result._id"
							:id="result._id"
							>
							<ResultCardImage :src="result.image" />
							<ResultCardTitle>
								{{ result.original_title }}
							</ResultCardTitle>
							<ResultCardDescription>
								<div class="flex column justify-center">
								<div class="flex column justify-space-between">
									<div>
									<div>
										by <span class="authors-list">{{ result.authors }}</span>
									</div>
									<div class="ratings-list flex align-center">
										<span class="stars">
										<i
											v-for="(item, index) in Array(
											Math.floor(result.average_rating)
											).fill('x')"
											:key="index"
											class="fas fa-star"
										/>
										</span>
										<span
										class="avg-rating"
										>({{ result.average_rating }} avg)</span
										>
									</div>
									</div>
									<span
									class="pub-year"
									>Pub {{ result.original_publication_year }}</span
									>
								</div>
								</div>
							</ResultCardDescription>
							</ResultCard>
						</ResultCardsWrapper>
						</template>
					</reactive-list>
				</div>
			</div>
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
			if(typeof val === 'string')
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
