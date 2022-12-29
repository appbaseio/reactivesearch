<template>
	<div id="app">
		<ReactiveBase
			app="good-books-ds"
			url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
			:enable-appbase="true"
			><SearchBox
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
			>
			</SearchBox>
			<ReactiveList
				componentId="SearchResult"
				dataField="original_title.keyword"
				className="result-list-container"
				:pagination="true"
				:size="5"
				:react="{ and: ['BookSensor'] }"
			>
				<template #renderItem="{ item }">
					<div>
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
					</div></template
				>
			</ReactiveList>
		</ReactiveBase>
	</div>
</template>

<script>
import './styles.css';
export default {
	name: 'app',
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
