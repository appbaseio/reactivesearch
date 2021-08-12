

<template>
	<div id="app">
		<reactive-base
			app="good-books-ds"
			url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
			:enable-appbase="true"
		>
			<div class="row">
				<div class="col">
					<data-search
						className="result-list-container"
						componentId="BookSensor"
						:dataField="['original_title', 'original_title.search']"
						:URLParams="true"
						:size="3"
						:enablePopularSuggestions="true"
						:enableRecentSearches="true"
					/>
					<div :style="{ marginTop: '20px' }">
						<multi-list
							componentId="Authors"
							dataField="authors.keyword"
							className="multi-list-container"
							:showCount="true"
							:react="{ and: ['BookSensor'] }"
						/>
					</div>
				</div>
				<div class="col">
					<selected-filters>
						<div slot-scope="{ selectedValues, setValue, clearValues }">
							<div
								v-for="componentId in Object.keys(getFilteredValues(selectedValues))"
								:key="componentId"
							>
								<div>
									component: {{ componentId }} value:
									{{ selectedValues[componentId].value }}
									<button @click="() => setValue(componentId, null)">
										Clear
									</button>
								</div>
							</div>
							<button v-if="Object.keys(getFilteredValues(selectedValues)).length" @click="clearValues">Clear All</button>
						</div>
					</selected-filters>
					<reactive-list
						componentId="SearchResult"
						dataField="original_title.keyword"
						className="result-list-container"
						:pagination="true"
						:size="5"
						:react="{ and: ['BookSensor', 'Authors'] }"
					>
						<div slot="renderItem" slot-scope="{ item }">
							<div :id="item._id" class="flex book-content" :key="item._id">
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
					</reactive-list>
				</div>
			</div>
		</reactive-base>
	</div>
</template>



<script>
import './styles.css';
export default {
	name: 'app',
	methods: {
		getFilteredValues(values = {}) {
			const filteredValues = {};
			Object.keys(values).forEach((componentId) => {
				if(values[componentId].showFilter &&
					(Array.isArray(values[componentId].value)
						? values[componentId].value.length
						: !!values[componentId].value)) {
							filteredValues[componentId] = values[componentId]
						}
			})
			return filteredValues
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
