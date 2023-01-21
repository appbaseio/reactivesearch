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
						<ResultCardsWrapper>
							<ResultCard
								v-bind:key="result._id"
								:id="result._id"
								v-for="result in data"
								:href="result.event.event_url"
							>
								<ResultCardImage :src="result.member.photo" />
								<ResultCardTitle>
									{{ result.member ? result.member.member_name : '' }} is going to
									{{ result.event ? result.event.event_name : '' }}
								</ResultCardTitle>
								<ResultCardDescription>
									{{ result.group ? result.group.group_city : '' }}
								</ResultCardDescription>
							</ResultCard>
						</ResultCardsWrapper>
					</template>
				</reactive-list>
			</div>
		</reactive-base>
	</div>
</template>

<script>
import { ReactiveBase, ReactiveList, ResultCard  } from '@appbaseio/reactivesearch-vue'
import './styles.css';

export default {
	name: 'app',
	components: {
		ReactiveBase,
		ReactiveList,
		ResultCard
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
