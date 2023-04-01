<template>
  <div>
    <WeatherIcon :name="weatherItem.icon" :dark="darkmode"/>
    <div class="location-box text-left">
        <small class="text-left italic dark:text-white" 
        v-if="weatherItem.nearby_name">
        Result nearest to <b>
          {{ weatherItem.nearby_name }} , 
          {{ weatherItem.nearby_state ? weatherItem.nearby_state + ' , ': '' }} 
          {{ weatherItem.nearby_country }}</b></small>

        <div class="location mb-4 text-3xl font-bold dark:text-white">
          {{ weatherItem.name }}, {{ weatherItem.country }}
        </div>
        <div class="date text-md font-semibold text-left dark:text-white">
            <CalendarIcon class="h-4 w-4 inline-block"/>
            {{ weatherItem.datezone }} 
            <br> 
            <ClockIcon class="h-4 w-4 inline-block"/>
            {{ weatherItem.timezone }}
        </div>
    </div>
    
    <div class="weather-box p-6 pb-2 dark:text-white">
      <div class="weather-desc dark:text-black"  >
        <div class="weather bg-sky-200"> 
          {{ weatherItem.weather }} 
        </div>
      </div>
      <small class="italic">
        {{  weatherItem.desc }}
      </small>
      <div class="temp text-6xl mt-4 mb-2">
        {{ Math.round( weatherItem.temp ) }} °C 
      </div>
      <div class="text-md mb-2">
        Feels like {{ Math.round( weatherItem.feels_like ) }} °C 
      </div>
      <div>
        Humidity : {{ weatherItem.humidity }}% , Wind : {{ weatherItem.wind }} m/s
      </div>
    </div>
    <div class="suntime mt-4 grid grid-cols-2 gap-3 place-content-center dark:text-white">
      <SunTime name="sunrise" :time="weatherItem.sunrise"/>
      <SunTime name="sunset" :time="weatherItem.sunset"/>
    </div>
  </div>
</template>
<script>

import WeatherIcon from './WeatherIcon.vue';
import SunTime from './SunTime.vue';
import { ClockIcon, CalendarIcon } from '@heroicons/vue/outline'
export default {
  name: 'WeatherBox',
  props: {
    darkmode: {
      type: Boolean,
    },
    weatherItem: {
      type: Object,
    }
  },
  components: { WeatherIcon, SunTime, CalendarIcon, ClockIcon }
};
</script>

