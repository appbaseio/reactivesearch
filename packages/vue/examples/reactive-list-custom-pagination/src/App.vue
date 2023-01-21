<template>
	<div id="app">
		<reactive-base
			app="good-books-ds"
			url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
		>
			<reactive-list
				componentId="SearchResult"
				data-field="original_title.keyword"
				class="result-list-container"
				:pagination="true"
				:from="0"
				:size="5"
				:react="{ and: ['BookSensor'] }"
				:URLParams="true"
				:inner-class="{
					pagination: 'rs-pagination'
				}"
			>
				<template #render="{ loading, error, data, resultStats, setPage }">
					<div v-if="loading">Fetching Results.</div>
					<div v-if="Boolean(error)">Something went wrong! Error details {JSON.stringify(error)}</div>
					<div v-bind:key="item._id" v-for="item in data">
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
											<span class="avg-rating">({{ item.average_rating }} avg)</span>
										</div>
									</div>
									<span class="pub-year">Pub {{ item.original_publication_year }}</span>
								</div>
							</div>
						</div>
					</div>
					<div class="pagination-wrapper">
						<paginate
							:value="resultStats.currentPage + 1"
							:page-count="resultStats.numberOfPages"
							:click-handler="(page) => setPage(page-1)"
							:prev-text="'Prev'"
							:next-text="'Next'"
							:container-class="'pagination'"
						></paginate>
					</div>
				</template>
			</reactive-list>
		</reactive-base>
	</div>
</template>

<script>
import { ReactiveBase, ReactiveList, SearchBox } from '@appbaseio/reactivesearch-vue';
import Paginate from 'vuejs-paginate';
import './styles.css';

export default {
	name: 'app',
	components: { ReactiveBase, ReactiveList, SearchBox, Paginate },
};
</script>

<style>
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}

.rs-pagination {
	display: none;
}

.pagination-wrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 20px;
}
.pagination {
	display: inline-block;
	padding-left: 0;
	margin: 0 auto;
	border-radius: 4px;
}
.pagination > li {
	display: inline;
}
.pagination > li > a,
.pagination > li > span {
	position: relative;
	float: left;
	padding: 6px 12px;
	margin-left: -1px;
	line-height: 1.42857143;
	color: #337ab7;
	text-decoration: none;
	background-color: #fff;
	border: 1px solid #ddd;
}
.pagination > li:first-child > a,
.pagination > li:first-child > span {
	margin-left: 0;
	border-top-left-radius: 4px;
	border-bottom-left-radius: 4px;
}
.pagination > li:last-child > a,
.pagination > li:last-child > span {
	border-top-right-radius: 4px;
	border-bottom-right-radius: 4px;
}
.pagination > li > a:hover,
.pagination > li > span:hover,
.pagination > li > a:focus,
.pagination > li > span:focus {
	z-index: 3;
	color: #23527c;
	background-color: #eee;
	border-color: #ddd;
}
.pagination > .active > a,
.pagination > .active > span,
.pagination > .active > a:hover,
.pagination > .active > span:hover,
.pagination > .active > a:focus,
.pagination > .active > span:focus {
	z-index: 2;
	color: #fff;
	cursor: default;
	background-color: #337ab7;
	border-color: #337ab7;
}
.pagination > .disabled > span,
.pagination > .disabled > span:hover,
.pagination > .disabled > span:focus,
.pagination > .disabled > a,
.pagination > .disabled > a:hover,
.pagination > .disabled > a:focus {
	color: #777;
	cursor: not-allowed;
	background-color: #fff;
	border-color: #ddd;
}
.pagination-lg > li > a,
.pagination-lg > li > span {
	padding: 10px 16px;
	font-size: 18px;
	line-height: 1.3333333;
}
.pagination-lg > li:first-child > a,
.pagination-lg > li:first-child > span {
	border-top-left-radius: 6px;
	border-bottom-left-radius: 6px;
}
.pagination-lg > li:last-child > a,
.pagination-lg > li:last-child > span {
	border-top-right-radius: 6px;
	border-bottom-right-radius: 6px;
}
.pagination-sm > li > a,
.pagination-sm > li > span {
	padding: 5px 10px;
	font-size: 12px;
	line-height: 1.5;
}
.pagination-sm > li:first-child > a,
.pagination-sm > li:first-child > span {
	border-top-left-radius: 3px;
	border-bottom-left-radius: 3px;
}
.pagination-sm > li:last-child > a,
.pagination-sm > li:last-child > span {
	border-top-right-radius: 3px;
	border-bottom-right-radius: 3px;
}
</style>
