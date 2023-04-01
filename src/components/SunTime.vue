<template>
  <div class="inline-flex items-center justify-center">
    <img class="inline-block w-10 md:w-14 h-10 md:h-14" 
    :src="require( `@/assets/weather-icons-master/production/fill/all/${name}.svg` ).default" />
    <span class="text-left leading-tight">
      <small class="block">
        {{ name }}
      </small>
      {{ time }} 
    </span>
  </div>
</template>

<script>
export default {
  name: 'WeatherIcon',
  props: {
    name: {
      type: String,
    },
    time: {
      type: String,
    },
  },
};
</script>

