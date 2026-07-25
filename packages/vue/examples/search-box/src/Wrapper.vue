<template>
	<div id="app">
		<reactive-base
			app="good-books-ds"
			url="https://reactivesearch-api-9-4-0.onrender.com"
			credentials="d03e6f5f33d5:49124674-554e-4343-9ab2-006b2932f5c0"
		>
            <slot />
		</reactive-base>
	</div>
</template>

<script>
import './styles.css';
import { ReactiveBase } from '@appbaseio/reactivesearch-vue';

export default {
	name: 'Wrapper',
	components: { ReactiveBase },
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
