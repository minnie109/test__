<script setup>
//Tapo插座歷史紀錄API測試
import { ref } from 'vue';
/* 串畫面區 */
/* 這個畫面會連到哪些畫面App 那邊怎麼定義，這邊要一樣 */
const emit = defineEmits(['GoHome','GoTapoPlugAutomationList','GoTapoPlugHistoryFull']);
/* 內部函數定義 : 該畫面按鈕點擊後會觸發的函數 */
function GoHome(){
  emit('GoHome');
}
function GoTapoPlugAutomationList(){
  emit('GoTapoPlugAutomationList');
}
function GoTapoPlugHistoryFull(){
  emit('GoTapoPlugHistoryFull');
}
const entityId = ref('switch.zhi_hui_xing_cha_zuo');  // 存放實體ID
const historyData = ref();  // 存放歷史數據
const errorMessage = ref('');   // 錯誤信息
//自動化開關
const Checked = ref(false);
const Switch = () => {
  Checked.value = !Checked.value;
};
//區域預設是臥室
const selectedRegion = ref('bedroom');
const fetchHistoryData = async () => {
  try {
    const response = await fetch('http://163.22.17.116:8122/api/history_data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entity_id: entityId.value,  // 傳遞用戶輸入的實體ID
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    historyData.value = data;  // 將回應的數據存儲到 historyData 中
  } catch (error) {
    errorMessage.value = `Error: ${error.message}`;
  }
};

// 時間格式化函數
function formatTime(dateString) {
    const date = new Date(dateString);
    // 獲取年份、月份和日期
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份從 0 開始，所以加 1
    const day = String(date.getDate()).padStart(2, '0');
    // 獲取小時、分鐘和秒
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    // 判斷 AM 或 PM
    const amPm = hours >= 12 ? '下午' : '上午';
    const formattedHours = String(hours % 12 || 12).padStart(2, '0'); // 將 24 小時制轉為 12 小時制，並處理 0 的情況
    return `${year}.${month}.${day} ${amPm}${formattedHours}:${minutes}:${seconds}`;
};
fetchHistoryData();
</script>
<template>
  <div class="all">
    <div class="標題1">
      <img class="Tapo回上一頁" src="/icon/回上一頁.svg" @click="GoHome">  
      <div v-if="historyData && historyData.message && historyData.message[0] && historyData.message[0][0]">
        Tapo插座
      </div>
    </div>
    <div class="區域框">
      <div class="label">區域</div> 
        <select v-model="selectedRegion" id="region">
          <option value="bedroom" class="option">臥室</option>
          <option value="livingroom" class="option">客廳</option>
          <option value="kitchen" class="option">廚房</option>
        </select>      
    </div>
    <div class="自動化區">
        <div class="自動化標題">
            <div>自動化</div>
            <img  class="自動化更多" src="/icon/箭頭更多.svg" @click="GoTapoPlugAutomationList">
        </div>
        <div class="自動化內容">
          <div 
              class="開關" 
              :style="{ backgroundColor: Checked ? '#96B87A' : '#A4A4A4' }" 
              @click="Switch"
              >
            <div 
                class="toggle-knob"
                :class="{ 'knob-on': Checked }">
            </div>
          </div>
          <div class="自動化字">每天上午 7 : 00 關燈</div>
        </div>
    </div>
    <div class="歷史紀錄區">
      <div class="標題2">
        <div class="歷史紀錄字">歷史紀錄</div>
        <div class="顯示更多資訊字" @click="GoTapoPlugHistoryFull">顯示更多資訊</div>
      </div>
      <div v-if="historyData && historyData.success===true" class="時間跟狀態">
        <div v-for="(item, index) in historyData.message[0]" :key="index">
            <div v-if="item.state !== 'unavailable'">
                <div class="歷史紀錄時間">{{ formatTime(item.last_updated) }}</div>
                <div class="歷史紀錄狀態">狀態:{{ item.state }} </div> 
            </div>
        </div>
      </div> 
    </div>
  </div>
</template>

<style scoped>
.all{
  display: flex;
  flex-direction: column;
  justify-content: center; /* 垂直居中 */
  align-items: center; 
  height: 100%;
  width:100% ;
}
/* 當螢幕寬度大於或等於1024px（電腦螢幕）時，設定為50% */
@media (min-width: 1024px) {
  .all {
    width: 50vw; /* 將寬度改為50% */
    margin: 0 auto; /* 大框框的東西在中間 */
  }
}
.標題1{
  height: 95%;
  width:95% ;
  display: flex;
  flex-direction: row;
  color:#634F4F;
  font-weight: bold;
  margin-top:5%;
  margin-left:5%;
  gap: 3%;
}
.Tapo回上一頁{
  cursor: pointer;
}
.區域框{
  background-color:#F3EBEB;
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

.label{
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
  margin-left:50%;
  margin-right: 5%;
  height: 80%;
  border-radius: 10px;
  cursor: pointer;
  text-align: start;
}
option{
  font-size: 15px;
  font-weight: bold;
  color: #8a8686;
  cursor: pointer;
}
.自動化區{
  box-sizing: border-box; /*內邊距和邊框不會增加元素的寬度和高度 */
  height: 25vh;
  width:90% ;
  display: flex;
  flex-direction: column;
  color:#634F4F;
  margin-left:5%;
  margin-top:5%;
  margin-right: 5%;
  font-weight: bold;
  background-color: #F3EBEB;
  border-radius: 10px;
  padding: 3%;
  align-items: flex-start; /*橫軸靠上面 */
}
.自動化標題{
  display: flex;
  box-sizing: border-box;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 2%;
  border-bottom: 0.5px solid #C6C1C1;
}
.自動化更多{
    cursor: pointer;
}
.自動化內容{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  font-size: 15px;
  margin-top: 5%;
  color: #524141;
  font-family: 'Outfit', sans-serif;
}

.開關 {
  width: 50px;
  height: 20px;
  border-radius: 15px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-right: 5%;
}
.toggle-knob {
  width: 20px;
  height: 20px;
  background-color: #ffffff;
  border-radius: 50%;
  position: absolute;
  top: 0px;
  left: 0px;
  transition: transform 0.3s;
}

.toggle-switch[style*="#96B87A"] .toggle-knob {
  transform: translateX(30px);
}
.knob-on {
  transform: translateX(30px);
}
.標題2{
  width:90% ;
  display: flex;
  flex-direction: row;
  color:#634F4F;
  margin-top:5%;
  margin-left: 5%;
  margin-right: 5%;
  justify-content: space-between;
  padding-bottom: 2%;
  border-bottom: 0.5px solid #C6C1C1;
}
.歷史紀錄字{
  font-weight: bold;
}
.顯示更多資訊字{
  font-weight: none ;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  cursor: pointer;
}

.歷史紀錄區{
  display: flex;
  flex-direction: column;
  background-color:#F3EBEB ;
  width: 90%;
  /* 高度是設計過的 */
  height: 35vh; 
  margin-left: 5%;
  margin-right: 5%;
  margin-top: 5%;
  border-radius: 10px;
  margin-bottom: 5%;
}

.時間跟狀態{
  display: flex;
  flex-direction: column;
  margin-left: 5%;
  margin-right: 5%;
  margin-top: 5%;
  margin-bottom: 5%;
  overflow-y: scroll;
}

.歷史紀錄時間{
  font-size: 12px;
    font-family: 'Outfit', sans-serif;
    font-weight: none;
    color:#9E9797;
    margin-top: 5px;
}
.歷史紀錄狀態{
  font-size: 15px;
    font-family: 'Outfit', sans-serif;
    font-weight: bold;
    color:#634F4F;
    margin-top: 5px;
}

/*滾動條樣式自訂 */
/* 整個滾動條 */
::-webkit-scrollbar {
    width: 10px;              /* 滾動條寬度 */
    height: 10px;             /* 滾動條高度，水平滾動條時 */
}

/* 滾動條滑道（背景） */
::-webkit-scrollbar-track {
    background: #D9D9D9;      /* 背景色 */
    border-radius: 10px;      /* 圓角 */
}

/* 滾動條滑塊 */
::-webkit-scrollbar-thumb {
    background: #888;         /* 顏色 */
    border-radius: 10px;      /* 圓角 */
}

/* 當滑鼠懸停於滾動條上時 */
::-webkit-scrollbar-thumb:hover {
    background: #555;         /* 懸停時的顏色 */
}
</style>