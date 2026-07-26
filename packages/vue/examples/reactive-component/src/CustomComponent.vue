<template>
    <div v-if="aggregations">
        <div
            :style="{cursor: 'pointer' }"
            v-for="item in aggregations['language_code.keyword'].buckets"
            v-bind:key="item.key"
            @click="() => setValue(item.key)"
        >
            <b v-if="selected === item.key" :style="{color: 'blue' }">
                {{ item.key }}
            </b>
            <span v-else> {{ item.key }} </span>
        </div>
    </div>
</template>
    <script>
        export default {
            name: "CustomComponent",
  props: {
            subProps: Object,
        subEvents: Object,
        aggregations: Object,
        setQuery: Function
      },
  data: function() {
    return {
            selected: ""
      };
    },
  methods: {
            setValue(value) {
        this.$props.setQuery({
            query: {
            term: {
            "language_code.keyword": value
      }
    },
    value
  });
  return (this.selected = value);
}
}
};
</script>
