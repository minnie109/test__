<script setup>
import { ref } from 'vue';
/* 串畫面區 */
  /* 這個畫面會連到哪些畫面App 那邊怎麼定義，這邊要一樣 */
  const emit = defineEmits(['GoBuldHistory']);
  /* 內部函數定義 : 該畫面按鈕點擊後會觸發的函數 */
  function GoBuldHistory(){
    emit('GoBuldHistory');
  }

// 燈泡歷史
// 查看開關歷史
const BuldentityId = ref('light.w41_n15a_deng_guang');
const Bulderror = ref(null);
const BuldhistoryData = ref([]);

//查看歷史 API
async function BuldfetchHistoryData() {
    try {
      const response = await fetch('http://163.22.17.116:8122/api/history_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entity_id: BuldentityId.value,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      BuldhistoryData.value = data.message[0];
    } catch (err) {
        Bulderror.value = err.message;
      console.error('Error fetching history data:', err);
    }
  }



// 共用
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
}
BuldfetchHistoryData();

</script>
<template>
    <div class="歷史紀錄大框框">
        <div class="top">
            <img class="圖標" src="/icon/回上一頁.svg" @click="GoBuldHistory">
            <div class="標題字">燈泡</div>
        </div>
        <!--燈泡-->
        <div class="歷史紀錄框">
        <div  v-if="Bulderror">{{ Bulderror }}</div>
            <div   v-else>
              <div class="歷史內容">
                  <div class="一天" v-for="item in BuldhistoryData" :key="item.last_changed">
                    <div v-if=" item.state !== 'unavailable'">
                       <div class="日期">{{ formatTime(item.last_changed) }}</div>
                        <div class="內容">
                          狀態: {{ item.state }} 
                        </div>
                    </div> 
                  </div>
              </div>
            </div>
        </div>
        
    </div>
    

</template>
<style scoped>
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
.歷史紀錄大框框{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  font-family: 'Outfit', sans-serif;
  background-color: #EDEDED;
  left: 0;
  right: 0;
} 
/* 當螢幕寬度大於或等於1024px（電腦螢幕）時，設定為50% */
@media (min-width: 1024px) {
  .歷史紀錄大框框{
    width: 50vw; /* 將寬度改為50% */
    margin: 0 auto; /* 大框框的東西在中間 */
    left: 0;
    right: 0;
    background-color: #EDEDED;
  }
}
.圖標{
  cursor: pointer;
}
.圖標:hover{
  scale: 1.2;
}
.top{
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 10px;
    margin-top: 5%;
    margin-right: 5%;
    margin-left: 5%;
}
.標題字{
    font-size: 15px;
    font-weight: bold;
    color: #634F4F;
    margin-left: 5%;
    font-family: 'Outfit', sans-serif;
}
/* --------------------------------------- */
/* 共用 */
.圖標icon
{
    width: 20px;
    height: 20px;
    margin-right: 5%;
    margin-left: 5%;
}

.歷史紀錄標題{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between ;
  font-size: 15px;
  font-weight: bold;
  color: #634F4F;
  margin-top: 20px;
  padding-bottom: 1%;
  font-family: 'Outfit', sans-serif;
  border-bottom:  1.5px solid #D2D2D2;
  width: 100%;
}
.左標題{
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 50%;
}
.顯示更多資訊{
    margin-right: 5%;
    font-weight: none;
    border-bottom:  2px solid #7D7272;
    color: #7D7272;
}
.歷史紀錄字{
  color: #634F4F;
  margin-right: 5%;
  font-family: 'Outfit', sans-serif;
}

.歷史紀錄框{
  background-color:#ffffff;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  margin-right: 5%;
  padding-bottom: 3%;
  overflow-y: hidden; /* 隱藏超出邊框的內容 */
  margin-bottom: 3%;
  margin-top: 2%;
  margin-left: 5%;
  width:90%;
  height: 85vh;
}

.歷史內容{
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    margin-left: 5%;
    margin-right: 5%;
    margin-bottom: 2%;
    margin-top: 1%;
    height: 75vh;
    overflow-y: scroll;
    width: 90%;
    padding-right: 5%;
}
.日期{
    color: #9E9797;
    font-size: 13px;
    margin-top: 1%;
}
.內容{
    color: #5c5151;
    margin-top: 1%;
    margin-bottom: 1%;
    font-size: 15px;
    font-weight: bold;
}
.一天{
    border-bottom: 1px solid #D2D2D2;
    padding-bottom: 0.5%;
}


</style>