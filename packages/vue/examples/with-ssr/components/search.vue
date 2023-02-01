<template>
  <div class="container">
    <!-- eslint-disable -->
		<reactive-base
			:enable-appbase="true"
			:theme="{
				colors: {
					primaryColor: '#FF3A4E',
				},
			}"
			:context-collector="contextCollector"
			:initial-state="initialState"
			app="good-books-ds"
			url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
		>
			<nav class="nav">
				<div class="title">Books Search</div>
				<search-box
					:autosuggest="false"
					:highlight="true"
					:URLParams="true"
					:data-field="['original_title', 'original_title.search']"
					component-id="SearchSensor"
					placeholder="Search by books names"
					icon-position="left"
					class-name="search"
				/>
			</nav>
			<div class="row">
				<div class="col">
					<multi-list
						componentId="Authors"
						dataField="authors.keyword"
						:URLParams="true"
						:showCount="true"
					/>
				</div>

				<div class="col">
					<reactive-list
						:size="12"
						:pagination="true"
						:URLParams="true"
						:react="{
							and: ['SearchSensor', 'Authors'],
						}"
						:inner-class="{
							resultStats: 'result-stats',
							list: 'list',
							listItem: 'list-item',
							image: 'image',
						}"
						component-id="SearchResult"
						data-field="original_title"
					>
						<template #renderItem="{ item }">
							<div :id="item._id" :key="item._id" class="flex book-content">
								<img :src="item.image" alt="Book Cover" class="book-image" />
								<div class="flex column justify-center ml20">
									<div class="book-header" inner-html="item.original_title"></div>
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
														:key="index"
														class="fas fa-star"
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
				</div>
			</div>
		</reactive-base>
	</div>
</template>

<script>
import { ReactiveBase, ReactiveList, SearchBox, MultiList } from '@appbaseio/reactivesearch-vue';

export default {
	name: 'Search',
	components: {
		ReactiveBase,
		ReactiveList,
		SearchBox,
		MultiList,
	},
	props: {
		initialState: {
			type: Object,
			default: null,
		},
		contextCollector: {
			type: Function,
			default: null,
		},
	},
};
</script>
