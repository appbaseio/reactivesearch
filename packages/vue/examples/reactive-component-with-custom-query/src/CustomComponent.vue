<template>
    <div v-if="aggregations">
        <div
            :style="{cursor: 'pointer' }"
            v-for="item in aggregations['brand.keyword'].buckets"
            v-bind:key="item.id"
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
            "brand.keyword": value
      }
    },
    value
  });
  return (this.selected = value);
}
}
};
</script>
