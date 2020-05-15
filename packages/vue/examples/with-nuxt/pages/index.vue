<template>
	<div id="app">
		<ReactiveBase
			app="good-books-ds"
      url="https://1e47b838a035:767b5a1a-03cb-4c5f-a536-4f399c24134b@arc-cluster-appbase-tryout-k8dsnj.searchbase.io"
      :enable-appbase="true"
		>
			<DataSearch
				categoryField="authors.keyword"
				componentId="BookSensorSearch"
				:dataField="['original_title', 'original_title.search']"
				:URLParams="true"
			/>
			<RangeSlider
				data-field="ratings_count"
				componentId="BookSensor"
				:react="{ and: ['BookSensorSearch'] }"
				:range="{
					start: 3000,
					end: 50000,
				}"
				:rangeLabels="{
					start: '3K',
					end: '50K',
				}"
			/>
			<SingleList
				componentId="Authors"
				data-field="authors.keyword"
				class="single-list-container"
			/>
			<ReactiveList
				componentId="SearchResult"
				data-field="original_title.keyword"
				class="result-list-container"
				:pagination="true"
				:from="0"
				:size="5"
				:react="{ and: ['BookSensor', 'Authors', 'BookSensorSearch'] }"
			>
				<div slot="renderItem" slot-scope="{ item }">
					<div class="flex book-content" key="item._id">
						<img :src="item.image" alt="Book Cover" class="book-image" />
						<div class="flex column justify-center ml20">
							<div class="book-header">{{ item.original_title }}</div>
							<div class="flex column justify-space-between">
								<div>
									<div>
										by
										<span class="authors-list">{{ item.authors }}</span>
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
import '@/assets/css/styles.css';
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
