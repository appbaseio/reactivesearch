<template>
	<div id="app">
		<ReactiveBase
			app="carstore-dataset-latest"
			credentials="B86d2y2OE:4fecb2c5-5c5f-49e5-9e0b-0faba74597c6"
		>
			<ReactiveList
				componentId="SearchResult"
				dataField="brand.raw"
				className="result-list-container"
			>
				<div slot="render" slot-scope="{ data }">
					<div v-bind:key="result._id" v-for="result in data">
						<h3>{{ result.brand }}</h3>
						<img :src="result.image" width="500" />
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
