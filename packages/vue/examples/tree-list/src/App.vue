<template>
	<div id="app">
		<ReactiveBase
			app="best-buy-dataset"
			url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
			:enable-appbase="true"
		>
			<TreeList
				componentId="TreeListComponent"
				mode="single"
				:URLParams="true"
				:dataField="['class.keyword', 'subclass.keyword']"
			/>
			<ReactiveList
				componentId="SearchResult"
				dataField="original_title"
				className="result-list-container"
				:pagination="true"
				:from="0"
				:size="5"
				:react="{ and: ['TreeListComponent'] }"
				:includeFields="['*']"
			>
				<template #renderItem="{ item: data }">
					<div className="flex book-content" :key="data._id">
						<img :src="data.image" alt="Book Cover" className="book-image" />
						<div className="flex column justify-center" :style="{ marginLeft: 20 }">
							<div className="book-header">{{ data.name }}</div>
							<div className="flex column justify-space-between">
								<div>
									<div>
										<span className="authors-list">
											{{ data.class }} > {{ data.subclass }}
										</span>
									</div>
									<div className="ratings-list flex align-center">
										Sale Price 💰 <b>{{ data.salePrice }}</b>
									</div>
								</div>
							</div>
						</div>
					</div>
				</template>
			</ReactiveList>
		</ReactiveBase>
	</div>
</template>

<script>
import './styles.css';
import { ReactiveBase, ReactiveList, TreeList } from '@appbaseio/reactivesearch-vue';

export default {
	name: 'app',
	components: { ReactiveBase, ReactiveList, TreeList },
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
