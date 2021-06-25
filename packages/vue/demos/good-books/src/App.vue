<!-- <template>
	<div id="app">
		<reactive-base
			app="good-books-ds"
			url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
			:enable-appbase="true"
		>
			<button class="toggle" @click="switchContainer">
				{{ showBooks ? 'Show Filter 💣' : 'Show Books 📚' }}
			</button>
			<div class="filters-container" :class="{ hide: showBooks }">
				<multi-list
					componentId="Authors"
					dataField="authors.keyword"
					class="filter"
					title="Select Authors"
					selectAllLabel="All Authors"
				/>
				<single-range
					componentId="Ratings"
					dataField="average_rating"
					:data="[
						{ start: 0, end: 3, label: 'Rating < 3' },
						{ start: 3, end: 4, label: 'Rating 3 to 4' },
						{ start: 4, end: 5, label: 'Rating > 4' },
					]"
					title="Book Ratings"
					class="filter"
				/>
			</div>

			<reactive-list
				componentId="SearchResult"
				dataField="original_title.keyword"
				className="result-list-container"
				:class="{ full: showBooks }"
				:pagination="true"
				:from="0"
				:size="5"
				:react="{ and: ['Ratings', 'Authors'] }"
			>
				<div slot="renderItem" slot-scope="{ item }">
					<div class="flex book-content" key="item._id">
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
			</reactive-list>
		</reactive-base>
	</div>
</template>
-->
<template>
	<div id="app">
		<ReactiveBase
			app="good-books-ds"
			url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
		>
			<DataSearch
				componentId="SearchSensor"
				:dataField="['title', 'title.search']"
				:URLParams="true"
			/>
			<SingleList
				componentId="Authors"
				dataField="authors.keyword"
				className="single-list-container"
				:URLParams="true"
			/>
			<ReactiveList
				componentId="SearchResult"
				dataField="original_title.keyword"
				className="result-list-container"
				:pagination="true"
				:from="0"
				:size="5"
				:URLParams="true"
				:react="{ and: ['Authors', 'SearchSensor'] }"
			>
				<div slot="renderNoResults">No data found-> custom</div>
				<div slot="renderItem" slot-scope="{ item }">
					<div class="flex book-content" key="item._id">
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
	data: function() {
		return {
			showBooks: window.innerWidth <= 768 ? true : false,
		};
	},
	methods: {
		switchContainer: function() {
			return (this.showBooks = !this.showBooks);
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

.row {
	display: flex;
	flex-direction: row;
	width: 100%;
}

.row.dark {
	background: #303030;
}

.col {
	width: calc(100% - 400px);
	padding: 15px;
}

.row > .col:first-child {
	border-right: 1px solid #ccc;
	max-width: 400px;
}

.result-list-container {
	width: 75%;
	padding: 0 40px;
	display: inline-flex;
	flex-direction: column;
}

.single-list-container {
	width: 25%;
	display: inline-flex;
	flex-direction: column;
	justify-content: space-around;
}

.row > .col:last-child {
	background: #fafafa;
}

.row.dark > .col:last-child {
	background: #303030;
}

.flex {
	display: flex;
}

.wrap {
	flex-wrap: wrap;
}

.column {
	flex-direction: column;
}

.authors-list {
	color: #9d9d9d;
	font-weight: bold;
}

.dark .authors-list {
	color: #fafafa;
}

.ratings-list {
	padding: 10px 0;
}

.avg-rating {
	color: #6b6b6b;
}

.dark .avg-rating {
	color: #fafafa;
}

.align-center {
	align-items: center;
}

.justify-center {
	justify-content: center;
}

.justify-space-between {
	justify-content: space-between;
}

.stars {
	color: gold;
}

.location {
	color: salmon;
	margin-right: 5px;
}

.meetup-location {
	margin: 4px 0;
}

.book-title {
	white-space: normal;
	margin-top: 4px;
}

.book-title-card {
	white-space: normal;
	margin-top: 4px;
	max-height: 45px;
}

.book-image {
	height: 150px;
	width: 110px;
	background-size: cover;
}

.book-header {
	font-weight: bold;
	margin-bottom: 5px;
}

.book-content {
	background: white;
	margin: 10px 0;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.meetup-title {
	white-space: normal;
}

.meetup-topics {
	height: 35px;
	overflow: hidden;
}

.text-center {
	text-align: center;
}

.meetup-topic {
	background-color: #dedede;
	color: #555;
	padding: 5px 10px;
	margin: 5px;
	border-radius: 4px;
}

.meetup-topic:first-child {
	margin-left: 0;
}

.col .meetup-list-image {
	background-size: cover;
}
.ml20 {
	margin-left: 20px;
}
</style>
