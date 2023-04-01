<template>
  <div class="weather-icon">
    <img :src="!dark ? require(`@/assets/weather-icons-master/production/fill/openweathermap/${name}.svg`).default : require(`@/assets/weather-icons-master/production/line/openweathermap/${name}.svg`).default" />
  </div>
</template>
<script>

export default {
  name: 'WeatherIcon',
  props: {
    name: {
      type: String,
      default: undefined,
    },
    dark: {
      type: Boolean,
    },
  },
};
</script>

