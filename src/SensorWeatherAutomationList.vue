
<script setup>
import { ref } from 'vue';

/* 串畫面區 */
  /* 這個畫面會連到哪些畫面App 那邊怎麼定義，這邊要一樣 */
  //去快捷訊息的變數
  const emit = defineEmits(['GoSensorWeatherHistory','GoSensorWeatherAutomation']);
  /* 內部函數定義 : 該畫面按鈕點擊後會觸發的函數 */
  //去快捷訊息的畫面
  function GoSensorWeatherHistory(){
    emit('GoSensorWeatherHistory');
  }
  function GoSensorWeatherAutomation(){
    emit('GoSensorWeatherAutomation');
  }

//區域
//區域內容變數
const selectedRegion = ref('bedroom');

//動作
/* 選取列表 */
let 選取 = ref(true);
let 編輯動作 = ref(false);
//垃圾桶 + 取消鍵
let 刪除列 = ref(false);
// 編輯模式
function 切換選取(){
  選取.value = !選取.value;
  刪除列.value = !刪除列.value;
  編輯動作.value = !編輯動作.value;
}

//確認刪除畫面
let showConfirmDelete = ref(false);


//刪除功能
let indicesToDelete = ref([]);
//資料庫

function 刪除功能(){
  if (indicesToDelete.value.length > 0) {
    showConfirmDelete.value = true;
  }
}
function confirmDelete() {
  indicesToDelete.value.sort((a, b) => b - a).forEach(index => {
    自動化指令.value.splice(index, 1);
  });

  indicesToDelete.value = [];
  showConfirmDelete.value = false;
  刪除列.value = false;
  選取.value = true;
}

function cancelDelete() {
  showConfirmDelete.value = false;
}



/* 選取改變顏色功能 */

// 定義 reactive 變量
const 自動化指令 = ref([
  { text: '當溫度小於24度時，關閉臥室所有插座', color: '#e2dede' },  // 初始為白色
  { text: '當濕度大於80%時，開啟客廳插座', color: '#e2dede' }   // 初始為白色
]);


// 切換刪除狀態的函數
function toggleDelete(index) {
  const idx = indicesToDelete.value.indexOf(index);
  if (idx === -1) {
    indicesToDelete.value.push(index);
  } else {
    indicesToDelete.value.splice(idx, 1);
  }
}

function changeColor(index) {
  const selectedColor = '#FFE6C7'; // 點選後顯示的紅色
  const defaultColor = '#e2dede';  // 預設白色
  // 切換顏色
  自動化指令.value[index].color = 自動化指令.value[index].color === defaultColor ? selectedColor : defaultColor;
}
</script>

<template>
  <div class="WorkContainer">
    <div class="content">
      <div class="WorkTop">
          <img class="WorkBack" src="/icon/回上一頁.svg" @click="GoSensorWeatherHistory">
      </div>
      <div class="動作modeframe">
        <div class="top">
          <div class="text動作">
            <img class="燈泡icon"  src="/icon/temperature.svg">
            <div>自動化內容</div>
          </div>
          <div class="選取列">
            <button class="選取前" v-if="選取" @click="切換選取" >編輯</button>
            <div class="選取後" v-else>
              <img class="刪除" @click="刪除功能" src="/icon/垃圾桶.svg">
              <button class="取消" @click="切換選取">取消</button>
            </div>
          </div>
        </div>
        <div class="動作塊內容">
          <div class="medium">
            <div class="divBtn" 
              v-for="(指令, index) in 自動化指令" 
              :key="index"
              @click="changeColor(index)"
              :style="{ backgroundColor: 指令.color }">
              <input type="checkbox" 
                v-if="刪除列" 
                class="選取點點" 
                :id="'checkbox-' + index" 
                :checked="indicesToDelete.includes(index)" 
                @change="toggleDelete(index)">
              <label v-if="刪除列" :for="'checkbox-' + index"></label>
              <div class="動作塊" >
                <img class="圖標" src="/icon/遙控.svg">
                <div class="內容">{{ 自動化指令[index].text }}</div>
              </div>
            </div>
          </div>
          <div v-if="showConfirmDelete" class="confirm-background"></div>
          <div v-if="showConfirmDelete" class="confirm-window">
            <p>刪除所選的快捷訊息？</p>
            <div class="confirm-buttons">
              <button @click="cancelDelete">否</button>
              <button @click="confirmDelete" style="color: red;">是</button>
            </div>
          </div>
          <div class="新增自動化塊" @click="GoSensorWeatherAutomation">
            <div class="新增自動化內容">
              <img class="新增圖標" src="/icon/新增動作.svg">
              <div class="自動化字">新增自動化</div>
            </div>
          </div>
        </div>
      </div>
      <div class="complete" @click="GoSensorWeatherHistory">完成</div>
    </div>
  </div>
</template>

<style scoped>
/*全頁面*/
.WorkContainer {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  max-width: 100%;
}
@media (min-width: 1024px) {
  .WorkContainer {
    width: 50vw; /* 將寬度改為50% */
    margin: 0 auto; /* 大框框的東西在中間 */
  }
}
/*------------------------------------------------ */
/* 上半部 */
.燈泡icon{
  width: 30px;
  height: 30px;
}
.WorkTop {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 90%;
  margin-left: 5%;
  margin-top: 5%;
  margin-bottom: 2%;
}
/*回上一頁*/ 
.WorkBack {
  cursor: pointer;
  margin-right: 3%;
}
.WorkBack:hover {
  transform: scale(1.1);
}
.工作標題 {
  font-weight: bold;
}
/*---------------------------------------------------- */
.區域框 {
  background-color: #F2EBE7;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 10px;
  margin-left: 5%;
  margin-right: 5%;
  padding-bottom: 3%;
  margin-top: 5%;
  width: 90%;
}
/* 區域標題*/ 
.label {
  display: flex;
  width: 30%;
  margin-top: 15px;
  margin-left: 5%;
  font-weight: bold;
  color: #5a3c39;
  padding-top: 1%;
  padding-bottom: 1%;
}
select {
  width: 90%;
  border: none;
  background-color: #F3EBEB;
  color: #8a8686;
  font-size: 15px;
  font-weight: bold;
  outline: none;
  margin-top: 4%;
  margin-left: 50%;
  margin-right: 5%;
  height: 80%;
  border-radius: 10px;
  cursor: pointer;
  text-align: start;
}
option {
  font-size: 15px;
  font-weight: bold;
  color: #8a8686;
  cursor: pointer;
}
/*--------------------------------------- */
/* 動作區 */
.content {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 90%;
}
/* 不含完成按鈕 */
.動作modeframe {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  margin-left: 5%;
  margin-right: 5%;
  margin-bottom: 3%;
  /* 40 是精挑細選的數字 */
  height: 85%;
  width: 90%;
  background-color: #F2EBE7;
  border-radius: 10px;
  padding-bottom: 5%;
}
/* 動作 (小標題) */
.text動作 {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
  margin-top: 2%;
  width: 100%;
  gap: 5%;
}
/* 列表區 */
.top {
  display: flex;
  flex-direction: row;
  width: 90%;
  justify-content: space-between;
  margin-left: 5%;
  margin-right: 5%;
  margin-top: 2%;
  padding-bottom: 2%;
  border-bottom: #c9c3c3 solid 1px;
}
.選取列 {
  display: flex;
  flex-direction: row;
  width: 50%;
  justify-content: flex-end;
  margin-top: 2%;
}
.選取前 {
  border-radius: 10px;
  color: #ffffff;
  font-weight: bold;
  outline: none;
  border: none;
  cursor: pointer;
  background-color: #A59C9C;
}
.選取後 {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}
.取消 {
  border-radius: 10px;
  color: #ffffff;
  font-weight: bold;
  outline: none;
  border: none;
  cursor: pointer;
  background-color: #A59C9C;
}
.取消:hover {
  background-color: #7d7575;
}
.刪除 {
  cursor: pointer;
}
/*------------------------------ */
/* 列表區，不含上半部top區 */
.動作塊內容 {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 75vh;
  width: 100%;
  padding-top: 3%;
  flex-grow: 1;
}
/* 列表區 */
.medium {
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: transparent;
  flex-grow: 1;
  align-items: center;
  margin-top: 2%;
  padding-top: 2%;
  padding-bottom: 2%;
  justify-content: flex-start;
  box-sizing: border-box;
  overflow-y: scroll;
  overflow-x: hidden;
  height: 100%;
}
.divBtn {
  display: flex;
  flex-direction: row;
  width: 90%;
  /* 50 精挑細選的數字 */
  height: 50px;
  align-items: center;
  justify-content: flex-start;
  background-color: #e2dede;
  margin-left: 5%;
  margin-right: 5%;
  border-radius: 15px;
  cursor: pointer;
  margin-bottom: 5%;
  padding-left: 3%;
}

.divBtn:hover {
  background-color: #c7c6c6;
  transform: scale(1.03);
}
.動作塊 {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  /* 條件塊的寬度 : 415*50 是精挑細選的數字 ，
  為了讓裡面的條件塊不要被壓縮 所以這邊固定大小 */
  width: 100%;
  height: 100%;
  background-color: transparent;
  border-radius: 10px;
  align-items: center;
  cursor: pointer;
}

.選取點點 {
  /* 隱藏 原本的 checkbox 樣式 */
  display: none;
}
.選取點點 + label {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 3px solid #A59C9C;
  cursor: pointer;
  position: relative;
  margin: 2px;
}
.選取點點:checked + label::before {
  content: '';
  display: block;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background-color: #974242;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 編輯動作區 */
.新增自動化塊 {
  display: flex;
  flex-direction: row;
  width: 90%;
  background-color: #e2dede;
  border-radius: 10px;
  margin-top: 2%;
  margin-left: 5%;
  margin-right: 5%;
  height: 50px;
}
.新增自動化塊:hover {
  background-color: #c7c6c6;
}
.新增自動化內容{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  cursor: pointer;
}

.自動化字{
  font-weight: bold;
  color: #5a3c39;
  cursor: pointer;
}
.編輯標題 {
  display: flex;
  width: 40%;
  flex-direction: row;
  align-items: center;
}
.裝置列表 {
  width: 50%;
  border: none;
  background-color: #F3EBEB;
  color: #8a8686;
  font-size: 15px;
  font-weight: bold;
  outline: none;
  margin-top: 4%;
  margin-left: 3%;
  margin-right: 5%;
  margin-bottom: 3%;
  height: 80%;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
}
.裝置 {
  font-size: 15px;
  font-weight: bold;
  margin-left: 10%;
}
.裝置圖標{
  width: 25px;
  height: 25px;
  margin-left: 10px;
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
  width: 50%;
  gap: 10px;
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
.新增圖標 {
  margin-right: 5%;
  cursor: pointer;
}
/*-------------------------------------- */
/* 共用區 */
.圖標 {
  width: 25px;
  height: 25px;
  margin-left: 10px;
  cursor: pointer;
}
.內容 {
  font-size: 15px;
  margin-left: 10px;
  font-weight: bold;
}
/* ------------------------------------------- */
.complete {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 20%;
  height: 100%;
  margin-right: 5%;
  background-color: #e2dede;
  border-radius: 10px;
  margin-left: 5%;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  margin-left: auto;
  padding-top:2%;
  padding-bottom:2%;
}
.complete:hover {
  background-color: #d1d0d0;
}

.confirm-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* 黑色半透明效果 */
  z-index: 999; /* 保證背景層在最上層 */
}
.confirm-window {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-weight: bold;
  z-index: 1000; /* 確認視窗位於背景層之上 */
}

.confirm-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

.confirm-buttons button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}
.confirm-buttons button:hover {
  background-color: #e6e3e3;
}
/*------------------------------------------------ */
/*滾動條樣式自訂 */
/* 整個滾動條 */
::-webkit-scrollbar {
  width: 10px; /* 滾動條寬度 */
  height: 10px; /* 滾動條高度，水平滾動條時 */
}

/* 滾動條滑道（背景） */
::-webkit-scrollbar-track {
  background: #D9D9D9; /* 背景色 */
  border-radius: 10px; /* 圓角 */
}

/* 滾動條滑塊 */
::-webkit-scrollbar-thumb {
  background: #888; /* 顏色 */
  border-radius: 10px; /* 圓角 */
}

/* 當滑鼠懸停於滾動條上時 */
::-webkit-scrollbar-thumb:hover {
  background: #555; /* 懸停時的顏色 */
}
</style>