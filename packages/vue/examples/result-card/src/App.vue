<template>
	<div id="app">
		<ReactiveBase
			app="meetup_dataset"
			url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@arc-cluster-appbase-demo-6pjy6z.searchbase.io"
			:enable-appbase="true"
		>
			<div class="row">
				<ReactiveList
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
					<div slot="render" slot-scope="{ data }">
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
					</div>
				</ReactiveList>
			</div>
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
	color: #2c3e50;
}
</style>
