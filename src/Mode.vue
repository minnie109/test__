<script setup>
  import { ref } from "vue";    
  /* 串畫面區 */
  /* 這個畫面會連到哪些畫面App 那邊怎麼定義，這邊要一樣 */
  const emit = defineEmits(['GoHome','GoChat','GoAccount','GoMode', 'GoFavorite',
  'GoWork','GoGoOut','GoGoHomeMode','GoWakeup','GoSleep','GoEnergy']);
  /* 內部函數定義 : 該畫面按鈕點擊後會觸發的函數 */
  function GoHome(){
    emit('GoHome');
  }
  function GoFavorite(){
    emit('GoFavorite');
  }
  function GoMode(){
    emit('GoMode');
  }
  function GoChat(){
    emit('GoChat');
  }
  function GoAccount(){
    emit('GoAccount');
  }
  
  function GoWork(){
    emit('GoWork');
  }
  function GoGoOut(){
    emit('GoGoOut');
  }
  function GoGoHomeMode(){
    emit('GoGoHomeMode');
  }
  function GoWakeup(){
    emit('GoWakeup');
  }
  function GoSleep(){
    emit('GoSleep');
  }
  function GoEnergy(){
    emit('GoEnergy');
  }
 
  const buttonStates = ref({
  work: 'default',
  goOut: 'default',
  goHome: 'default',
  energy: 'default',
  sleep: 'default',
  wakeup: 'default',
});

function handleClick(buttonName) {
  // 將對應按鈕設置為 loading 狀態
  buttonStates.value[buttonName] = 'loading';
  
   // 模擬操作完成後，設置為 success 狀態
   setTimeout(() => {
    buttonStates.value[buttonName] = 'success';

    // 再等 2 秒後恢復為 default 狀態
    setTimeout(() => {
      buttonStates.value[buttonName] = 'default';
    }, 2000); // 勾勾顯示 2 秒後回到啟用狀態
  }, 2000); // 加載狀態持續 2 秒
}

</script>
  
<template>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <div class="自動化container">
    <!--頂部列表-->
    <div class="自動化top">
      <div class="自動化標題" >自動化操作</div>
      <div class="自動化topButton" >
        <img class="圖標" src="/icon/機器人.svg"  @click="GoChat" >
        <img class="圖標" src="/icon/使用者.svg"  @click="GoAccount">
      </div>
    </div>

    <div class="自動化body">    
      <div class="所有模式modeframe">
        <div class="模式塊區">
          <div class="模式塊" @click="triggerTemporaryColorChange">
            <img src="/icon/工作模式.svg" alt="work" class="left" @click="工作模式">
            <span class="right">工作</span>
            <div class="啟動區">
              <button @click="handleClick('work')" :class="buttonStates.work" class="animated-button">
                <span v-if="buttonStates.work === 'default'">啟動</span>
                <span v-if="buttonStates.work === 'loading'" class="loader"></span>
                <span v-if="buttonStates.work === 'success'" class="checkmark">✔</span>
              </button>
              <img class="rightIcon" src="/icon/arrow right.svg" @click="GoWork">
            </div>
            
          </div>
          <div class="模式塊" @click="triggerTemporaryColorChange">
            <img src="/icon/出門模式.svg" alt="goout" class="left">
            <span class="right">出門</span>
            <div class="啟動區">
              <button @click="handleClick('goOut')" :class="buttonStates.goOut" class="animated-button">
                <span v-if="buttonStates.goOut === 'default'">啟動</span>
                <span v-if="buttonStates.goOut === 'loading'" class="loader"></span>
                <span v-if="buttonStates.goOut === 'success'" class="checkmark">✔</span>
              </button>
              <img class="rightIcon" src="/icon/arrow right.svg" @click="GoGoOut">
            </div>
          </div>
          <div class="模式塊" @click="triggerTemporaryColorChange">
            <img src="/icon/回家模式.svg" alt="home" class="left">
            <span class="right">回家</span>
            <div class="啟動區">
              <button @click="handleClick('goHome')" :class="buttonStates.goHome" class="animated-button">
                <span v-if="buttonStates.goHome === 'default'">啟動</span>
                <span v-if="buttonStates.goHome === 'loading'" class="loader"></span>
                <span v-if="buttonStates.goHome === 'success'" class="checkmark">✔</span>
              </button>
              <img class="rightIcon" src="/icon/arrow right.svg"@click="GoGoHomeMode" >
            </div>
           
          </div>
          <div class="模式塊" @click="triggerTemporaryColorChange">
            <img src="/icon/節能模式.svg" class="left">
            <span class="right">節能模式</span>
            <div class="啟動區">
              <button @click="handleClick('energy')" :class="buttonStates.energy" class="animated-button">
                <span v-if="buttonStates.energy === 'default'">啟動</span>
                <span v-if="buttonStates.energy === 'loading'" class="loader"></span>
                <span v-if="buttonStates.energy === 'success'" class="checkmark">✔</span>
              </button>
              <img class="rightIcon" src="/icon/arrow right.svg" @click="GoEnergy">
            </div>
          </div>
          <div class="模式塊" @click="triggerTemporaryColorChange">
            <img src="/icon/睡眠模式.svg" class="left">
            <span class="right">睡眠模式</span>
            <div class="啟動區">
              <button @click="handleClick('sleep')" :class="buttonStates.sleep" class="animated-button">
                <span v-if="buttonStates.sleep === 'default'">啟動</span>
                <span v-if="buttonStates.sleep === 'loading'" class="loader"></span>
                <span v-if="buttonStates.sleep === 'success'" class="checkmark">✔</span>
              </button>
              <img class="rightIcon" src="/icon/arrow right.svg" @click="GoSleep">
            </div>
          </div>
          <div class="模式塊" @click="triggerTemporaryColorChange">
            <img src="/icon/起床模式.svg" class="left">
            <span class="right">起床模式</span>
            <div class="啟動區">
              <button @click="handleClick('wakeup')" :class="buttonStates.wakeup" class="animated-button">
                <span v-if="buttonStates.wakeup === 'default'">啟動</span>
                <span v-if="buttonStates.wakeup === 'loading'" class="loader"></span>
                <span v-if="buttonStates.wakeup === 'success'" class="checkmark">✔</span>
              </button>
              <img class="rightIcon" src="/icon/arrow right.svg" @click="GoWakeup">
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer>
      <div class="自動化bottomList" style="position:fixed; bottom:0; ">
        <button class="icon" @click="GoFavorite">
          <img src="/icon/我的最愛(點選前).svg" >
        </button>
        <button class="icon">
          <img src="/icon/裝置(點選前).svg" alt="square" @click="GoHome" >
        </button>
        <button class="icon">
          <img src="/icon/生活(點選後).svg" alt="clock" @click="GoMode" >
        </button>
      </div>
    </footer>
  </div>
  
</template>
  
<style scoped>
/*全頁面*/
.自動化container {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}
/* -------------------------------- */
/*頂部列表*/
.自動化top {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 10vh;
  background-color: #EAE0D7;
  display:flex;
  flex-direction: row;
  align-items: center;
}
.自動化標題{
  display: flex;
  flex-direction: row;
  width: 100%;
  font-size: 30px;
  font-weight: bold;
  padding-left: 5%;
} 
.自動化topButton{
  display: flex;
  flex-direction: row;
  width:50%;
  justify-content: flex-end;
  margin-right: 6%;
  gap:5%;
 }
 .圖標{
  cursor: pointer;
}
.圖標:hover{
  transform: scale(1.2);
}
/*------------------------------ */
/*body區放所有裝置*/
.自動化body{
  /*將中間部分位置固定從頂部列表的底到底部列表的頂*/
  position: fixed;
  top: 10vh;
  bottom: 8vh;
  /* height : 已經用上面絕對位置定位過了 所以不用再調整 */
  /* width : 繼承父容器的100%寬度 */
  width: 100%;
  /* 設定裡面子容器排列方式 */
  display: flex;
  flex-direction: column;
}
/* 當螢幕寬度大於或等於1024px（電腦螢幕）時，設定為50% */
@media (min-width: 1024px) {
  .自動化body {
    width: 50vw; /* 將寬度改為50% */
    margin: 0 auto; /* 大框框的東西在中間 */
    left: 0;
    right: 0;
  }
}

/*------------------------------------------ */
/* 中間區 */
.所有模式modeframe {
    display: flex;
    flex-direction: column;
    height:100%;
    width: 100%;
    margin-bottom: 3%;
    margin-top: 3%;
    
}
.模式塊區{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 85%;
  /* 5 是精挑細選過的數字 */
  margin-top: 5%;
}

/* 小標題 */
.schedule {
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-left: 5%;
  font-weight: bold;
  font-size: 16px;
}
.模式塊 {
  display: flex; 
  flex-direction: row;
  width: 90%;
  margin-left: 5%;
  margin-right: 5%;
  margin-bottom: 3%;
  /* 20是方塊的高度 : 精挑細選的數字 */
  height: 20%;
  background-color:#BBBBBB;
  border-radius: 10px;
  cursor: pointer;
  justify-content: flex-start;
  align-items: center;
}
.模式塊.active {
  background-color: #FCF2DF;
}

/* 模式塊icon */
.left {
  /* 利用高度控制icon大小 */
  /* 60是精挑細選的數字 */
  height: 60%;
  margin-left: 3%;
}
.right {
  margin-left:3%;
  font-weight: bold;
  font-size: 16px;
}
.啟動區 {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 20%;
  margin-left: auto;
  margin-right: 3%;
  justify-content: space-between;
}
/* 更多箭頭 : margin-left: auto; 靠右 */
.rightIcon{
  margin-right: 3%;
  cursor: pointer;
  /* 利用高度控制icon大小 */
  /* 30是精挑細選的數字 */
}

.rightIcon:hover{
  transform: scale(1.3);
}

/* 啟用按鈕 */
.animated-button {
  position: relative;
  width: 50px;
  height: 50px;
  border: none;
  color: rgb(56, 49, 49);
  font-size: 16px;
  font-weight: bold;
  border-radius: 50%;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.animated-button .loader {
  width: 20px;
  height: 20px;
  border: 3px solid white;
  border-top: 3px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.checkmark {
  font-size: 20px;
}

/* 狀態變化的樣式 */
.default {
  background-color: #D9D9D9;
}

.loading {
  background-color: #D9D9D9;
}

.success {
  background-color: #F3EBEB;
}
/*--------------------------------------------- */
/*底部列表*/
.自動化bottomList {
  position: fixed;
  bottom: 0;
  width:100vw;
  /* 8是精挑細選過的數字! */
  height: 8vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-bottom: 2%;
  padding: 2%;
  background-color: #EAE0D7;
  justify-content:space-evenly;
  }
/* 底部列表icon */
.icon {
    border:none;
    outline: none;
    background-color: transparent;
    margin:10px;
    width: 30px;
    height:30px;
    cursor: pointer;
}
.icon:hover{ 
  transform: scale(1.1);
}
  
   
</style>