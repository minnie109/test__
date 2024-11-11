<script setup>
import { ref ,onMounted,onUnmounted } from 'vue';
/* 串畫面區 */
  /* 這個畫面會連到哪些畫面App 那邊怎麼定義，這邊要一樣 */
  const emit = defineEmits(['GoHome','GoBuldAutomationList','GoBuldHistoryFull']);
  /* 內部函數定義 : 該畫面按鈕點擊後會觸發的函數 */
  function GoHome(){
    emit('GoHome');
  }
  function GoBuldAutomationList(){
    emit('GoBuldAutomationList');
  }
  function GoBuldHistoryFull(){
    emit('GoBuldHistoryFull');
  }
// 設定燈光亮度的狀態和初始值
const brightnessnum = ref(0); 
const rgb = ref([0,0,0]);
const firstColor = ref('#ffffff'); // 這裡初始化為白色
const selectedColor = ref(firstColor.value);
const rgbColor = ref(rgb.value);
const all = ref([]);
const entity_state = ref("");
const responseMessage = ref('');
const errorMessage = ref('');
//區域預設是臥室
const selectedRegion = ref('bedroom');
//自動化開關
const Checked = ref(false);
const Switch = () => {
  Checked.value = !Checked.value;
};
// 查看開關歷史
const entityId = ref('light.w41_n15a_deng_guang');
const error = ref(null);
const historyData = ref([]);

//查看歷史 API
async function fetchHistoryData() {
    try {
      const response = await fetch('http://163.22.17.116:8122/api/history_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entity_id: entityId.value,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      historyData.value = data.message[0];
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching history data:', err);
    }
  }

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

//定義一個函數，將RGB值轉換為16進位
const rgbToHex = (r,g,b) => {
  const toHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};
//獲得設備初始狀態
const fetchDeviceState = async () => {
    try {
    const response = await fetch('http://163.22.17.116:8122/api/turn_gate/light', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    entity_state.value = data.message[0].state;
    // 如果 brightness 不是 null，則設置為 brightness 的值，否則設置為 0
    if (data.message[0].attributes.brightness !== null) {
      brightnessnum.value = data.message[0].attributes.brightness;
    } else {
      brightnessnum.value = 0;
    }
    all.value = data;
    if (data.message[0].attributes.rgb_color !== null) {
      rgb.value = data.message[0].attributes.rgb_color;
    } else {
      rgb.value = [0,0,0]
    }
    firstColor.value = rgbToHex(rgb.value[0], rgb.value[1], rgb.value[2]);
    selectedColor.value = firstColor.value; // 使用 firstColor 的值
    rgbColor.value = rgb.value;
    
    console.log('Initial selected color:', selectedColor.value);  // 確認初始顏色
  } catch (error) {
    console.error('Error fetching device state:', error);
    errorMessage.value = 'Failed to load device state';
  }
};

// 發送 API 請求來控制燈光亮度
const changeBrightness = async () => {
  const url = 'http://163.22.17.116:8122/api/light_control/brightness'; // 替換為你的 API 端點
  const headers = {
    'Content-Type': 'application/json',
  };

  const data = {
    entity_id: 'light.w41_n15a_deng_guang', // 燈泡實體 ID
    brightness: brightnessnum.value, // 傳遞亮度值
  };
  // 確保亮度值在允許的範圍內
  if (brightnessnum.value < 0 || brightnessnum.value > 255) {
    console.error('Brightness value must be between 0 and 255');
    responseMessage.value = 'Brightness value must be between 0 and 255';
    return;
  }
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Response:', result);
    responseMessage.value = `Status Code: ${response.status}, Response: ${JSON.stringify(result)}`;
    // 切換狀態後立即更新設備狀態
    await fetchDeviceState();
  } 
  catch (error) {
    console.error('Error:', error);
    responseMessage.value = `Error: ${error.message}`;
  }
};



// 將 16 進位顏色轉換為 RGB
const convertHexToRgb = (hexColor) => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  rgbColor.value = [r, g, b];
};

// 發送 API 請求以控制燈光顏色
const changeLightColor = async () => {
  const url = 'http://163.22.17.116:8122/api/light_control/color'; // 替換為你的 API 端點
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // 設定燈光顏色的資料，包含實體ID和RGB顏色
  //把用戶選擇的顏色餵給API
  const data = {
    entity_id: 'light.w41_n15a_deng_guang', // 替換為你的燈泡實體 ID
    rgb_color: rgbColor.value, // RGB 顏色值
  };

  try {
    // 使用 fetch 發送 POST 請求
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });

    // 如果回應非 OK 則拋出錯誤
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 解析 API 回傳的 JSON 數據
    const result = await response.json();

    // 將結果顯示在頁面上
    responseMessage.value = `Status Code: ${response.status}, Response: ${JSON.stringify(result)}`;
  } catch (error) {
    // 處理錯誤並顯示錯誤訊息
    console.error('Error:', error);
    responseMessage.value = `Error: ${error.message}`;
  }
};
const handleColorChange = (event) => {
  selectedColor.value = event.target.value;
  convertHexToRgb(selectedColor.value);
  changeLightColor();
};
const setColor = (color) => {
  selectedColor.value = color;
  convertHexToRgb(selectedColor.value);
  changeLightColor();
};  

// 切換開關狀態的函數
const toggleSwitch = async () => {
  const ENTITY_ID = 'light.w41_n15a_deng_guang';
  const url = 'http://163.22.17.116:8122/api/turn_gate';
  const headers = {
    'Content-Type': 'application/json',
  };
  const data = {
    state: entity_state.value === 'on' ? 'off' : 'on',
    entity_id: ENTITY_ID,
  };

  try {
    // 發送 POST 請求
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const result = await response.json();
    console.log(result);  // 成功後顯示回應
    // 切換狀態後立即更新設備狀態
    await fetchDeviceState();
    
  } catch (error) {
    console.error('Error:', error);  // 處理錯誤
  }
};



//第一次掛載就去讀設備的資訊
onMounted(() => {
    fetchDeviceState();
    fetchHistoryData();
    const intervalId = setInterval(() => {
    fetchDeviceState(); // 定期調用更新數據
  }, 2000) // 每 2s更新一次

  // 清理計時器避免內存洩漏
  onUnmounted(() => {
    clearInterval(intervalId)
  })
});
</script>

<template>
  <div class="大框框">
    <div class="上一頁"> 
      <img src="\icon\回上一頁.svg" @click="GoHome"> 
    </div>
    <div class="顏色主要框">
        <div class="燈泡狀態">
            <!-- SVG -->
            <svg width="118" height="118" viewBox="0 0 118 118"  fill="#555" xmlns="http://www.w3.org/2000/svg"
            :style="{
              filter: `brightness(${Math.min(brightnessnum / 100,1)}) contrast(${3 + brightnessnum / 255}) saturate(${3 + brightnessnum / 255}) `,
              transition: 'filter 0.5s ease'
            }">
                <path d="M82.9974 10.0974C89.7091 15.9098 94.5136 24.4656 95.1834 33.418C95.2275 34.5992 95.24 35.7795 95.241 36.9614C95.2412 37.1261 95.2413 37.2908 95.2415 37.4605C95.2377 40.014 95.1041 42.4549 94.492 44.9414C94.4525 45.1103 94.4129 45.2792 94.3722 45.4532C93.7604 48.0225 92.879 50.4039 91.7264 52.7773C91.6578 52.9213 91.5893 53.0653 91.5186 53.2136C90.3343 55.674 88.7996 57.7807 87.117 59.9219C85.2503 62.2985 83.5165 64.6533 82.0467 67.2969C81.955 67.4576 81.8633 67.6184 81.7688 67.784C80.1679 70.6018 78.9788 73.5062 77.9001 76.5595C77.601 77.3931 77.2874 78.2215 76.9764 79.0508C65.1118 79.0508 53.2473 79.0508 41.0233 79.0508C40.2807 77.0707 40.2807 77.0707 39.9258 76.0979C38.9801 73.5361 37.941 71.0831 36.6443 68.6797C36.572 68.543 36.4996 68.4062 36.425 68.2653C35.034 65.6504 33.3279 63.3128 31.475 61.0094C24.9525 52.8742 21.8948 43.3069 22.9242 32.8661C23.8533 25.1707 27.4167 18.038 32.7264 12.4453C32.8344 12.3297 32.9425 12.2142 33.0538 12.0951C37.8384 7.00392 44.1442 3.48039 50.9334 1.84375C51.0838 1.80602 51.2341 1.76829 51.3891 1.72941C62.5253 -0.950142 74.4322 2.88472 82.9974 10.0974Z" :fill="selectedColor"/>
                <path d="M42.4063 94.4922C53.3582 94.4922 64.3101 94.4922 75.5938 94.4922C75.5938 104.172 75.5938 104.172 74.9024 105.324C74.1144 105.915 73.3224 105.822 72.3673 105.785C72.3245 106.061 72.2817 106.337 72.2376 106.621C71.6264 109.316 70.1776 111.492 68.2188 113.391C68.089 113.523 67.9592 113.654 67.8254 113.79C65.3299 116.146 61.9418 116.964 58.6059 116.929C54.9215 116.81 51.716 115.269 49.0899 112.699C47.3276 110.642 46.1066 108.455 45.6329 105.785C45.2692 105.807 45.2692 105.807 44.8983 105.828C43.9678 105.783 43.5855 105.668 42.8673 105.094C41.2854 101.93 42.4063 98.0294 42.4063 94.4922Z" :fill="selectedColor"/>
                <path d="M41.9453 83.8906C53.2014 83.8906 64.4575 83.8906 76.0547 83.8906C75.9214 85.8895 75.7751 87.8877 75.5938 89.8828C64.6419 89.8828 53.69 89.8828 42.4062 89.8828C41.9453 85.2734 41.9453 85.2734 41.9453 83.8906Z" :fill="selectedColor"/>
            </svg>
            <!-- 開關按鈕 -->
            <img class="開關按鈕"
                 src="/icon/開關燈.svg"
                 :class="brightnessnum === 0 ? 'icon-off' : (entity_state === 'on' ? 'icon-on' : 'icon-off')"
                 @click="toggleSwitch"
                 >
        </div>
        <div class="不包括reload框">
            <div class="顏色區">
                <div class="顏色標題">
                    <img src="/icon/顏色.svg" @click="toggleSwitch">
                    <div class="顏色文字">顏色</div>
                </div>
                <div class="color-options">
                    <div class="自選顏色">
                        <span class="color-display">
                            <input type="color" v-model="selectedColor" @input="handleColorChange" />
                        </span>
                    </div>
                    <!-- 白色 -->
                    <div class="color-circle" @click="setColor('#FFFFFF')" style="background-color: #FFFFFF;"></div>  
                    <!-- 黃色 -->
                    <div class="color-circle" @click="setColor('#FFFF00')" style="background-color: #FFFF00;"></div>
                    <!-- 綠色 -->
                    <div class="color-circle" @click="setColor('#00FF00')" style="background-color: #00FF00;"></div>
                    <!-- 藍色 -->
                    <div class="color-circle" @click="setColor('#0000FF')" style="background-color: #0000FF;"></div>
                </div>
            </div>
            <div class="亮度主要框">
                <!-- 顯示當前亮度 -->
                <div class="目前亮度">
                    <img src="\icon\亮度.svg">
                    <div class="亮度文字"> 亮度 </div>
                </div>
                <div class="滑軌">
                    <!-- 滑動條用於控制亮度 -->
                    <input 
                        type="range" 
                        min="0" 
                        max="255" 
                        v-model="brightnessnum" 
                        @input="changeBrightness" 
                        :style="{
                          '--value': `calc((${brightnessnum || 0} / 255) * 100%)`
                        }"
                        
                        />
                    <div class="亮度數值">
                        {{ Math.floor((brightnessnum/255)*100) }}%
                    </div>
                </div>
            </div>
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
    <div class="自動化框">
        <div class="自動化框標題">
            <div>自動化</div>
            <img src="/icon/箭頭更多.svg" class="箭頭更多" @click="GoBuldAutomationList">
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
    <div class="歷史紀錄框">
        <div class="歷史紀錄標題">
            <div class="歷史紀錄字">歷史紀錄</div>
            <div class="顯示更多資訊" @click="GoBuldHistoryFull">顯示更多資訊</div>
        </div>
        <div class="error" v-if="error">{{ error }}</div>
            <div  class="data" v-else>
              <div>
                  <div v-for="item in historyData" :key="item.last_changed">
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
/* 同時引入 Outfit 和 Oswald 字體 */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&family=Oswald:wght@400;700&display=swap');
/*定義亮度滑塊會需要的變數 */

.大框框{
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  font-family: 'Outfit', sans-serif;
  background-color: #ffffff;
  justify-content: space-around;
} 
/* 當螢幕寬度大於或等於1024px（電腦螢幕）時，設定為50% */
@media (min-width: 1024px) {
  .大框框 {
    width: 50vw; /* 將寬度改為50% */
    margin: 0 auto; /* 大框框的東西在中間 */
  }
}
.上一頁{
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  margin-left: 5%;
  margin-right: 5%;
  width: 90%;
  cursor: pointer;
  margin-top: 2%;
}
.顏色主要框{
  display: flex;
  flex-direction: row;
  border-radius: 10px 10px 0px 0px;
  width: 90%;
  margin-left: 5%;
  margin-right: 5%;
}
.燈泡狀態{
    background-color:#F3EBEB;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 20%;
    margin-top: 3%;
    padding: 5%;
    border-radius: 10px;
}
.開關按鈕{
    cursor: pointer;
    margin-top: 20%;
}
/* 設定當狀態是 "on" 和 "off" 時的顏色 */
.icon-on {
  filter: brightness(0.9) sepia(0) saturate(1500%) hue-rotate(330deg);
  /* 這裡的 filter 可以將圖標變為黃色 */
}

.icon-off {
  filter: grayscale(1);
  /* 這裡的 filter 可以將圖標變為灰色 */
}
.buld-off{
  filter:  brightness(0);
}
.不包括reload框{
  background-color:#F3EBEB;
  display: flex;
  width: 70%;
  align-items: flex-start;
  flex-direction: column;
  margin-left: 3%;
  margin-top: 3%;
  border-radius: 10px;
}
.顏色區{
    display: flex;
    flex-direction: column;
    /*div底線 */
    width: 100%;
    border-bottom:  1.5px solid #D2D2D2; 
}
.顏色標題{
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-left: 5%;
  margin-top: 5%;
}
.顏色文字{
  font-size: 15px;
  font-weight: bold;
  color: #634F4F;
  font-family: 'Outfit', sans-serif;
  margin-left: 2%;
}
.color-options {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-top: 5%;
  margin-bottom: 5%;
  width: 95%;
  flex-wrap: wrap;
  margin-left: 5%;
  gap: 10px;
}

.自選顏色{
    display: flex;
    width: 30px; 
    height: 30px; 
}
.color-picker {
  display: flex;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
input[type="color"] {
    opacity: 0; /* 隱藏原有的顏色選擇器 */
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
}
.color-display {
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  width: 30px; 
  height: 30px; 
  border: none;
  border-radius: 50%;
  background-image: url("/icon/調色盤.svg");
  background-size: cover;
  background-position: center;
  position: relative; /* 讓 選顏色 的位置相對於 color-display */
  margin-left: 3%;
}
.color-circle {
  width: 30px; 
  height: 30px; 
  border-radius: 50%;
  cursor: pointer;
  margin-left: 1%;
}


.亮度主要框{
  background-color:#F3EBEB;
  display: flex;
  flex-direction: column;
  width: 90%;
  border-radius: 0px 0px 10px 10px;
  margin-left: 5%;
  margin-right: 5%;
}
.目前亮度{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  font-size: 15px;
  font-weight: bold;
  color: #634F4F;
  margin-top: 5%;
  font-family: 'Outfit', sans-serif;
  width: 100%;
}
.亮度文字{
    margin-left: 2%;
}

.滑軌{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    margin-right: 5%;
}
.亮度數值{
    font-size: 15px;
    font-weight: bold;
    color: #634F4F;
    margin-left: 5%;
    font-family: 'Outfit', sans-serif;
}
input[type="range"] {
  appearance: none; /* 移除預設樣式 */
  -webkit-appearance: none; /* Chrome 和 Safari */
  -moz-appearance: none;      /* Firefox */
  width: 100%;
  height: 40px;
  background: transparent; /* 滑軌的顏色 */
  outline: none; /* 移除滑軌的外框 */
}

/* 針對滑軌的自定義樣式 */
input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 25px; /* 滑軌的高度 */
  background: #524A4A; /* 滑軌的顏色 */
  border-radius: 15px ; /* 滑軌的圓角 */
  /*滑過的顏色*/ 
  background: linear-gradient(to right, 
    #ffffff 0%, 
    #ffffff max(0.05%, var(--value)), 
    #524A4A max(0.05%, var(--value)), 
    #524A4A 100%
  );

}

/* 針對滑塊的自定義樣式 */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; /* 移除預設外觀 */
  /*不能隱藏滑塊 display:none 這樣就不能調整亮度了 */
  height: 25px; /* 設定滑塊的高度 */
  width: 25px; /* 設定滑塊的寬度 */
  background: transparent; /* 設定滑塊的顏色 */
  cursor: pointer; /* 設定滑塊的游標 */
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
  margin-top: 2%;
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

.自動化框{
  background-color:#F3EBEB;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  margin-left: 5%;
  margin-right: 5%;
  padding-bottom: 3%;
  margin-top: 2%;
}

.自動化框標題{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-size: 15px;
  font-weight: bold;
  color: #634F4F;
  margin-top: 20px;
  margin-left: 5%;
  padding-bottom: 1%;
  font-family: 'Outfit', sans-serif;
  border-bottom:  1.5px solid #D2D2D2; 
}

.箭頭更多{
  width: 25px;
  height: 25px;
  margin-right: 5%;
  cursor: pointer;
}

.自動化內容{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  font-size: 15px;
  margin-top: 2%;
  color: #524141;
  margin-left: 5%;
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
.歷史紀錄框{
  background-color:#F3EBEB;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  margin-left: 5%;
  margin-right: 5%;
  padding-bottom: 3%;
  overflow-y: hidden; /* 隱藏超出邊框的內容 */
  margin-bottom: 3%;
  margin-top: 2%;
}


.歷史紀錄標題{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-size: 15px;
  font-weight: bold;
  color: #634F4F;
  margin-top: 20px;
  margin-left: 5%;
  padding-bottom: 1%;
  font-family: 'Outfit', sans-serif;
  border-bottom:  1.5px solid #D2D2D2;; 
}

.歷史紀錄字{
  color: #634F4F;
  margin-right: 5%;
  font-family: 'Outfit', sans-serif;
}
.顯示更多資訊{
  color: #634F4F;
  margin-right: 5%;
  font-family: 'Outfit', sans-serif;
  font-weight: none;
  text-decoration: underline; /* 添加底線 */
  cursor: pointer;
}

/*歷史資料*/
.error{
    color: #e31515;
    font-size: 30px;
    margin-top: 20px;
    font-family: 'Outfit', sans-serif;
    font-weight: bold;
}
.data{
    color: #614C4C;
    font-size: 18px;
    font-family: 'Outfit', sans-serif;
    font-weight: bold;
    line-height: 2; /* 調整行距*/
    margin-left: 5%;
    margin-top: 3%;
    width: 90%;
    overflow-y: scroll; /* 隱藏超出邊框的內容 */
}
.day{
    background-color:transparent;
    font-size: 12px;
    font-family: 'Outfit', sans-serif;
    font-weight: none;
    color:#9E9797
} 

.日期{
    font-size: 12px;
    font-family: 'Outfit', sans-serif;
    font-weight: none;
    color:#9E9797;
    margin-top: 5px;
}

.內容{
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
    cursor: pointer;
  }

/* 滾動條滑道（背景） */
::-webkit-scrollbar-track {
    background: #D9D9D9;      /* 背景色 */
    border-radius: 10px;      /* 圓角 */
    cursor: pointer;
  }

/* 滾動條滑塊 */
::-webkit-scrollbar-thumb {
    background: #888;         /* 顏色 */
    border-radius: 10px;      /* 圓角 */
    cursor: pointer;
  }

/* 當滑鼠懸停於滾動條上時 */
::-webkit-scrollbar-thumb:hover {
    background: #555;         /* 懸停時的顏色 */
    cursor: pointer;
}
</style>