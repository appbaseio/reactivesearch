<template>
  <div id="app">
    <reactive-base
      :enable-appbase="true"
      app="earthquakes"
      url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
    >
      <div class="row">
        <div class="col">
          <single-list
            :size="50"
            title="Places"
            component-id="places"
            data-field="place.keyword"
            show-search
          />
        </div>

        <div class="col">
          <selected-filters />
          <reactive-google-map
            :size="50"
            :style="{ height: '90vh', minWidth: '300px' }"
            :react="{ and: 'places' }"
            :default-zoom="3"
            :show-marker-clusters="true"
            component-id="map"
            data-field="location"
          >
            <template
              :style="{
                background: 'dodgerblue',
                color: '#fff',
                paddingLeft: '5px',
                paddingRight: '5px',
                borderRadius: '3px',
                padding: '10px',
              }"
              #renderItem="{ magnitude }"
            >
              <i class="fas fa-globe-europe" />
              &nbsp;{{ magnitude }}
            </template>
          </reactive-google-map>
        </div>
      </div>
    </reactive-base>
  </div>
</template>

<script>

export default {
	name: 'Search',
};
</script>

<style>
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
}
.row {
    display: flex;
    flex-direction: row;
    width: 100%;
  }

  .row.dark {
    background: #303030;
  }

  .col {
    width: calc(100% - 400px);
    padding: 15px;
  }

  .row > .col:first-child {
    border-right: 1px solid #ccc;
    max-width: 400px;
  }

  .result-list-container {
    width: 75%;
    padding: 0 40px;
    display: inline-flex;
    flex-direction: column;
  }

  .single-list-container {
    width: 25%;
    display: inline-flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .row > .col:last-child {
    background: #fafafa;
  }

  .row.dark > .col:last-child {
    background: #303030;
  }

  .flex {
    display: flex;
  }

  .wrap {
    flex-wrap: wrap;
  }

  .column {
    flex-direction: column;
  }

  .authors-list {
    color: #9d9d9d;
    font-weight: bold;
  }

  .dark .authors-list {
    color: #fafafa;
  }

  .ratings-list {
    padding: 10px 0;
  }

  .avg-rating {
    color: #6b6b6b;
  }

  .dark .avg-rating {
    color: #fafafa;
  }

  .align-center {
    align-items: center;
  }

  .justify-center {
    justify-content: center;
  }

  .justify-space-between {
    justify-content: space-between;
  }

  .stars {
    color: gold;
  }

  .location {
    color: salmon;
    margin-right: 5px;
  }

  .meetup-location {
    margin: 4px 0;
  }

  .book-title {
    white-space: normal;
    margin-top: 4px;
  }

  .book-title-card {
    white-space: normal;
    margin-top: 4px;
    max-height: 45px;
  }

  .book-image {
    height: 150px;
    width: 110px;
    background-size: cover;
  }

  .book-header {
    font-weight: bold;
    margin-bottom: 5px;
  }

  .book-content {
    background: white;
    margin: 10px 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  }

  .meetup-title {
    white-space: normal;
  }

  .meetup-topics {
    height: 35px;
    overflow: hidden;
  }

  .text-center {
    text-align: center;
  }

  .meetup-topic {
    background-color: #dedede;
    color: #555;
    padding: 5px 10px;
    margin: 5px;
    border-radius: 4px;
  }

  .meetup-topic:first-child {
    margin-left: 0;
  }

  .col .meetup-list-image {
    background-size: cover;
  }
  .ml20 {
    margin-left: 20px;
  }

</style>
