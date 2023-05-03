<template>

<ul v-if="isOpen">
						<li
							:style="{ backgroundColor: this.highlightedIndex ? 'grey' : 'transparent' }"
							v-for="suggestion in (data || []).map(s =>  ({
								label: s.source.authors,
								value: s.source.authors,
								key: s._id,
							}))"
							v-bind="getItemProps({ item: suggestion })"
							v-on="getItemEvents({ item: suggestion })"
							:key="suggestion._id"
						>
							{{ suggestion.label }}
						</li>
					</ul>
</template>

<script>
export default {
	name: 'app',
	computed(){
        return {
            suggestions: (this.data || []).map(s =>  ({
								label: s.source.authors,
								value: s.source.authors,
								key: s._id,
							})),
        }
    }
};
</script>
