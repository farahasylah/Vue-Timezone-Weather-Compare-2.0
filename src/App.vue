<template>
  <div class="appcontent scroll-smooth p-8 pb-0" :class="{ 'dark' : darkmode }">
    <a class="modebtn hover:bg-black hover:text-white dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black transition-colors" 
    @click="darkMode" ref="btnModeRef" 
    v-on:mouseenter="toggleTooltipMode()" 
    v-on:mouseleave="toggleTooltipMode()" >
      <MoonIcon v-if="!darkmode" class="h-4 w-4 text-grey-400"/>
      <SunIcon v-else class="h-4 w-4 text-white-400"/>
      mode
    </a>
    <div ref="tooltipModeRef" class="tooltip bg-black block z-50 text-sm max-w-xs text-left break-words rounded-lg"
    :class="{ 'hidden': !tooltipMode, 'block': tooltipMode, 'bg-black' : !darkmode, 'bg-white' : darkmode }" >
      <div class="p-2" :class="{ 'text-black' : darkmode, 'text-white' : !darkmode }">
        {{ darkmode ? 'Light' : 'Dark' }} mode
      </div>
    </div>

    <main class="pb-0" :class="{ 'initial' : weathers.length === 0}">
      <template v-if="weathers.length === 0">
        <LocationMarkerIcon class="h-8 w-8 text-sky-600 inline-block animate-bounce"/>
        <ClockIcon class="h-8 w-8 text-sky-600 inline-block animate-bounce"/>
        <CloudIcon class="h-8 w-8 text-sky-600 inline-block animate-bounce"/>
        <h1 class="text-3xl font-bold dark:text-white">
          Time & Weather
        </h1>
        <h4 class="dark:text-white text-lg mb-2.5">
          Enter location to find out what's the date, time and weather there.</h4>
      </template>

      <p v-if="query != ''" class="text-red-600 italic">
        {{ message }}
      </p>
      
      <div class="search-box" :class="{ 'mb-3.5' : weathers.length != 0 }">
        <div class="absolute inset-y-0 top-0 left-0 flex items-center p-1 pl-3 pointer-events-none">
            <SearchIcon class="h-6 w-6 text-sky-600"/>
        </div>
        <input type="text" 
          v-model="query" 
          @keypress="fetchLocation"
          class="search-bar w-full border-2 border-sky-600 rounded-full p-1" 
          :placeholder="weathers.length >= 1 ? 'Search more location..' : 'Search location..'"/>
        <small v-if="weathers.length != 0">
          <button class="clearBtn dark:text-white hover:underline" @click="clearAllLocation()">
            Clear all
          </button>
        </small>
        <div class="locResults absolute top-full left-0 w-full z-20 flex justify-center" 
        :class="{ 'pr-16' : weathers.length > 0 }" 
        v-if="query">
          <div class="block w-4/5 bg-white shadow rounded-bl-md rounded-br-md text-center">
            <a class="block p-1.5 hover:bg-sky-200 cursor-pointer"
            v-for="( loc,index ) in suggestedLocation" :key="index" 
            @click="searchbyName( loc )">
              <span>
                {{ loc.name ? loc.name : ''}}
                {{ loc.state ? '- ' + loc.state : ''}}
                {{ loc.country ? ', ' + loc.country : ''}}
              </span>
            </a>
          </div>
        </div>
      </div>

      <small v-if="weathers.length === 0" class="dark:text-white italic">
        Example : London
      </small>
      <br>
      <div class="weathers grid gap-2 lg:gap-3 justify-items-center place-content-center grid-cols-1 lg:grid-cols-3" :class="{ 'lg:grid-cols-1': weathers.length === 1, 'lg:grid-cols-2': weathers.length === 2 }">
        <div class="p-2 " :class="{ 'w-full': weathers.length >= 2 }"
        v-for="( weatherItem, index ) in weathers" :key="index">
          <div class="weather-wrap shadow rounded-lg text-center p-6 md:p-8 md:pb-2">
            <button class="removeBtn transition transform hover:-translate-y-1 bg-gray-400 text-white rounded-full hover:bg-gray-600 dark:bg-indigo-900 dark:hover:bg-gray-900 z-10" 
              @click="deleteLocation( index )">
              <XIcon class="h-4 w-4 text-white"/>
            </button>
            <WeatherBox :darkmode="darkmode" :weatherItem="weatherItem"/>
          </div>
        </div>
      </div>
    </main>
  </div>

</template>

<script>
import { ClockIcon, LocationMarkerIcon,XIcon,MoonIcon,SunIcon, SearchIcon, CloudIcon } from '@heroicons/vue/outline'
import moment from 'moment-timezone'
import { createPopper } from "@popperjs/core"
import WeatherBox from './components/WeatherBox.vue'
export default {
  name: 'app',
  data() {
    return {
      api_key: '',
      url_base: 'http://api.openweathermap.org/data/2.5/',
      loc_base: 'http://api.openweathermap.org/geo/1.0/',
      darkmode: false,
      query: '',
      suggestion: [],
      weathers: [],
      message: '',
      tooltipMode: false,
    }
  },
  mounted() {
    document.title = 'Vue Time & Weather app';  
  },
  computed: {
    suggestedLocation() {
      return this.suggestion.length > 0 ? this.suggestion : 0
    },
  },
  methods :{
    async searchbyName( loc ) {
      if ( this.query ){
        try {
          let locQuery = loc.name + ( loc.state ? ',' + loc.state : '' ) + ',' + loc.country;
          locQuery = locQuery.split( " " ).join( "+" );
          const res = await fetch( `${ this.url_base }weather?q=${ locQuery }&units=metric&APPID=${ this.api_key }` );
          if ( !res.ok ) {
            this.searchbyLoc( loc );
          }
          const data = await res.json()
          if( loc.country != data.sys.country ){
            this.searchbyLoc( loc );
          }
          else{
            this.locationResult( data );
          }
        } catch ( err ) {
          return 0;
        }
      }
    },
    async searchbyLoc( loc ) {
      if ( this.query ){
        try {
          const res = await fetch( `${ this.url_base }weather?lat=${ loc.lat }&lon=${ loc.lon }&units=metric&APPID=${ this.api_key }` );
          if ( !res.ok ) {
            const message = `${res.statusText}`;
            throw new Error( message );
          }
          else{
            let data = await res.json();
            if( loc.name != data.name ){
              data["nearby"] = { "name" : loc.name, "state" : loc.state, "country" : loc.country};
            }
              this.locationResult( data );
          }
          
        } catch ( err ) {
          this.message = err.message;
        }
      }
    },
    async fetchLocation ( e ) {
      if ( e.key == "Enter" || this.query ){
        this.suggestion = [];
        this.message = '';
        this.query.replace(/ /g,"+");
          try {
            const res = await fetch( `${ this.loc_base }direct?q=${ this.query }&limit=5&appid=${ this.api_key }` );
            if ( !res.ok ) {
              const message = `${ res.statusText }`;
              throw new Error( message );
            }
            else{
              const data = await res.json();
              if( data.length != 0 ){
                this.suggestion.push( data );
                this.suggestion = this.suggestion[0];
              }
            }
          } catch ( err ) {
            // this.message = err.message;
          }
        
      }
    },
    getTime( time ){
      let date = new Date( time * 1000 );
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    getTimeZone( timezone ){
      return moment().utcOffset(timezone).format( "h.mm a" );
    },
    getDateZone( timezone ){
      let day = moment().utcOffset( timezone ).format( 'dddd' );
      let date = moment().utcOffset( timezone ).format( 'Do MMMM YYYY' );
      return `${ day } ${ date }`;
    },
    locationResult ( result ) {
      let repeated = this.weathers.some( e => e.name === result.name );
      if( result.main != 'undefined' && !repeated ){
        let timezone = result.timezone / 60;
        this.weathers.push({ 
          name: result.name, 
          country: result.sys.country,
          state: result.sys.state,
          weather: result.weather[0].main,
          desc: result.weather[0].description,
          icon: result.weather[0].icon,
          temp: result.main.temp,
          feels_like: result.main.feels_like,
          humidity: result.main.humidity,
          wind: result.wind.speed,
          timezone: this.getTimeZone( timezone ),
          datezone: this.getDateZone( timezone ),
          sunrise: this.getTime( result.sys.sunrise ),
          sunset: this.getTime( result.sys.sunset ),
          nearby_name : result.nearby ? result.nearby.name : '',
          nearby_state : result.nearby ? result.nearby.state : '', 
          nearby_country : result.nearby ? result.nearby.country : '',
        });
        this.query = '';
      }
    },
    deleteLocation( index ){
      this.weathers.splice( index,1 )
    },
    clearAllLocation(){
      this.weathers.splice(0)
    },
    darkMode(){
      this.darkmode = !this.darkmode;
    },
    toggleTooltipMode: function(){
      this.tooltipMode = !this.tooltipMode;
      if( this.tooltipMode ){
        createPopper( this.$refs.btnModeRef, this.$refs.tooltipModeRef, {
          placement: "bottom"
        });
      }
    },
  },
  components: { ClockIcon,LocationMarkerIcon, XIcon, MoonIcon,SunIcon, SearchIcon, CloudIcon, WeatherBox}
}
</script>
