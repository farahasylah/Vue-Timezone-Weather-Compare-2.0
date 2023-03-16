<template>
  <div class="appcontent scroll-smooth p-8" :class="{ 'dark' : darkmode }">
    <a class="modebtn hover:bg-black hover:text-white dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black transition-colors" @click="darkMode" ref="btnModeRef" v-on:mouseenter="toggleTooltipMode()" v-on:mouseleave="toggleTooltipMode()" >
      <MoonIcon v-if="!darkmode" class="h-4 w-4 text-grey-400"/>
      <SunIcon v-else class="h-4 w-4 text-white-400"/>
      mode
    </a>
    <div ref="tooltipModeRef" :class="{'hidden': !tooltipMode, 'block': tooltipMode, 'bg-black' : !darkmode, 'bg-white' : darkmode}" class="tooltip bg-black block z-50 text-sm max-w-xs text-left break-words rounded-lg">
      <div class="p-2" :class="{'text-black' : darkmode, 'text-white' : !darkmode}">
        {{ darkmode ? 'Light' : 'Dark' }} mode
      </div>
    </div>

    <main class="" :class="{ 'initial' : weathers.length === 0}">
      <LocationMarkerIcon v-if="weathers.length === 0" class="h-8 w-8 text-purple-500 inline-block animate-bounce"/>
      <ClockIcon v-if="weathers.length === 0" class="h-8 w-8 text-purple-500 inline-block animate-bounce"/>
      <CloudIcon v-if="weathers.length === 0" class="h-8 w-8 text-purple-500 inline-block animate-bounce"/>
      <h1 v-if="weathers.length === 0" class="text-3xl font-semibold dark:text-white">Time & Weather</h1>
      <h4 v-if="weathers.length === 0" class="dark:text-white text-lg mb-2.5">Enter location to find out what's the date, time and weather there.</h4>
      <div class="search-box" :class="{'mb-3.5' : weathers.length != 0}">
        <div class="absolute inset-y-0 top-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon class="h-6 w-6 text-purple-400"> </SearchIcon>
        </div>
        <input 
        v-model="query" 
        @keypress="fetchWeather"
        type="text" 
        class="search-bar w-full border-2 border-purple-500 rounded-full p-1 " 
        placeholder="Search location.."/>
        <p v-if="query != ''" class="text-red-600 italic">{{ message }}</p>
        <small v-if="weathers.length != 0"><button class="clearBtn dark:text-white hover:underline" @click="clearLocation()">
          Clear all</button></small>
      </div>
      <small v-if="weathers.length === 0" class="dark:text-white italic">Example : New York</small>
      <br>
      <div class="weathers grid gap-3 lg:grid-cols-3 sm:grid-cols-1 ">
        
        <div class="p-2 w-full"
          v-for="( weatherItem, index ) in weathers" :key="index" stagger="50">
          <div class="weather-wrap shadow rounded-lg text-center p-8">
            <button class="transition transform hover:-translate-y-1 removeBtn bg-gray-400 text-white rounded-full hover:bg-gray-600 dark:bg-indigo-900 dark:hover:bg-gray-900" 
              @click="deleteLocation(index)">
              <XIcon class="h-4 w-4 text-white"/>
            </button>
            <div class="location-box text-left text-3xl dark:text-white font-bold justify-between">
              <div>
                <div class="location mb-4">
                  <LocationMarkerIcon class="h-8 w-8 text-purple-400"/>
                  {{ weatherItem.name }}<br> {{ weatherItem.country }}
                </div>
                <div class="date dark:text-white text-lg font-semibold text-left">
                    <CalendarIcon class="h-4 w-4 inline-block"/>
                    {{ weatherItem.datezone }} 
                    <br> 
                    <ClockIcon class="h-4 w-4 inline-block"/>
                    {{ weatherItem.timezone }}
                </div>
              </div>
               <img class="float-right h-32 w-32 bg-indigo-900" 
               :src="'https://openweathermap.org/img/w/'+weatherItem.icon+'.png'"/>
            </div>
            
            <div class="weather-box bg-slate-200 dark:bg-gray-400">
              
              <div class="weather-icon" >
                <div class="weather"> {{ weatherItem.weather }} </div>
              </div>
              {{  weatherItem.desc }}
              <div class="temp text-6xl mt-8 mb-4">
                {{ Math.round(weatherItem.temp) }} °C 
              </div>
              <div class="text-md">
                Feels like {{ Math.round(weatherItem.feels_like) }} °C </div>
              
            </div>
          </div>
        </div>
      </div>

    </main>
  </div>

</template>

<script>
import { ClockIcon, LocationMarkerIcon,XIcon,MoonIcon,SunIcon, SearchIcon, CloudIcon, CalendarIcon } from '@heroicons/vue/outline'
import moment from 'moment-timezone'
import { createPopper } from "@popperjs/core"
export default {
  name: 'app',
  data() {
    return {
      api_key: '207a1e6a9123b10b4ae0a07ca97f6692',
      url_base: 'http://api.openweathermap.org/data/2.5/',
      darkmode: false,
      query: '',
      weathers: [],
      message: '',
      tooltipMode: false,
    }
  },
  mounted() {
    document.title = 'Vue Time & Weather app';  
    for (const [i, value] of this.weathers) {
        console.log('%d: %s', i, value);
    }
    this.weathers.forEach(function(weather) {
      console.log(weather.name);
      // fetch( `${this.url_base}weather?q=${weather.name}&units=metric&APPID=${this.api_key}` )
      //     .then( response => {
      //         return response.json();   
      //         console.log(response.json());
      //         this.weathers.push(response);
      //     })
      // this.getAllData(weather.name);
    });
  },
  methods :{
    async getAllData(query) {
      try {
        const res = await fetch( `${this.url_base}weather?q=${query}&units=metric&APPID=${this.api_key}` );

        if (!res.ok) {
          // const message = `An error has occured: ${res.status} - ${res.statusText}`;
          const message = `${res.statusText}`;
          throw new Error(message);
        }

        const data = await res.json();
        this.locationResult(data);

        // const result = {
        //   status: res.status + "-" + res.statusText,
        //   headers: {
        //     "Content-Type": res.headers.get("Content-Type"),
        //     "Content-Length": res.headers.get("Content-Length"),
        //   },
        //   length: res.headers.get("Content-Length"),
        //   data: data,
        // };


        // this.getResult = this.fortmatResponse(result);
      } catch (err) {
        this.message = err.message;
      }
    },
    async fetchWeather ( e ) {
      if ( e.key == "Enter" && this.query ){
        this.getAllData(this.query);
        // fetch( `${this.url_base}weather?q=${this.query}&units=metric&APPID=${this.api_key}` )
        //   .then( response => {
        //       return response.json();   
        //   }).then( this.locationResult );
      }
    },
    getTimeZone(timezone){
      return moment().utcOffset(timezone).format("h.mm a");
    },
    getDateZone(timezone){
      let day = moment().utcOffset(timezone).format('dddd');
      let date = moment().utcOffset(timezone).format('Do MMMM YYYY');
      return `${day} ${date}`;
    },
    saveResult(result){
      let timezone = result.timezone / 60;
      this.weathers.push({ 
          name: result.name, 
          country: result.sys.country, 
          weather: result.weather[0].main,
          desc: result.weather[0].description,
          icon: result.weather[0].icon,
          temp: result.main.temp,
          feels_like: result.main.feels_like,
          timezone: this.getTimeZone(timezone),
          datezone: this.getDateZone(timezone),
        });
    },
    locationResult (result) {
      let repeated = this.weathers.some(e => e.name === result.name);
      if(result.main != 'undefined' && !repeated){
        let timezone = result.timezone / 60;
        this.weathers.push({ 
          name: result.name, 
          country: result.sys.country, 
          weather: result.weather[0].main,
          desc: result.weather[0].description,
          icon: result.weather[0].icon,
          temp: result.main.temp,
          feels_like: result.main.feels_like,
          timezone: this.getTimeZone(timezone),
          datezone: this.getDateZone(timezone),
        });
        this.query = '';
      }
      
    },
    deleteLocation (index){
      this.weathers.splice(index,1)
    },
    clearLocation (){
      this.weathers.splice(0)
    },
    darkMode(){
      this.darkmode = !this.darkmode;
    },
    toggleTooltipMode: function(){
      this.tooltipMode = !this.tooltipMode;
      if(this.tooltipMode){
        createPopper(this.$refs.btnModeRef, this.$refs.tooltipModeRef, {
          placement: "bottom"
        });
      }
    },
  },
  components: { ClockIcon,LocationMarkerIcon, XIcon, MoonIcon,SunIcon, SearchIcon, CloudIcon, CalendarIcon }
}
</script>
