<template>
	<div id="app">
		<reactive-base
			app="meetup_dataset"
			url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
		>
			<div class="row">
				<div class="col">
					<toggle-button
						componentId="CitySensor"
						dataField="group.group_topics.topic_name_raw.keyword"
						:data="[
							{ label: 'Social', value: 'Social' },
							{ label: 'Adventure', value: 'Adventure' },
							{ label: 'Music', value: 'Music' },
						]"
					/>
				</div>
				<div class="col">
					<selected-filters componentId="CitySensor" />
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
						:react="{
							and: ['CitySensor']
						}"
						:pagination="true"
					>
						<template #render="{ data }">
							<ResultListWrapper>
								<ResultList
									v-bind:key="result._id"
									v-for="result in data"
									:href="result.event.event_url"
								>
									<ResultListImage :small="true" :src="result.member.photo" />
									<ResultListContent>
										<ResultListTitle>
											{{ result.member ? result.member.member_name : '' }} is
											going to
											{{ result.event ? result.event.event_name : '' }}
										</ResultListTitle>
										<ResultListDescription>
											{{ result.group ? result.group.group_city : '' }}
										</ResultListDescription>
									</ResultListContent>
								</ResultList>
							</ResultListWrapper>
						</template>
					</reactive-list>
				</div>
			</div>
		</reactive-base>
	</div>
</template>

<script>
import './styles.css';
import { ReactiveBase, ReactiveList, ToggleButton, SelectedFilters, ResultList  } from '@appbaseio/reactivesearch-vue'

export default {
	name: 'app',
	components: {
		ReactiveBase,
		ReactiveList,
		ToggleButton,
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
