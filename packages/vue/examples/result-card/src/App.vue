<template>
	<div id="app">
		<reactive-base
			app="meetup_dataset"
			url="https://reactivesearch-api-9-4-0.onrender.com"
			credentials="d03e6f5f33d5:49124674-554e-4343-9ab2-006b2932f5c0"
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
