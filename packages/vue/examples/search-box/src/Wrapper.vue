<template>
	<div id="app">
		<reactive-base
			app="good-books-ds"
			url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@appbase-demo-ansible-abxiydt-arc.searchbase.io"
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
