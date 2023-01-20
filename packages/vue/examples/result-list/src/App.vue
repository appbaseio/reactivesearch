<template>
	<div id="app">
		<reactive-base
			app="meetup_dataset"
			url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
		>
			<div class="row">
				<reactive-list
					componentId="SearchResult"
					dataField="group.group_topics.topic_name_raw.keyword"
					title="Results"
					sortBy="asc"
					class="result-list-container"
					:from="0"
					:size="5"
					:innerClass="{
						image: 'meetup-list-image',
					}"
					:pagination="true"
				>
					<template #render="{ data }">
						<result-list-wrapper>
							<result-list
								v-bind:key="result._id"
								v-for="result in data"
								:href="result.event.event_url"
							>
								<result-list-image :small="true" :src="result.member.photo" />
								<result-list-content>
									<result-list-title>
										{{ result.member ? result.member.member_name : '' }} is
										going to
										{{ result.event ? result.event.event_name : '' }}
									</result-list-title>
									<result-list-description>
										{{ result.group ? result.group.group_city : '' }}
									</result-list-description>
								</result-list-content>
							</result-list>
						</result-list-wrapper>
					</template>
				</reactive-list>
			</div>
		</reactive-base>
	</div>
</template>

<script>
import './styles.css';
import { ReactiveBase, ReactiveList, SearchBox, SelectedFilters, ResultList  } from '@appbaseio/reactivesearch-vue'

export default {
	name: 'app',
	components: {
		ReactiveBase,
		ReactiveList,
		SearchBox,
		SelectedFilters,
		ResultList
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
