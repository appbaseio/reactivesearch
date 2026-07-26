<template>
	<div id="app">
		<reactive-base
			app="good-books-ds"
			url="https://reactivesearch-api-9-4-0.onrender.com"
			credentials="d03e6f5f33d5:49124674-554e-4343-9ab2-006b2932f5c0"
		>
			<reactive-list
				componentId="SearchResult"
				dataField="authors.keyword"
				distinctField="authors.keyword"
				className="result-list-container"
			>
				<template #render="{ aggregationData }">
					<div v-bind:key="result._id" v-for="result in aggregationData">
						<h3>{{ result.authors }}</h3>
						<img :src="result.image" width="500" />
					</div>
				</template>
			</reactive-list>
		</reactive-base>
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
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
