<template>
	<div id="app">
		<ReactiveBase
			app="carstore-dataset"
			url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io.searchbase.io"
			:enable-appbase="true"
		>
			<ReactiveList
				componentId="SearchResult"
				dataField="brand.keyword"
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
