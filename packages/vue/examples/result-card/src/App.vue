<template>
  <div id="app">
    <ReactiveBase
      app="meetup_app"
      credentials="lW70IgSjr:87c5ae16-73fb-4559-a29e-0a02760d2181"
    >
      <div class="row">
          <ResultCard
            componentId="SearchResult"
            dataField="group.group_topics.topic_name_raw"
            title="Results"
            sortBy="asc"
            class="result-list-container"
                    :from="0"
          :size="5"
          :renderData="meetupList"
                    :innerClass="{
            image: 'meetup-list-image'
      }"
      :pagination="true"
  />
      </div>
    </ReactiveBase>
  </div>
</template>

<script>
import "./styles.css";

export default {
    name: "app",
  methods: {
    meetupList(data) {
  return {
    title: `${data.member ? data.member.member_name : ""} is going to ${data.event ? data.event.event_name : ""}`,
  image: data.member.photo,
  image_size: 'small',
  description: data.group ? data.group.group_city : "",
  url: data.event.event_url
}
}
}
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
