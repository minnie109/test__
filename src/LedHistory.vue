<script setup>
import { ref ,onMounted,onUnmounted } from 'vue';

/* 串畫面區 */
  /* 這個畫面會連到哪些畫面App 那邊怎麼定義，這邊要一樣 */
  const emit = defineEmits(['GoHome','GoLedAutomationList','GoLedHistoryFull']);
  /* 內部函數定義 : 該畫面按鈕點擊後會觸發的函數 */
  function GoHome(){
    emit('GoHome');
  }
  function GoLedAutomationList(){
    emit('GoLedAutomationList');
  }
  function GoLedHistoryFull(){
    emit('GoLedHistoryFull');
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
const entityId = ref('light.zhi_hui_deng_tiao');
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
    entity_state.value = data.message[1].state;
    // 如果 brightness 不是 null，則設置為 brightness 的值，否則設置為 0
    if (data.message[1].attributes.brightness !== null) {
      brightnessnum.value = data.message[1].attributes.brightness;
    } else {
      brightnessnum.value = 0;
    }
    all.value = data;
    if (data.message[1].attributes.rgb_color !== null) {
      rgb.value = data.message[1].attributes.rgb_color;
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
    entity_id: 'light.zhi_hui_deng_tiao', // 燈泡實體 ID
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
    entity_id: 'light.zhi_hui_deng_tiao', // 替換為你的燈泡實體 ID
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
  const ENTITY_ID = 'light.zhi_hui_deng_tiao';
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
    fetchHistoryData();
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
          <svg width="118" height="118" viewBox="0 0 118 118" fill="none" xmlns="http://www.w3.org/2000/svg"
          :style="{
              filter: `brightness(${Math.min(brightnessnum / 100,1)}) contrast(${3 + brightnessnum / 255}) saturate(${3 + brightnessnum / 255}) `,
              transition: 'filter 0.5s ease'
            }">
              <path d="M78.8203 35.0312C84.9807 35.0312 91.1412 35.0312 97.4883 35.0312C97.3334 37.1989 97.1431 39.3168 96.8451 41.4632C96.803 41.772 96.761 42.0809 96.719 42.3898C96.6049 43.2288 96.4894 44.0676 96.3737 44.9063C96.2487 45.8145 96.1249 46.7229 96.0009 47.6313C95.7865 49.2018 95.5712 50.7722 95.3554 52.3425C95.0435 54.6129 94.7327 56.8835 94.4222 59.154C93.9182 62.8387 93.4133 66.5231 92.9079 70.2076C92.4171 73.7849 91.9268 77.3622 91.4371 80.9397C91.4068 81.1605 91.3766 81.3813 91.3455 81.6088C91.1938 82.7167 91.0422 83.8246 90.8905 84.9325C89.6341 94.1114 88.3759 103.29 87.1172 112.469C80.9568 112.469 74.7963 112.469 68.4492 112.469C68.6041 110.301 68.7944 108.183 69.0924 106.037C69.1345 105.728 69.1765 105.419 69.2185 105.11C69.3326 104.271 69.4481 103.432 69.5638 102.594C69.6888 101.685 69.8126 100.777 69.9366 99.8687C70.151 98.2982 70.3663 96.7278 70.5821 95.1575C70.894 92.8871 71.2048 90.6165 71.5153 88.346C72.0193 84.6613 72.5242 80.9769 73.0296 77.2924C73.5204 73.7151 74.0107 70.1378 74.5004 66.5603C74.5307 66.3395 74.5609 66.1187 74.592 65.8912C74.7437 64.7833 74.8953 63.6754 75.047 62.5675C76.3034 53.3886 77.5616 44.2099 78.8203 35.0312ZM82.0991 41.2899C81.1929 42.6521 81.1945 44.0475 81.3555 45.6328C81.7642 47.1642 82.8412 48.208 84.1211 49.0898C85.5036 49.7676 87.0902 49.804 88.572 49.4085C89.9845 48.7851 91.0904 47.6129 91.7662 46.2342C92.2055 44.8499 92.2023 43.2122 91.6113 41.8733C90.8092 40.506 89.5519 39.4259 88.0391 38.9492C85.3371 38.6205 83.8198 39.252 82.0991 41.2899ZM80.2553 56.0399C79.3491 57.4021 79.3507 58.7975 79.5117 60.3828C79.9204 61.9142 80.9975 62.958 82.2773 63.8398C83.6599 64.5176 85.2464 64.554 86.7283 64.1585C88.1408 63.5351 89.2466 62.3629 89.9224 60.9842C90.3617 59.5999 90.3586 57.9622 89.7676 56.6233C88.9655 55.256 87.7082 54.1759 86.1953 53.6992C83.4933 53.3706 81.976 54.002 80.2553 56.0399ZM78.4116 70.7899C77.5054 72.1521 77.507 73.5475 77.668 75.1328C78.0767 76.6642 79.1537 77.708 80.4336 78.5898C81.8161 79.2676 83.4027 79.304 84.8845 78.9085C86.297 78.285 87.4029 77.1129 88.0787 75.7342C88.518 74.3499 88.5148 72.7122 87.9238 71.3733C87.1217 70.006 85.8644 68.9259 84.3516 68.4492C81.6496 68.1205 80.1323 68.752 78.4116 70.7899ZM76.5678 85.5399C75.6616 86.9021 75.6632 88.2975 75.8242 89.8828C76.2329 91.4142 77.31 92.458 78.5898 93.3398C79.9724 94.0176 81.5589 94.054 83.0408 93.6585C84.4533 93.035 85.5591 91.8629 86.2349 90.4842C86.6742 89.0999 86.6711 87.4622 86.0801 86.1233C85.278 84.756 84.0207 83.6759 82.5078 83.1992C79.8058 82.8705 78.2885 83.502 76.5678 85.5399ZM74.7241 100.29C73.8179 101.652 73.8195 103.047 73.9805 104.633C74.3892 106.164 75.4662 107.208 76.7461 108.09C78.1286 108.768 79.7152 108.804 81.197 108.409C82.6095 107.785 83.7154 106.613 84.3912 105.234C84.8305 103.85 84.8273 102.212 84.2363 100.873C83.4342 99.506 82.1769 98.4259 80.6641 97.9492C77.9621 97.6205 76.4448 98.252 74.7241 100.29Z" :fill="selectedColor"/>
              <path d="M30.8828 5.53125C37.0432 5.53125 43.2037 5.53125 49.5508 5.53125C49.3959 7.6989 49.2056 9.81676 48.9076 11.9632C48.8655 12.272 48.8235 12.5809 48.7815 12.8898C48.6674 13.7288 48.5519 14.5676 48.4362 15.4063C48.3112 16.3145 48.1874 17.2229 48.0634 18.1313C47.849 19.7018 47.6337 21.2722 47.4179 22.8425C47.106 25.1129 46.7952 27.3835 46.4847 29.654C45.9807 33.3387 45.4758 37.0231 44.9704 40.7076C44.4796 44.2849 43.9893 47.8622 43.4996 51.4397C43.4693 51.6605 43.4391 51.8813 43.408 52.1088C43.2563 53.2167 43.1047 54.3246 42.953 55.4325C41.6966 64.6114 40.4384 73.7901 39.1797 82.9688C33.0193 82.9688 26.8588 82.9688 20.5117 82.9688C20.6666 80.8011 20.8569 78.6832 21.1549 76.5368C21.197 76.228 21.239 75.9191 21.281 75.6102C21.3951 74.7712 21.5106 73.9324 21.6263 73.0937C21.7513 72.1855 21.8751 71.2771 21.9991 70.3687C22.2135 68.7982 22.4288 67.2278 22.6446 65.6575C22.9565 63.3871 23.2673 61.1165 23.5778 58.846C24.0818 55.1613 24.5867 51.4769 25.0921 47.7924C25.5829 44.2151 26.0732 40.6378 26.5629 37.0603C26.5932 36.8395 26.6234 36.6187 26.6545 36.3912C26.8062 35.2833 26.9578 34.1754 27.1095 33.0675C28.3659 23.8886 29.6241 14.7099 30.8828 5.53125ZM34.1616 11.7899C33.2554 13.1521 33.257 14.5475 33.418 16.1328C33.8267 17.6642 34.9037 18.708 36.1836 19.5898C37.5661 20.2676 39.1527 20.304 40.6345 19.9085C42.047 19.2851 43.1529 18.1129 43.8287 16.7342C44.268 15.3499 44.2648 13.7122 43.6738 12.3733C42.8717 11.006 41.6144 9.92591 40.1016 9.44922C37.3996 9.12055 35.8823 9.75201 34.1616 11.7899ZM32.3178 26.5399C31.4116 27.9021 31.4132 29.2975 31.5742 30.8828C31.9829 32.4142 33.06 33.458 34.3398 34.3398C35.7224 35.0176 37.3089 35.054 38.7908 34.6585C40.2033 34.0351 41.3091 32.8629 41.9849 31.4842C42.4242 30.0999 42.4211 28.4622 41.8301 27.1233C41.028 25.756 39.7707 24.6759 38.2578 24.1992C35.5558 23.8706 34.0385 24.502 32.3178 26.5399ZM30.4741 41.2899C29.5679 42.6521 29.5695 44.0475 29.7305 45.6328C30.1392 47.1642 31.2162 48.208 32.4961 49.0898C33.8786 49.7676 35.4652 49.804 36.947 49.4085C38.3595 48.785 39.4654 47.6129 40.1412 46.2342C40.5805 44.8499 40.5773 43.2122 39.9863 41.8733C39.1842 40.506 37.9269 39.4259 36.4141 38.9492C33.7121 38.6205 32.1948 39.252 30.4741 41.2899ZM28.6303 56.0399C27.7241 57.4021 27.7257 58.7975 27.8867 60.3828C28.2954 61.9142 29.3725 62.958 30.6523 63.8398C32.0349 64.5176 33.6214 64.554 35.1033 64.1585C36.5158 63.535 37.6216 62.3629 38.2974 60.9842C38.7367 59.5999 38.7336 57.9622 38.1426 56.6233C37.3405 55.256 36.0832 54.1759 34.5703 53.6992C31.8683 53.3705 30.351 54.002 28.6303 56.0399ZM26.7866 70.7899C25.8804 72.1521 25.882 73.5475 26.043 75.1328C26.4517 76.6642 27.5287 77.708 28.8086 78.5898C30.1911 79.2676 31.7777 79.304 33.2595 78.9085C34.672 78.285 35.7779 77.1129 36.4537 75.7342C36.893 74.3499 36.8898 72.7122 36.2988 71.3733C35.4967 70.006 34.2394 68.9259 32.7266 68.4492C30.0246 68.1205 28.5073 68.752 26.7866 70.7899Z" :fill="selectedColor"/>
              <path d="M52.3165 11.9844C52.8028 12.7137 53.0078 13.3186 53.2673 14.1542C53.3144 14.3049 53.3616 14.4557 53.4101 14.611C53.5679 15.1164 53.7241 15.6224 53.8803 16.1283C53.9928 16.4898 54.1054 16.8513 54.2181 17.2127C54.461 17.9923 54.7031 18.772 54.9448 19.552C55.3316 20.8006 55.7199 22.0487 56.1085 23.2967C56.5822 24.8185 57.0555 26.3403 57.5284 27.8623C58.3499 30.5063 59.1741 33.1495 60.0003 35.792C60.0592 35.9804 60.1182 36.1688 60.1788 36.3629C60.4158 37.1209 60.6529 37.8788 60.8899 38.6368C61.3026 39.9563 61.715 41.2758 62.1273 42.5954C62.1859 42.783 62.2445 42.9706 62.3049 43.1639C62.4237 43.544 62.5425 43.9242 62.6613 44.3043C63.6127 47.3495 64.5647 50.3945 65.5172 53.4394C65.988 54.9444 66.4587 56.4495 66.9293 57.9545C67.3136 59.1834 67.6981 60.4122 68.0827 61.641C68.3196 62.3982 68.5564 63.1555 68.7932 63.9128C68.9028 64.2633 69.0124 64.6137 69.1222 64.9642C69.2726 65.4445 69.4227 65.9248 69.5728 66.4052C69.6568 66.6736 69.7407 66.9419 69.8272 67.2184C69.9438 67.5995 69.9438 67.5995 70.0626 67.9883C70.1488 68.2396 70.2349 68.4909 70.3237 68.7498C70.8311 70.9123 70.4064 73.104 70.1078 75.2742C70.063 75.6079 70.0183 75.9417 69.9738 76.2754C69.8533 77.175 69.7309 78.0743 69.608 78.9735C69.5054 79.725 69.4039 80.4766 69.3022 81.2283C69.0627 82.9997 68.8217 84.771 68.5796 86.5421C68.3296 88.3705 68.0824 90.1992 67.8365 92.0281C67.6251 93.5998 67.412 95.1713 67.1976 96.7427C67.0697 97.6806 66.9423 98.6187 66.8166 99.557C66.6985 100.437 66.5784 101.317 66.4568 102.196C66.4124 102.52 66.3687 102.844 66.3258 103.167C66.2673 103.607 66.2061 104.047 66.1446 104.487C66.111 104.733 66.0775 104.98 66.0429 105.234C66.0004 105.416 65.958 105.598 65.9142 105.785C65.7621 105.861 65.61 105.937 65.4533 106.016C64.7131 103.668 63.9738 101.32 63.235 98.9719C63.15 98.7018 63.15 98.7018 63.0633 98.4262C61.2625 92.7023 59.4781 86.9735 57.7065 81.2405C56.4489 77.1711 55.1853 73.1038 53.9046 69.0416C53.8458 68.8551 53.787 68.6687 53.7265 68.4765C53.1583 66.6747 52.5893 64.8731 52.0191 63.0719C51.5053 61.449 50.9935 59.8254 50.4848 58.2008C50.1514 57.1369 49.8142 56.0743 49.4753 55.0121C49.2351 54.257 48.9978 53.5011 48.7611 52.7449C48.6477 52.3846 48.5332 52.0247 48.4174 51.6652C48.2564 51.1645 48.0996 50.6627 47.9437 50.1604C47.8533 49.8752 47.763 49.59 47.6699 49.2962C47.1973 47.1 47.5909 44.925 47.8962 42.7258C47.9413 42.3921 47.9864 42.0583 48.0313 41.7246C48.1527 40.825 48.2761 39.9257 48.3999 39.0265C48.5293 38.084 48.6572 37.1413 48.7853 36.1986C49.0002 34.6182 49.2164 33.038 49.4334 31.4579C49.6844 29.6295 49.9337 27.8008 50.1819 25.9719C50.421 24.2114 50.6611 22.451 50.9018 20.6906C51.0042 19.9415 51.1063 19.1923 51.2081 18.443C51.3277 17.563 51.4482 16.6832 51.5696 15.8035C51.614 15.48 51.6582 15.1563 51.7019 14.8327C51.7615 14.3927 51.8224 13.953 51.8834 13.5132C51.9171 13.2666 51.9509 13.02 51.9857 12.7659C52.0861 12.2148 52.0861 12.2148 52.3165 11.9844Z" :fill="selectedColor"/>
              <path d="M80.2033 101.406C80.7795 101.752 80.7795 101.752 81.1252 102.328C81.3075 103.255 81.2684 103.933 80.7795 104.748C79.9646 105.237 79.2863 105.276 78.3595 105.094C77.7834 104.748 77.7834 104.748 77.4377 104.172C77.2554 103.245 77.2944 102.567 77.7834 101.752C78.5983 101.263 79.2766 101.224 80.2033 101.406Z" :fill="selectedColor"/>
              <path d="M82.047 86.6562C82.6232 87.0019 82.6232 87.0019 82.9689 87.5781C83.1512 88.5048 83.1122 89.1831 82.6232 89.998C81.8083 90.487 81.13 90.526 80.2033 90.3437C79.6271 89.998 79.6271 89.998 79.2814 89.4219C79.0991 88.4952 79.1382 87.8169 79.6271 87.0019C80.442 86.513 81.1203 86.4739 82.047 86.6562Z" :fill="selectedColor"/>
              <path d="M83.8908 71.9062C84.467 72.252 84.467 72.252 84.8127 72.8281C84.995 73.7548 84.9559 74.4331 84.467 75.248C83.6521 75.737 82.9738 75.7761 82.047 75.5937C81.4709 75.248 81.4709 75.248 81.1252 74.6719C80.9429 73.7452 80.9819 73.0669 81.4709 72.252C82.2858 71.763 82.9641 71.7239 83.8908 71.9062Z" :fill="selectedColor"/>
              <path d="M32.2658 71.9062C32.842 72.252 32.842 72.252 33.1877 72.8281C33.37 73.7548 33.3309 74.4331 32.842 75.248C32.0271 75.737 31.3488 75.7761 30.422 75.5937C29.8459 75.248 29.8459 75.248 29.5002 74.6719C29.3179 73.7452 29.3569 73.0669 29.8459 72.252C30.6608 71.763 31.3391 71.7239 32.2658 71.9062Z" :fill="selectedColor"/>
              <path d="M85.7345 57.1563C86.3107 57.502 86.3107 57.502 86.6564 58.0781C86.8387 59.0048 86.7997 59.6831 86.3107 60.4981C85.4958 60.987 84.8175 61.0261 83.8908 60.8438C83.3146 60.4981 83.3146 60.4981 82.9689 59.9219C82.7866 58.9952 82.8257 58.3169 83.3146 57.502C84.1295 57.013 84.8078 56.974 85.7345 57.1563Z" :fill="selectedColor"/>
              <path d="M34.1095 57.1563C34.6857 57.502 34.6857 57.502 35.0314 58.0781C35.2137 59.0048 35.1747 59.6831 34.6857 60.4981C33.8708 60.987 33.1925 61.0261 32.2658 60.8438C31.6896 60.4981 31.6896 60.4981 31.3439 59.9219C31.1616 58.9952 31.2007 58.3169 31.6896 57.502C32.5045 57.013 33.1828 56.974 34.1095 57.1563Z" :fill="selectedColor"/>
              <path d="M87.5783 42.4063C88.1545 42.752 88.1545 42.752 88.5002 43.3281C88.6825 44.2548 88.6434 44.9331 88.1545 45.7481C87.3396 46.237 86.6613 46.2761 85.7345 46.0938C85.1584 45.7481 85.1584 45.7481 84.8127 45.1719C84.6304 44.2452 84.6694 43.5669 85.1584 42.752C85.9733 42.263 86.6516 42.224 87.5783 42.4063Z" :fill="selectedColor"/>
              <path d="M35.9533 42.4063C36.5295 42.752 36.5295 42.752 36.8752 43.3281C37.0575 44.2548 37.0184 44.9331 36.5295 45.7481C35.7146 46.237 35.0363 46.2761 34.1095 46.0938C33.5334 45.7481 33.5334 45.7481 33.1877 45.1719C33.0054 44.2452 33.0444 43.5669 33.5334 42.752C34.3483 42.263 35.0266 42.224 35.9533 42.4063Z" :fill="selectedColor"/>
              <path d="M37.797 27.6563C38.3732 28.002 38.3732 28.002 38.7189 28.5781C38.9012 29.5048 38.8622 30.1831 38.3732 30.9981C37.5583 31.487 36.88 31.5261 35.9533 31.3438C35.3771 30.9981 35.3771 30.9981 35.0314 30.4219C34.8491 29.4952 34.8882 28.8169 35.3771 28.002C36.192 27.513 36.8703 27.474 37.797 27.6563Z" :fill="selectedColor"/>
              <path d="M39.6408 12.9062C40.217 13.252 40.217 13.252 40.5627 13.8281C40.745 14.7548 40.7059 15.4331 40.217 16.248C39.4021 16.737 38.7238 16.7761 37.797 16.5937C37.2209 16.248 37.2209 16.248 36.8752 15.6719C36.6929 14.7452 36.7319 14.0669 37.2209 13.252C38.0358 12.763 38.7141 12.7239 39.6408 12.9062Z" :fill="selectedColor"/>
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
            <img src="/icon/箭頭更多.svg" class="箭頭更多" @click="GoLedAutomationList">
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
            <div class="顯示更多資訊" @click="GoLedHistoryFull">顯示更多資訊</div>
        </div>
        <div class="error" v-if="error">{{ error }}</div>
            <div  class="data" v-else>
              <div>
                  <div v-for="item in historyData" :key="item.last_changed">
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
  margin-top: 4%;
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