<template>
  <div>
    <h1 class="text-3xl">{{ msg }}</h1>
    <p class="text-lg font-thin">
      With <b class="text-teal-700">Tailwind.css</b> configured out of the box!
    </p>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
