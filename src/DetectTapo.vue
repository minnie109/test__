<script setup>
import { ref } from "vue";
/* 串畫面區 */
  /* 這個畫面會連到哪些畫面App 那邊怎麼定義，這邊要一樣 */
  const emit = defineEmits(['GoAddTapo','GoHome']);
  /* 內部函數定義 : 該畫面按鈕點擊後會觸發的函數 */
  function GoAddTapo(){
    emit('GoAddTapo');
  }
  function GoHome(){
    emit('GoHome');
  }
</script>
<template>
  <div class="偵測裝置container">
    <div class="返回">
        <img class="返回圖片" src="/icon/回上一頁.svg" @click="GoAddTapo"/>
    </div>
    <div class="文字">偵測到的 tp-link 裝置</div>
    <div class="品牌格">
      <div class="裝置格" @click="GoHome">
        <div class="TapoIcon">
          <img src="/icon/Plug.svg"/>
        </div>
        <div class="name區">
          <div class="name" >tp-link</div>
          <div class="name">P125M</div>
        </div>
      </div>
      <div class="裝置格" @click="GoHome">
        <div class="TapoIcon">
          <img src="/icon/燈條.svg"/>
        </div>
        <div class="name區">
          <div class="name" >tapo</div>
          <div class="name">L900</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.偵測裝置container{
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}
/* 當螢幕寬度大於或等於1024px（電腦螢幕）時，設定為50% */
@media (min-width: 1024px) {
  .偵測裝置container {
    width: 50vw; /* 將寬度改為50% */
    margin: 0 auto; /* 大框框的東西在中間 */
    left: 0;
    right: 0;
  }
}
.返回{
    display: flex;
    width: 100%;
    justify-content: flex-start;
    margin-top: 5%;
    margin-left: 5%;
    cursor: pointer;
}
.返回圖片:hover{
    transform: scale(1.3);

}
.文字{
    display: flex;
    width: 100%;
    justify-content: center;
    margin-top: 5%;
    font-size: 15px;
    color: #6D5D55;
    font-weight: bold;
}
.品牌格{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 30%;
    align-items: center;
    margin-top: 5%;
}
.裝置格{
    display: flex;
    flex-direction: row;
    width: 40%;
    height: 100%;
    justify-content: center;
    align-items: center;
    margin-left: 5%;
    margin-right: 5%;
    margin-top: 5%;
    background-color: #F1F1F1;
    border-radius: 10px;
    cursor: pointer;
}
.裝置格:hover{
    transform: scale(1.1);
    background-color: #e7e7e7;

}
.TapoIcon{
    display: flex;
    flex-direction: row;
    width: 20%;
    height: 100%;
    margin-left: 5%;
    justify-content: flex-start;
    align-items: center;
}
.name區{
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 15px;
    color: #6D5D55;
    font-weight: bold;
    width: 80%;
}
.name{
    display: flex;
    width: 100%;
    justify-content: center;
    font-size: 15px;
    color: #6D5D55;
    font-weight: bold;
    margin-top: 2%;
}
</style>
