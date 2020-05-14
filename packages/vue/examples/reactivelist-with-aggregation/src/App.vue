<template>
	<div id="app">
		<ReactiveBase
			app="carstore-dataset"
			url="https://1e47b838a035:767b5a1a-03cb-4c5f-a536-4f399c24134b@arc-cluster-appbase-tryout-k8dsnj.searchbase.io"
			:enable-appbase="true"
		>
			<ReactiveList
				componentId="SearchResult"
				dataField="brand.keyword"
				aggregationField="brand.keyword"
				className="result-list-container"
			>
				<div slot="render" slot-scope="{ aggregationData }">
					<div v-bind:key="result._source._id" v-for="result in aggregationData">
						<h3>{{ result._source.brand }}</h3>
						<img :src="result._source.image" width="500" />
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
