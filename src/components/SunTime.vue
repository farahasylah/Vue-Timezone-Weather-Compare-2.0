<template>
  <div class="inline-flex items-center justify-center">
    <img class="inline-block w-10 md:w-14 h-10 md:h-14" :src="require(`@/assets/weather-icons-master/production/fill/all/${name}.svg`).default" />
   
    <span class="text-left leading-tight">
      <small class="block">{{ name }}</small>
      {{ time }} 
    </span>
  </div>
</template>

<script>
export default {
  name: 'WeatherIcon',
  data() {
    return {
      api_key: '207a1e6a9123b10b4ae0a07ca97f6692',
      url_base: 'http://api.openweathermap.org/data/2.5/',
      loc_base: 'http://api.openweathermap.org/geo/1.0/',
      darkmode: false,
      query: '',
      suggestion: [],
      weathers: [],
      message: '',
    }
  },
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

