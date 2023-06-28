<template>
  <div class="card">
    <div class="card-image">
      <img
        :src="poster_path"
        :alt="original_title" >
    </div>
    <div class="card-content">
      <h5
        class="card-title"
        v-html="original_title"
      />
      <p class="card-description">{{ overview }}</p>
      <div class="card-tags">
        <span
          v-for="(tag, index) in genres"
          :key="index"
          class="card-tag">
          {{ tag }}
        </span>
      </div>
      <div class="card-info">
        <p class="card-release">{{ release_year }}</p>
        <p class="card-vote">{{ vote_average }}</p>
      </div>
    </div>
</div></template>

<style>
.card {
    display: flex;
    flex-direction: row;
    border: 1px solid #ccc;
    border-radius: 5px;
    overflow: hidden;
    max-height: 250px;
    margin-top: 1rem;
    color: white;
  }

  .card-image {
    width: 35%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .card-image img {
    max-width: 100%;
    object-fit: cover;
  }

  .card-content {
    padding: 1rem;
    width: 65%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: auto;
  }

  .card-title {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    margin-top: 0;
  }

  .card-description {
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  .card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .card-tag {
    background-color: #f2f2f2;
    color: #333;
    border-radius: 3px;
    padding: 0.25rem 0.5rem;
    margin-right: 0.5rem;
  }

  .card-info {
    display: flex;
    align-items: center;
  }

  .card-release {
    font-size: 01.2rem;
    color: #0077ff;
    margin-right: 1rem;
  }

  .card-vote {
    font-size: 1.2rem;
    font-weight: bold;
    color: #0077ff;
  }

</style>

<script>

export default {
	name: 'Card',
	props: {
		poster_path: {
			type: String,
			default: ''
		},
		original_title: {
			type: String,
			default: ''
		},
		genres: {
			type: Array,
			default: ()=>[]
		},
		overview:  {
			type: String,
			default: ''
		},
		release_year:  {
			type: String,
			default: ''
		},
		vote_average:  {
			type: String,
			default: ''
		},
	}
}
</script>
