<script setup>
import { ref } from 'vue';
/* 串畫面區 */
  /* 這個畫面會連到哪些畫面App 那邊怎麼定義，這邊要一樣 */
  const emit = defineEmits(['GoHome','GoBuldHistoryFull','GoLedHistoryFull','GoTuyaPlugHistoryFull','GoTapoPlugHistoryFull','GoSensorDoorHistoryFull','GoSensorWeatherHistoryFull']);
  /* 內部函數定義 : 該畫面按鈕點擊後會觸發的函數 */
  function GoHome(){
    emit('GoHome');
  }
  function GoBuldHistoryFull(){
    emit('GoBuldHistoryFull');
  }
  function GoLedHistoryFull(){
    emit('GoLedHistoryFull');
  }
  function GoTuyaPlugHistoryFull(){
    emit('GoTuyaPlugHistoryFull');
  }
  function GoTapoPlugHistoryFull(){
    emit('GoTapoPlugHistoryFull');
  }
  function GoSensorDoorHistoryFull(){
    emit('GoSensorDoorHistoryFull');
  }
  function GoSensorWeatherHistoryFull(){
    emit('GoSensorWeatherHistoryFull');
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
//燈條歷史
// 查看開關歷史
const LedentityId = ref('light.zhi_hui_deng_tiao');
const Lederror = ref(null);
const LedhistoryData = ref([]);
//查看歷史 API
async function LedfetchHistoryData() {
    try {
      const response = await fetch('http://163.22.17.116:8122/api/history_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entity_id: LedentityId.value,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      LedhistoryData.value = data.message[0];
    } catch (err) {
        Lederror.value = err.message;
      console.error('Error fetching history data:', err);
    }
  }

//tuya插座歷史
const tuyaentityId = ref('switch.zhi_hui_cha_zuo_socket_1');  // 存放實體ID
const tuyahistoryData = ref(null);  // 存放歷史數據
const tuyaerrorMessage = ref('');   // 錯誤信息
const tuyafetchHistoryData = async () => {
  try {
    const response = await fetch('http://163.22.17.116:8122/api/history_data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entity_id: tuyaentityId.value,  // 傳遞用戶輸入的實體ID
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    tuyahistoryData.value = data;  // 將回應的數據存儲到 historyData 中
  } catch (error) {
    tuyaerrorMessage.value = `Error: ${error.message}`;
  }
};

//tapo插座歷史
const tapoentityId = ref('switch.zhi_hui_xing_cha_zuo');  // 存放實體ID
const tapohistoryData = ref();  // 存放歷史數據
const tapoerrorMessage = ref('');   // 錯誤
const tapofetchHistoryData = async () => {
  try {
    const response = await fetch('http://163.22.17.116:8122/api/history_data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entity_id: tapoentityId.value,  // 傳遞用戶輸入的實體ID
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    tapohistoryData.value = data;  // 將回應的數據存儲到 historyData 中
  } catch (error) {
    tapoerrorMessage.value = `Error: ${error.message}`;
  }
};
//門窗感應歷史

//溫溼度感應歷史
const entityId = ref('sensor.mg_wifi_t_h_sensor_temperature'); // 存放實體ID
const historyData = ref(null); // 存放歷史數據
const errorMessage = ref(''); // 錯誤信息
const displayData = ref([]); // 用于存储要显示的数据
const shouldDisplay = (currentState) => {
    // 如果没有数据，直接返回
    if (displayData.value.length === 0) {
        return true;
    }

    // 获取最后一个显示的数据的状态
    const lastDisplayedState = displayData.value[displayData.value.length - 1].state;

    // 判断当前状态与最后一个显示的数据的状态差异
    return Math.abs(currentState - lastDisplayedState) >= 0.15;
};

const fetchHistoryData = async () => {
    try {
        const response = await fetch('http://163.22.17.116:8122/api/history_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                entity_id: entityId.value, // 传递用户输入的实体ID
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        historyData.value = data; // 将响应的数据存储到 historyData 中

        // 遍历历史数据，决定哪些数据需要被显示
        for (let i = 0; i < historyData.value.message[0].length; i++) {
            const currentState = historyData.value.message[0][i].state;

            // 判断是否应该显示当前数据
            if (shouldDisplay(currentState)) {
                displayData.value.push(historyData.value.message[0][i]); // 添加到显示的数据
            }
        }
    } catch (error) {
        errorMessage.value = `Error: ${error.message}`;
    }
};

const 濕度entityId = ref('sensor.mg_wifi_t_h_sensor_humidity'); // 存放實體ID
const 濕度historyData = ref(null); // 存放歷史數據
const 濕度errorMessage = ref(''); // 錯誤信息
const fetchHumidityData = async () => {
    try {
        const response = await fetch('http://163.22.17.116:8122/api/history_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                entity_id: 濕度entityId.value, // 传递用户输入的实体ID
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        濕度historyData.value = data; // 将响应的数据存储到 historyData 中

        
    } catch (error) {
        濕度errorMessage.value = `Error: ${error.message}`;
    }
};

// 取得與指定時間點最近的濕度資料
const findClosestHumidity = (tempTime) => {
    const tempDate = new Date(tempTime);
    let closestHumidity = null;
    let minDiff = Infinity;

    for (let i = 0; i < 濕度historyData.value.message[0].length; i++) {
        const humidityItem = 濕度historyData.value.message[0][i];
        const humidityDate = new Date(humidityItem.last_changed);

        const diff = Math.abs(tempDate - humidityDate); // 計算時間差異
        if (diff < minDiff) {
            minDiff = diff;
            closestHumidity = humidityItem; // 更新最近的濕度資料
        }
    }
    return closestHumidity; // 返回最近的濕度資料
};

// 時間格式化函數
function formatTime1(dateString) {
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
LedfetchHistoryData();
tuyafetchHistoryData();
tapofetchHistoryData();
fetchHistoryData();
fetchHumidityData();
</script>
<template>
    <div class="歷史紀錄大框框">
        <div class="top">
            <img class="圖標" src="/icon/回上一頁.svg" @click="GoHome">
            <div class="標題字">歷史紀錄</div>
        </div>
        <!--燈泡-->
        <div class="歷史紀錄框">
            <div class="歷史紀錄標題">
                <div class="左標題">
                    <img class="圖標icon" src="/icon/燈泡.svg"> 
                    <div class="歷史紀錄字">燈泡</div>
                </div>
                <div class="顯示更多資訊" @click="GoBuldHistoryFull">顯示更多資訊</div>
            </div>
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
        <!--燈條-->
        <div class="歷史紀錄框">
            <div class="歷史紀錄標題">
                <div class="左標題">
                    <img class="圖標icon" src="/icon/燈條.svg"> 
                    <div class="歷史紀錄字">燈條</div>
                </div>
                <div class="顯示更多資訊" @click="GoLedHistoryFull">顯示更多資訊</div>
            </div>
        <div class="error" v-if="error">{{ error }}</div>
            <div  class="data" v-else>
              <div class="歷史內容">
                  <div class="一天" v-for="item in LedhistoryData" :key="item.last_changed">
                    <div v-if="item.state !== 'unavailable'">
                       <div class="日期">{{ formatTime(item.last_changed) }}</div>
                        <div class="內容">
                          狀態: {{ item.state }}
                        </div>
                    </div> 
                  </div>
              </div>
            </div>
        </div>
        <!--tuya插座-->
        <div class="歷史紀錄框">
            <div class="歷史紀錄標題">
                <div class="左標題">
                    <img class="圖標icon" src="/icon/插座.svg"> 
                    <div class="歷史紀錄字">Tuya 插座 </div>
                </div>
                <div class="顯示更多資訊" @click="GoTuyaPlugHistoryFull">顯示更多資訊</div>
            </div>
            <div v-if="tuyahistoryData && tuyahistoryData.success===true">
                <div class="歷史內容">
                    <div class="一天" v-for="(item, index) in tuyahistoryData.message[0]" :key="index">
                        <div v-if="item.state !== 'unavailable'">
                            <div class="日期">{{ formatTime(item.last_updated) }}</div>
                            <div class="內容">狀態:{{ item.state }} </div> 
                        </div>
                    </div>
                </div>
                
         </div> 
        </div>
        <!--tapo插座-->
        <div class="歷史紀錄框">
            <div class="歷史紀錄標題">
                <div class="左標題">
                    <img class="圖標icon" src="/icon/插座.svg"> 
                    <div class="歷史紀錄字">Tapo插座</div>
                </div>
                <div class="顯示更多資訊" @click="GoTapoPlugHistoryFull">顯示更多資訊</div>
            </div>
            <div v-if="tapohistoryData && tapohistoryData.success===true" >
                <div class="歷史內容">
                    <div class="一天" v-for="(item, index) in tapohistoryData.message[0]" :key="index">
                        <div v-if="item.state !== 'unavailable'">
                            <div  class="日期">{{ formatTime(item.last_updated) }}</div>
                            <div class="內容">狀態:{{ item.state }} </div> 
                        </div>
                    </div>
                </div>
            </div> 
        </div>
        <!--門窗感應  這邊先暫時用tapo插座-->
        <div class="歷史紀錄框">
            <div class="歷史紀錄標題">
                <div class="左標題">
                    <img class="圖標icon" src="/icon/門窗感應器.svg"> 
                    <div class="歷史紀錄字">門窗感應器</div>
                </div>
                <div class="顯示更多資訊" @click="GoSensorDoorHistoryFull">顯示更多資訊</div>
            </div>
            <div v-if="tapohistoryData && tapohistoryData.success===true" >
                <div class="歷史內容">
                    <div class="一天" v-for="(item, index) in tapohistoryData.message[0]" :key="index">
                        <div v-if="item.state !== 'unavailable'">
                            <div  class="日期">{{ formatTime(item.last_updated) }}</div>
                            <div class="內容">狀態:{{ item.state }} </div> 
                        </div>
                    </div>
                </div>
            </div> 
        </div>
        <!--溫溼度感應-->
        <div class="歷史紀錄框">
            <div class="歷史紀錄標題">
                <div class="左標題">
                    <img class="圖標icon" src="/icon/temperature.svg"> 
                    <div class="歷史紀錄字">溫溼度感測器</div>
                </div>
                <div class="顯示更多資訊" @click="GoSensorWeatherHistoryFull">顯示更多資訊</div>
            </div>
            <div class="歷史內容">
                <div v-if="historyData && historyData.success === true" ></div>
                <div class="一天" v-for="(item, index) in displayData" :key="index">
                    <div class="日期">
                        {{ formatTime1( item.last_changed ) }}
                    </div>
                    <div class="內容">
                        溫度: {{ item.state }}
                        濕度: {{ findClosestHumidity(item.last_changed).state }}%
                    </div>
                </div>
                <!-- 錯誤處理 -->
                <div v-if="historyData && historyData.ready === false" style="color: red;">
                    <p>Error: {{ errorMessage }}</p>
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


.圖標{
  cursor: pointer;
}
.圖標:hover{
  scale: 1.2;
}
.歷史紀錄大框框{
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: hidden;
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
    cursor: pointer;
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
  height: 150px;
}

.歷史內容{
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    margin-left: 5%;
    margin-right: 5%;
    margin-bottom: 2%;
    margin-top: 1%;
    height: 25vh;
    overflow-y: scroll;
    width: 90%;
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