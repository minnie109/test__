<script setup>
import { ref } from 'vue';

import LogIn from "./LogIn.vue";
import home from "./home.vue";
import Register from './Register.vue';
import Chat from './Chat.vue';
import Account from './Account.vue';
import Shortcut from './Shortcut.vue';

import Favorite from './Favorite.vue';
import Mode from './Mode.vue';

import LedHistory from './LedHistory.vue';
import LedAutomationList from './LedAutomationList.vue';
import LedAutomation from './LedAutomation.vue';
import LedHistoryFull from './LedHistoryFull.vue';

import BuldHistory from './BuldHistory.vue';
import BuldAutomationList from './BuldAutomationList.vue';
import BuldAutomation from './BuldAutomation.vue';
import BuldHistoryFull from './BuldHistoryFull.vue';

import TuyaPlugHistory from './TuyaPlugHistory.vue';
import TuyaPlugAutomationList from './TuyaPlugAutomationList.vue';
import TuyaPlugAutomation from './TuyaPlugAutomation.vue';
import TuyaPlugHistoryFull from './TuyaPlugHistoryFull.vue';

import TapoPlugHistory from './TapoPlugHistory.vue';
import TapoPlugAutomationList from './TapoPlugAutomationList.vue';
import TapoPlugAutomation from './TapoPlugAutomation.vue';
import TapoPlugHistoryFull from './TapoPlugHistoryFull.vue';

import SensorDoorHistory from './SensorDoorHistory.vue';
import SensorDoorAutomationList from './SensorDoorAutomationList.vue';
import SensorDoorAutomation from './SensorDoorAutomation.vue';
import SensorDoorHistoryFull from './SensorDoorHistoryFull.vue';

import SensorWeatherHistory from './SensorWeatherHistory.vue';
import SensorWeatherAutomationList from './SensorWeatherAutomationList.vue';
import SensorWeatherAutomation from './SensorWeatherAutomation.vue';
import SensorWeatherHistoryFull from './SensorWeatherHistoryFull.vue';          

import AddTapo from './AddTapo.vue';
import DetectTapo from './DetectTapo.vue';
import AllHistory from './AllHistory.vue';

import Work from './Work.vue';
import GoOut from './GoOut.vue';
import GoHomeMode from './GoHomeMode.vue';
import Energy from './Energy.vue';
import Sleep from './Sleep.vue';
import Wakeup from './Wakeup.vue';

// 定義一個 ref 變數，用來存放當前顯示的畫面名稱
const activeScreen = ref('LogIn'); // 預設顯示 login 畫面

/* Function to set the active screen */
function setActiveScreen(screenName) {
  activeScreen.value = screenName;
}

</script>
<template>
    <!-- 使用 activeScreen.value 決定顯示的畫面 -->
    <LogIn v-if="activeScreen === 'LogIn'" 
           @GoRegister="setActiveScreen('Register')" @GoHome="setActiveScreen('home')" />  
    <Register v-if="activeScreen === 'Register'" 
              @GoLogIn="setActiveScreen('LogIn')" />   
    <home v-if="activeScreen === 'home'"  
          @GoChat="setActiveScreen('Chat')" 
          @GoAccount="setActiveScreen('Account')" 
          @GoFavorite="setActiveScreen('Favorite')"
          @GoMode="setActiveScreen('Mode')" 
          @GoLedHistory="setActiveScreen('LedHistory')"
          @GoBuldHistory="setActiveScreen('BuldHistory')"
          @GoTuyaPlugHistory="setActiveScreen('TuyaPlugHistory')"
          @GoTapoPlugHistory="setActiveScreen('TapoPlugHistory')"
          @GoSensorDoorHistory="setActiveScreen('SensorDoorHistory')"
          @GoSensorWeatherHistory="setActiveScreen('SensorWeatherHistory')"
          @GoAddTapo="setActiveScreen('AddTapo')"
          @GoAllHistory="setActiveScreen('AllHistory')"/>
          

      <Chat v-if="activeScreen === 'Chat'" 
          @GoShortcut="setActiveScreen('Shortcut') "
          @GoHome="setActiveScreen('home')" /> 
    <Shortcut v-if="activeScreen === 'Shortcut'"
              @GoChat="setActiveScreen('Chat')"/>
    <Account v-if="activeScreen === 'Account'"
             @GoLogIn="setActiveScreen('LogIn')"
             @GoHome="setActiveScreen('home')" />

    <Favorite v-if="activeScreen === 'Favorite'"
              @GoHome="setActiveScreen('home')"
              @GoMode="setActiveScreen('Mode')" 
              @GoChat="setActiveScreen('Chat')" 
              @GoAccount="setActiveScreen('Account')" />
    
    <LedHistory v-if="activeScreen === 'LedHistory'"
          @GoHome="setActiveScreen('home')"
          @GoLedAutomationList="setActiveScreen('LedAutomationList')"
          @GoLedHistoryFull="setActiveScreen('LedHistoryFull')"/>
    <LedAutomationList v-if="activeScreen === 'LedAutomationList'"
          @GoLedHistory="setActiveScreen('LedHistory')"
          @GoLedAutomation="setActiveScreen('LedAutomation')"/>
    <LedAutomation v-if="activeScreen === 'LedAutomation'"
          @GoLedAutomationList="setActiveScreen('LedAutomationList')"/>
    <LedHistoryFull v-if="activeScreen === 'LedHistoryFull'"
      @GoLedHistory="setActiveScreen('LedHistory')"/>

      <BuldHistory v-if="activeScreen === 'BuldHistory'"
          @GoHome="setActiveScreen('home')"
          @GoBuldAutomationList="setActiveScreen('BuldAutomationList')"
          @GoBuldHistoryFull="setActiveScreen('BuldHistoryFull')"/>
      <BuldAutomationList v-if="activeScreen === 'BuldAutomationList'"
          @GoBuldHistory="setActiveScreen('BuldHistory')"
          @GoBuldAutomation="setActiveScreen('BuldAutomation')"/>
      <BuldAutomation v-if="activeScreen === 'BuldAutomation'"
          @GoBuldAutomationList="setActiveScreen('BuldAutomationList')"/>
      <BuldHistoryFull v-if="activeScreen === 'BuldHistoryFull'"
          @GoBuldHistory="setActiveScreen('BuldHistory')"/>

     <TuyaPlugHistory v-if="activeScreen === 'TuyaPlugHistory'"
          @GoHome="setActiveScreen('home')"
          @GoTuyaPlugAutomationList="setActiveScreen('TuyaPlugAutomationList')"
          @GoTuyaPlugHistoryFull="setActiveScreen('TuyaPlugHistoryFull')"/>
      <TuyaPlugAutomationList v-if="activeScreen === 'TuyaPlugAutomationList'"
          @GoTuyaPlugHistory="setActiveScreen('TuyaPlugHistory')"
          @GoTuyaPlugAutomation="setActiveScreen('TuyaPlugAutomation')"/>
      <TuyaPlugAutomation v-if="activeScreen === 'TuyaPlugAutomation'"
          @GoTuyaPlugAutomationList="setActiveScreen('TuyaPlugAutomationList')"/>
      <TuyaPlugHistoryFull v-if="activeScreen === 'TuyaPlugHistoryFull'"      
          @GoTuyaPlugHistory="setActiveScreen('TuyaPlugHistory')"/>

      <TapoPlugHistory  v-if="activeScreen === 'TapoPlugHistory'"
          @GoHome="setActiveScreen('home')"
          @GoTapoPlugAutomationList="setActiveScreen('TapoPlugAutomationList')"
          @GoTapoPlugHistoryFull="setActiveScreen('TapoPlugHistoryFull')"/> 
      <TapoPlugAutomationList v-if="activeScreen === 'TapoPlugAutomationList'"
            @GoTapoPlugHistory="setActiveScreen('TapoPlugHistory')"
          @GoTapoPlugAutomation="setActiveScreen('TapoPlugAutomation')"/>
      <TapoPlugAutomation v-if="activeScreen === 'TapoPlugAutomation'"
            @GoTapoPlugAutomationList="setActiveScreen('TapoPlugAutomationList')"/>   
      <TapoPlugHistoryFull v-if="activeScreen === 'TapoPlugHistoryFull'"
          @GoTapoPlugHistory="setActiveScreen('TapoPlugHistory')"/>

      <SensorDoorHistory v-if="activeScreen === 'SensorDoorHistory'"
          @GoHome="setActiveScreen('home')"
          @GoSensorDoorAutomationList="setActiveScreen('SensorDoorAutomationList')"
          @GoSensorDoorHistoryFull="setActiveScreen('SensorDoorHistoryFull')"/>

      <SensorDoorAutomationList v-if="activeScreen === 'SensorDoorAutomationList'"
              @GoSensorDoorHistory="setActiveScreen('SensorDoorHistory')"
              @GoSensorDoorAutomation="setActiveScreen('SensorDoorAutomation')"/>
      <SensorDoorAutomation v-if="activeScreen === 'SensorDoorAutomation'"
                  @GoSensorDoorAutomationList="setActiveScreen('SensorDoorAutomationList')"/>
      <SensorDoorHistoryFull v-if="activeScreen === 'SensorDoorHistoryFull'"
            @GoSensorDoorHistory="setActiveScreen('SensorDoorHistory')"/>


      <SensorWeatherHistory v-if="activeScreen === 'SensorWeatherHistory'"    
          @GoHome="setActiveScreen('home')"
          @GoSensorWeatherAutomationList="setActiveScreen('SensorWeatherAutomationList')"
          @GoSensorWeatherHistoryFull="setActiveScreen('SensorWeatherHistoryFull')"/>
      <SensorWeatherAutomationList v-if="activeScreen === 'SensorWeatherAutomationList'"
              @GoSensorWeatherHistory="setActiveScreen('SensorWeatherHistory')"
              @GoSensorWeatherAutomation="setActiveScreen('SensorWeatherAutomation')"/>
      <SensorWeatherAutomation v-if="activeScreen === 'SensorWeatherAutomation'"
                  @GoSensorWeatherAutomationList="setActiveScreen('SensorWeatherAutomationList')"/>
      <SensorWeatherHistoryFull v-if="activeScreen === 'SensorWeatherHistoryFull'"
            @GoSensorWeatherHistory="setActiveScreen('SensorWeatherHistory')"/>

    <Mode v-if="activeScreen === 'Mode'"
          @GoFavorite="setActiveScreen('Favorite')"
          @GoHome="setActiveScreen('home')"
          @GoWork="setActiveScreen('Work')"
          @GoGoOut="setActiveScreen('GoOut')"
          @GoGoHomeMode="setActiveScreen('GoHomeMode')"
          @GoEnergy="setActiveScreen('Energy')"
          @GoSleep="setActiveScreen('Sleep')"
          @GoWakeup="setActiveScreen('Wakeup')"
          @GoChat="setActiveScreen('Chat')" 
          @GoAccount="setActiveScreen('Account')" />
    

    <Work v-if="activeScreen === 'Work'"
          @GoMode="setActiveScreen('Mode')"/>
    <GoOut v-if="activeScreen === 'GoOut'"
    @GoMode="setActiveScreen('Mode')"/>
    <GoHomeMode v-if="activeScreen === 'GoHomeMode'"
    @GoMode="setActiveScreen('Mode')"/>
    <Energy v-if="activeScreen === 'Energy'"
    @GoMode="setActiveScreen('Mode')"/>
    <Sleep v-if="activeScreen === 'Sleep'"
    @GoMode="setActiveScreen('Mode')"/>
    <Wakeup v-if="activeScreen === 'Wakeup'"
    @GoMode="setActiveScreen('Mode')"/>      
    
    <AddTapo v-if="activeScreen === 'AddTapo'"
      @GoDetectTapo="setActiveScreen('DetectTapo')"
      @GoHome="setActiveScreen('home')"/>
      
    <DetectTapo v-if="activeScreen === 'DetectTapo'"
      @GoAddTapo="setActiveScreen('AddTapo')"
      @GoHome="setActiveScreen('home')"/>
    
      <AllHistory v-if="activeScreen === 'AllHistory'"
      @GoHome="setActiveScreen('home')"
      @GoBuldHistoryFull="setActiveScreen('BuldHistoryFull')"
      @GoLedHistoryFull="setActiveScreen('LedHistoryFull')"
      @GoTuyaPlugHistoryFull="setActiveScreen('TuyaPlugHistoryFull')"
      @GoTapoPlugHistoryFull="setActiveScreen('TapoPlugHistoryFull')"
      @GoSensorDoorHistoryFull="setActiveScreen('SensorDoorHistoryFull')"
      @GoSensorWeatherHistoryFull="setActiveScreen('SensorWeatherHistoryFull')"/>
    </template>          
              
