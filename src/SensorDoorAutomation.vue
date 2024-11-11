<script setup>
import { ref,onUnmounted } from 'vue';
import Timepicker from 'vue3-timepicker';
import 'vue3-timepicker/dist/VueTimepicker.css';
/* 串畫面區 */
  /* 這個畫面會連到哪些畫面App 那邊怎麼定義，這邊要一樣 */
  const emit = defineEmits(['GoLedAutomationList']);
  /* 內部函數定義 : 該畫面按鈕點擊後會觸發的函數 */
  function GoLedAutomationList(){
    emit('GoLedAutomationList');
  }


const 時間展開 = ref(false);
function 時間展開功能(){
    時間展開.value = !時間展開.value;
    設備展開.value = false;
}
const 設備展開 = ref(false);
function 設備展開功能(){
    設備展開.value = !設備展開.value;
    時間展開.value = false;
}
//設定條件裝置(預設智慧燈條)
const selectedDeviceUp = ref('燈泡');



//設定裝置狀態
const 開啟active = ref(false);
const 關閉active = ref(false);
function 開關(mode) {
  if (mode === '開啟') {
    開啟active.value = true;
    關閉active.value = false;
  } else if (mode === '關閉') {
    開啟active.value = false;
    關閉active.value = true;
  }
}
const 動作開啟active = ref(false);
const 動作關閉active = ref(false);
function 動作開關(mode) {
  if (mode === '開啟') {
    動作開啟active.value = true;
    動作關閉active.value = false;
  } else if (mode === '關閉') {
    動作開啟active.value = false;
    動作關閉active.value = true;
  }
}
/* 控制模式塊 有或沒有的變數 */
const 日active = ref(true);
const 一active = ref(true);
const 二active = ref(true);
const 三active = ref(true);
const 四active = ref(true);
const 五active = ref(true);
/* 控制模式塊 有或沒有的函數 */
function toggleActive(mode) {
  switch(mode) {
    case '日':
    日active.value = !日active.value;
      break;
    case '一':
    一active.value = !一active.value;
      break;
    case '二':
    二active.value = !二active.value;
      break;
    case '三':
    三active.value = !三active.value;
      break;
    case '四':
    四active.value = !四active.value;
      break;
    case '五':
    五active.value = !五active.value;
      break;
  }
}

/* 時間 */
const selectedTime = ref(null);
/* */
const hours = ref(0);
const minutes = ref(0);
const remainingTime = ref(null); // 倒計時的剩餘秒數
let timer = null; // 用於存儲計時器 ID

const startCountdown = () => {
  // 計算初始秒數
  remainingTime.value = hours.value * 3600 + minutes.value * 60;
  
  if (timer) clearInterval(timer); // 清除先前的計時器

  // 啟動計時器
  timer = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value -= 1;
    } else {
      clearInterval(timer);
      timer = null;
      alert('倒計時結束！');
    }
  }, 1000);
};

// 格式化時間
const formatTime = (seconds) => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

// 清理計時器
onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>
<template>
    <div class="燈泡自動化container">
        <div class="top標">
            <div class="topIcon">
                <img class="上一頁" src="/icon/回上一頁.svg" @click="GoLedAutomationList">
                <img class="門窗感應器icon" src="/icon/門窗感應器.svg">
            </div>
            <div @click="GoLedAutomationList" class="text">儲存</div>
        </div>
        <div class="條件區">
            <div class="條件塊" >
                <div class="左">
                    <img src="/icon/加號.svg">
                    <div class="條件塊裡面字">條件</div>
                </div>
            </div>
            <div class="時間設備格">
                <div class="時間設備塊" 
                    :class="{ '展開顏色': 時間展開 }">
                    <img class="日曆icong上" src="/icon/日曆.svg">
                    <div class="text"> 排程</div>
                    <img class="燈泡icon" src="/icon/下拉箭頭.svg"  @click="時間展開功能">
                </div>
                <div class="時間設備塊"
                    :class="{ '展開顏色': 設備展開 }">
                    <img src="/icon/黑色設備.svg">
                    <div class="text"> 設備</div>
                    <img class="燈泡icon" src="/icon/下拉箭頭.svg" @click="設備展開功能">
                </div>
            </div>
            <div class="時間區" >
                <div class="展開塊" v-if="時間展開">
                    <img class="日曆icon" src="/icon/日曆.svg">
                    <Timepicker  v-model="selectedTime" format="HH:mm" />
                    <div class="週期">
                        <div
                        :class="{'active': 日active}" 
                        @click="toggleActive('日')"
                        class="星期幾" >
                        日</div>
                        <div
                        :class="{'active': 一active}" 
                        @click="toggleActive('一')"
                        class="星期幾" >
                        一</div>
                        <div
                        :class="{'active': 二active}" 
                        @click="toggleActive('二')"
                        class="星期幾" >
                        二</div>
                        <div
                        :class="{'active': 三active}" 
                        @click="toggleActive('三')"
                        class="星期幾" >
                        三</div>
                        <div
                        :class="{'active': 四active}" 
                        @click="toggleActive('四')"
                        class="星期幾" >
                        四</div>
                        <div
                        :class="{'active': 五active}" 
                        @click="toggleActive('五')"
                        class="星期幾" >
                        五</div>
                    </div>
                </div>
                <div class="展開塊" v-if="設備展開">
                    <div class="編輯塊">
                        <div class="編輯標題">
                            <img  class="裝置圖標" src="/icon/黑色設備.svg">
                        </div>
                        <select class="裝置列表" v-model="selectedDeviceUp" >
                            <option value="燈泡" class="option">燈泡</option>
                            <option value="Tapo插座" class="option">Tapo插座</option>
                            <option value="Tuya插座" class="option">Tuya插座</option>
                            <option value="門窗感應器" class="option">門窗感應器</option>
                        </select>
                        <div class="狀態">
                            <div :class="{'active': 開啟active, '按鈕': true}" @click="開關('開啟')">
                                ON
                            </div>
                            <div :class="{'active': 關閉active, '按鈕': true}" @click="開關('關閉')">
                                OFF
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="動作區">
            <div class="動作塊">
                <img  src="/icon/加號.svg">
                <div class="塊裡面字">動作</div>
            </div>
            <div class="動作展開塊" >
                <div class="編輯塊">
                    <div class="編輯標題">
                        <img  class="裝置圖標" src="/icon/門窗感應器.svg">
                    </div>
                    <div class="動作裝置">燈條</div>
                    
                    <div class="狀態">
                        <div :class="{'active': 動作開啟active, '按鈕': true}" @click="動作開關('開啟')">
                            ON
                        </div>
                        <div :class="{'active': 動作關閉active, '按鈕': true}" @click="動作開關('關閉')">
                            OFF
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.燈泡自動化container{
    width: 100%;
    height: 100%;
    position: fixed; /* 確保元素固定在視窗內 */
    top: 0;
    display: flex;
    flex-direction: column;
}
/* 當螢幕寬度大於或等於1024px（電腦螢幕）時，設定為50% */
@media (min-width: 1024px) {
  .燈泡自動化container {
    width: 50vw; /* 將寬度改為50% */
    margin: 0 auto; /* 大框框的東西在中間 */
    left: 0;
    right: 0;
  }
}

.top標{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 5%;
    margin-left: 5%;
    margin-right: 5%;
}
.topIcon{
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 50%;
}
.上一頁{
    cursor: pointer;
}
.門窗感應器icon{
    width: 25px;
    height: 25px;
    margin-left: 5%;
}
.燈泡icon{
    width: 30px;
    height: 30px;
    margin-left: 5%;
    margin-right: 5%;
    cursor: pointer;
}
.燈泡icon:hover{
    transform: scale(1.2);
}

/*--------------------------------- */ 
.條件區{
    display: flex;
    flex-direction: column;
    margin-top: 5%;
    height: 30%;
    background-color: #EEEEEE;
    border-radius: 10px;
    margin-left: 5%;
    margin-right:5%;
    padding-bottom: 5%;
}
.條件塊{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-right: 5%;
    margin-left: 5%;
    /* 8是精挑細選過的數字 */
    height: 8vh;
    cursor: pointer;
    border-bottom: #c5c5c5 solid 1px;

}
.時間設備塊{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;;
    border-radius: 10px;
    /* 8是精挑細選過的數字 */
    height: 8vh;
    cursor: pointer;
    width: 48%;

}
.展開顏色 {
  background-color: #cbc9c9;; /* 展開時的顏色 */
}

.左{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
}
.時間區{
    display: flex;
    flex-direction: row;
    margin-top: 3%;
    width: 95%;
}
.展開塊{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;;
    border-radius: 10px;
    /* 8是精挑細選過的數字 */
    height: 8vh;
    cursor: pointer;
    width: 100%;
    margin-left: 5%;
}
.時間設備格{
    display: flex;
    flex-direction: row;
    margin-right: 5%;
    margin-left: 5%;
    margin-top: 3%;
    border-radius: 10px;
    width: 90%;
    justify-content: space-between;
    background-color: transparent;
    
}
.時間塊{
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 5%;
    margin-right: 5%;
    border-bottom: #ecebeb solid 1px;
    cursor: pointer;
}

.設備塊{
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 5%;
    margin-right: 5%;
    cursor: pointer;
}

.text{
    font-weight: bold;
    color: #614C4C;
    margin-left: 5%;
    cursor: pointer;
}
.text:hover{
    scale: 1.2;
}
.週期{
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    margin-left: 2%;
    width: 50%;
    gap: 5%;

}
.日曆icon{
    width: 30px;
    height: 30px;
    margin-left: 3%;
    margin-right: 2%;
}
.日曆icong上{
    width: 30px;
    height: 30px;
    margin-left: 3%;
}

.星期幾{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    color: black;
    font-weight: bold;
    background-color: #c5c5c5;
    border-radius:50% ;
    width: 30px;
    height: 30px;
}
.星期幾:hover{
    background-color: #ebefd3;
}
.星期幾.active{
    background-color: #ebefd3;
}

.設定{
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
}
.輸入{
    border: none;
    outline:none;
    width: 50px;
    height: 30px;
    margin-left: 5%;
    margin-right: 5%;
    border-radius: 10px;
    border: 1px solid #c5c5c5;
    text-align: center;
}
.start{
    border-radius: 10px;
    outline: none;
    border: none;
    background-color: #A59C9C;
    color: #ffffff;
    height: 30px;
    cursor: pointer;
    width: 20%;
    font-size: 15px;
}
.start:hover{
    background-color: #e7e4d3;
    color:#000000;
}
.按鈕 {
  border-radius: 10px;
  color: #ffffff;
  font-weight: bold;
  outline: none;
  border: none;
  cursor: pointer;
  background-color: #A59C9C;
  padding: 5px 10px;
}
.按鈕.active {
  background-color: #ebefd3;
  color: #000000;
}
/* 編輯動作區 */


.編輯塊 {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-left: 5%;
}
.編輯標題 {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 5%;
}
.裝置列表 {
  border: none;
  align-items: center;
  background-color: #d4cfcf;
  color: #5c5a5a;
  font-size: 15px;
  font-weight: bold;
  outline: none;
  margin-right: 5%;
  height:30px;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
  width: 30%;
}
.動作裝置{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #d4cfcf;
  color: #5c5a5a;
  font-size: 15px;
  font-weight: bold;
  margin-right: 5%;
  height:30px;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
  width: 30%;
}
.裝置 {
  font-size: 15px;
  font-weight: bold;
  margin-left: 10%;
}
.裝置圖標{
  width: 25px;
  height: 25px;
  cursor: pointer;
}
.裝置圖標:hover {
  transform: scale(1.2);
}
.狀態 {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
}
/*------------------------------------ */
.動作區{
    display: flex;
    flex-direction: column;
    margin-top: 5%;
    height:35vh;
    background-color: #EEEEEE;
    margin-left: 5%;
    margin-right: 5%;
    border-radius: 10px;
}
.動作塊{
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 5%;
    margin-right: 5%;
    justify-content: center;
    /* 8是精挑細選過的數字 */
    height: 8vh;
    cursor: pointer;
    border-bottom: #c5c5c5 solid 1px;
}
.動作展開塊{
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 5%;
    margin-right: 5%;
    margin-top: 5%;
    background-color: #ffffff;
    border-radius: 10px;
    /* 8是精挑細選過的數字 */
    height: 8vh;
    cursor: pointer;
}
/*------------------------------ */
/* 共用 */
.小標{  
    font-weight: bold;
    margin-left: 5%;
}     
.條件小標{
    font-weight: bold;
    margin-left: 5%;
    margin-bottom: 5%;
}

.條件塊裡面字{
    color:#614C4C ;
    font-weight: bold;
    font-size: 17px;
    margin-left: 0.5%;
}
.塊中icon{
    margin-left: 3%;
    cursor: pointer;
}  
.塊裡面字{
    margin-left: 0.5%;
    color:#614C4C;
    font-weight: bold;
    font-size:17px;
}
</style>