<script setup>
  import { ref } from "vue";    
  /* 串畫面區 */
  /* 這個畫面會連到哪些畫面App 那邊怎麼定義，這邊要一樣 */
  const emit = defineEmits(['GoHome','GoChat','GoAccount','GoMode',
  'GoWork','GoGoOut','GoGoHomeMode','GoWakeup','GoSleep','GoEnergy']);
  /* 內部函數定義 : 該畫面按鈕點擊後會觸發的函數 */
  function GoHome(){
    emit('GoHome');
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

  let topShow = ref(true);
  let addIcon = ref(true);
  let modeframe = ref(true);
  let btn = ref(true);
  let bottomlist = ref(true);
  
</script>
  
<template>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <div class="我的最愛container">
    <!--頂部列表--> 
    <div class="我的最愛top" v-if="topShow">
      <div class="我的最愛標題" >我的最愛</div>
      <div class="我的最愛topButton" > 
        <img class="圖標" src="\icon\機器人.svg"  @click="GoChat" >
        <img class="圖標" src="\icon\使用者.svg"   @click="GoAccount">
      </div>
    </div>

   
    <footer>
        <div  class="我的最愛bottomList" style="position:fixed; bottom:0; ">
        <button class="icon" >
            <img src="/icon/我的最愛(點選後).svg" >
        </button>
        <button class="icon">
            <img src="/icon/裝置(點選前).svg" alt="square" @click="GoHome" >
        </button>
        <button class="icon">
            <img src="/icon/生活(點選前).svg" alt="clock" @click="GoMode" >
        </button>
        </div>
    </footer>
  </div>
</template>
  
<style scoped>
/*全頁面*/
.我的最愛container {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  }
/*--------------------------- */
/*頂部列表*/
.我的最愛top {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 10vh;
  background-color: #EAE0D7;
  display:flex;
  flex-direction: row;
  align-items: center;
}
.我的最愛標題{
  display: flex;
  flex-direction: row;
  width: 100%;
  font-size: 30px;
  font-weight: bold;
  padding-left: 5%;
} 
.我的最愛topButton{
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
/*------------------------------------- */
/*body區放所有裝置*/

.我的最愛body{
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
  .我的最愛body {
    width: 50vw; /* 將寬度改為50% */
    margin: 0 auto; /* 大框框的東西在中間 */
    left: 0;
    right: 0;
}
}
  .addicon{
    display: flex;
    justify-content: flex-start;
    border: none;
    outline: none;
    background-color: transparent;
    margin-top: -120px;
    margin-left: 10px;
    cursor: pointer;
      
    /*
    position: fixed;
    left: 10px; 
    bottom: 60px;
    */ 
    
  }
.我的最愛bottomList {
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
  
    
  .back{
    align-self: flex-start;
    border:none;
    outline: none;
    background-color:transparent;
    margin: 20px;
    font-size: 24px;
    cursor: pointer;
  }
    
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

  .btn {
    width: 85%;
    padding: 20px 20px;
    border:none;
    background-color:#A59C9C 40%;
    border-radius: 10px;
    display: flex; 
    margin-bottom: 10px;
    flex-grow: 1;
  }
  .left {
    flex: none;
    margin-right: 30px;
    vertical-align: middle;
  }
  .right {
    flex: auto;
    text-align: left;
    font-size: 16px;
  }
  .modeframe {
    display: flex;
    flex-direction: column;
    align-items: center;
    height:300px;
  }
  .modeframe1{
    display: flex;
    flex-direction: column;
    align-items: center;
    height:300px;

  }
  .schedule {
    width: 85%;
    padding: 20px 20px;
    display: flex;
    font-weight: bold;
    font-size: 16px;
  }
   
</style>