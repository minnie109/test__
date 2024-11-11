<script setup>
  import { ref,onMounted, onUnmounted ,computed } from "vue";
  
/* 串畫面區 */
  /* 這個畫面會連到哪些畫面App 那邊怎麼定義，這邊要一樣 */
  const emit = defineEmits(['GoChat','GoAccount','GoMode','GoFavorite',
  'GoBuldHistory','GoLedHistory','GoTuyaPlugHistory','GoTapoPlugHistory','GoSensorDoorHistory','GoSensorWeatherHistory','GoAddTapo','GoAllHistory']);

  /* 內部函數定義 : 該畫面按鈕點擊後會觸發的函數 */
  function GoChat(){
    emit('GoChat');
  }
  function GoAddTapo(){
    emit('GoAddTapo');
  }
  function GoFavorite(){
    emit('GoFavorite');
  }
  function GoAccount(){
    emit('GoAccount');
  }
  
  // 內容有多行時，用這種寫法
  let GoMode = function(){
    emit('GoMode');
  };

  function GoBuldHistory(){
    emit('GoBuldHistory');
  }
  function GoLedHistory(){
    emit('GoLedHistory');
  }
  function GoTapoPlugHistory(){
    emit('GoTapoPlugHistory');
  }

  function GoTuyaPlugHistory(){
    emit('GoTuyaPlugHistory');
  }
  function GoSensorDoorHistory(){
    emit('GoSensorDoorHistory');
  }
  function GoSensorWeatherHistory(){
    emit('GoSensorWeatherHistory');
  }
  function GoAllHistory(){
    emit('GoAllHistory');
  }
//區域文字變化
//預設:全部
const activePlace = ref('全部');
function setActive(place) {
  activePlace.value = place;
}
//加入我的最愛 愛心變化
// 各裝置追蹤愛心的點選狀態
const 燈條HeartSelected = ref(false);
const 燈泡HeartSelected = ref(false);
const TuyaPlugHeartSelected = ref(false);
const TapoPlugHeartSelected = ref(false);
const 門窗感應器HeartSelected = ref(false);
const 溫濕度感應器HeartSelected = ref(false);
// 切換愛心狀態的函數
function toggleHeart(element) {
  switch(element){
    case '燈條':
      燈條HeartSelected.value = !燈條HeartSelected.value;
      break;
    case '燈泡':
      燈泡HeartSelected.value = !燈泡HeartSelected.value;
      break;
    case 'TuyaPlug':
      TuyaPlugHeartSelected.value = !TuyaPlugHeartSelected.value;
      break;
    case 'TapoPlug':
      TapoPlugHeartSelected.value = !TapoPlugHeartSelected.value;
      break;
    case '門窗感應器':
      門窗感應器HeartSelected.value = !門窗感應器HeartSelected.value;
      break;
    case '溫濕度感應器':
      溫濕度感應器HeartSelected.value = !溫濕度感應器HeartSelected.value;
      break;
  }
 
}

// 查看右上角更多設定
let 查看更多 = ref(false);
const toggleMoreSettings = () => {
  查看更多.value = !查看更多.value;
  裝置畫面.value = !裝置畫面.value;
};
//確認刪除畫面
let showConfirmDelete = ref(false);

let 編輯畫面 = ref(false);
let 裝置畫面 = ref(true);
function 取消 (){
  編輯畫面.value = false;
  查看更多.value = false;
  裝置畫面.value = true;
}
function 刪除設備(){
  編輯畫面.value = true;
  查看更多.value = false;
}
function 刪除功能(){
  showConfirmDelete.value = true;
}
function 恢復(){
  showConfirmDelete.value = false;
}
//讀取設備初始狀態 API
  //燈泡的狀態變數
  const BulbisChecked = ref(null);
  // 燈泡實體ID 
  const bulbENTITY_ID = 'light.w41_n15a_deng_guang'
  
  //燈條的狀態變數
  const LEDisChecked = ref(null);
  // 燈條實體ID
  const LEDENTITY_ID = 'light.zhi_hui_deng_tiao'
  
  // Tuya 插座的狀態變數
  const PlugTuyaisChecked = ref(null);
  // Tuya 插座實體ID
  const TuyaPlugENTITY_ID = 'switch.zhi_hui_cha_zuo_socket_1'
  
  // Tapo 插座的狀態變數
  const PlugTapoisChecked = ref(null);
  // Tapo 插座實體ID
  const TapoPlugENTITY_ID = 'switch.zhi_hui_xing_cha_zuo'
  // 切換開關函數
const toggleSwitch = async (device) => {
  let isChecked
  let entityId
  // 判斷是控制哪個裝置
  if (device === 'bulb') {
    BulbisChecked.value = !BulbisChecked.value
    isChecked = BulbisChecked.value
    entityId = bulbENTITY_ID
  } else if (device === 'LED') {
    LEDisChecked.value = !LEDisChecked.value
    isChecked = LEDisChecked.value
    entityId = LEDENTITY_ID
  } else if (device === 'TuyaPlug') {
    PlugTuyaisChecked.value = !PlugTuyaisChecked.value
    isChecked = PlugTuyaisChecked.value
    entityId = TuyaPlugENTITY_ID
  }else if (device === 'TapoPlug') {
    PlugTapoisChecked.value = !PlugTapoisChecked.value
    isChecked = PlugTapoisChecked.value
    entityId = TapoPlugENTITY_ID
  }
  // 根據 isChecked 狀態決定發送到 API 的 state
  const newState = isChecked ? 'on' : 'off'
  try {
    // 發送 API 請求
    const response = await fetch('http://163.22.17.116:8122/api/turn_gate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        state: newState,
        entity_id: entityId,
      }),
    })

    // 確認請求是否成功
    const result = await response.json()
    if (result.success) {
      console.log('設備狀態已更新:', result)
    } else {
      console.error('更新失敗:', result)
    }
  } catch (error) {
    console.error('API 請求錯誤:', error)
  }
}

  //API :　將燈泡、燈條設備資訊讀進來
  const LightData = ref(null)
  const LightOK = ref(null)
  const LighterrorMessage = ref('')
  const LightfetchDeviceData = async () => {
    try {
      const response = await fetch(`http://163.22.17.116:8122/api/turn_gate/light`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
  
      const datalight = await response.json()
      LightData.value = datalight.message  // 將 API 回應的數據存到 LightData
      //是否成功抓到資料
      LightOK.value = datalight.success
      BulbisChecked.value = LightData.value[0].state === 'on' ? true : false;
      LEDisChecked.value = LightData.value[1].state === 'on' ? true : false;
    } catch (error) {
      LighterrorMessage.value = `Error: ${error.message}`
    }
  }

  //API :　將tuya插座、tapo插座設備資訊讀進來
  const PlugData = ref(null)
  const PlugOK = ref(null)
  const PlugErrorMessage = ref('')
  const PlugfetchDeviceData = async () => {
    try {
      const response = await fetch(`http://163.22.17.116:8122/api/turn_gate/switch`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
  
      const dataplug = await response.json()
      PlugData.value = dataplug.message  // 將 API 回應的數據存到 LightData
      //是否成功抓到資料
      PlugOK.value = dataplug.success
      PlugTuyaisChecked.value = PlugData.value[1].state === 'on' ? true : false;
      PlugTapoisChecked.value = PlugData.value[0].state === 'on' ? true : false;
    } catch (error) {
      PlugErrorMessage.value = `Error: ${error.message}`
    }
  }

  //API :　將sensor類設備資訊讀進來
  // 門窗感應器、溫度、濕度
  const SensorOK = ref(null)
  const SensorData = ref(null)
  const SensorErrorMessage = ref('')
  // 定義要篩選的 `entity_id` 清單
  //門窗感應器、溫度、濕度
  const targetEntityIds = ['sensor.isa_dw2hl_d3b8_illumination', 'sensor.mg_wifi_t_h_sensor_temperature','sensor.mg_wifi_t_h_sensor_humidity']
  const SensorfetchDeviceData = async () => {
    try {
      const response = await fetch(`http://163.22.17.116:8122/api/turn_gate/sensor`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
  
      const datasensor = await response.json()
      SensorData.value = datasensor // 將 API 回應的數據存儲到 deviceData
      //是否成功抓到sensor資料
      SensorOK.value = datasensor.success
      
    } catch (error) {
      SensorErrorMessage.value = `Error: ${error.message}`
    }
  }
  //使用 computed 來過濾符合條件的資料
  const filteredDeviceData = computed(() => {
    return SensorData.value?.message?.filter(item => targetEntityIds.includes(item.entity_id)) || []
  })
  
//第一次掛載就去讀設備的資訊
onMounted(() => {
  LightfetchDeviceData()
  PlugfetchDeviceData()
  SensorfetchDeviceData()
  const intervalId = setInterval(() => {
    LightfetchDeviceData() // 定期調用更新數據
    PlugfetchDeviceData()
    SensorfetchDeviceData()
  }, 2000) // 每 2s更新一次

  // 清理計時器避免內存洩漏
  onUnmounted(() => {
    clearInterval(intervalId)
  })
});


</script>

<template>
<meta name="viewport" content="width=device-width, initial-scale=1">
<div class="裝置container">
  <!--頂部列表-->
  <div class="裝置top">
    <div class="裝置標題" >裝置</div>
    <div class="裝置topButton" >
      <img class="裝置個別icon" src="/icon/機器人.svg" @click="GoChat">
      <img class="裝置個別icon" src="/icon/使用者.svg" @click="GoAccount">
    </div>
  </div>
  <!--裝置列表-->
  <div class="裝置body">
    <div class="更多設定">
        <img v-if="!編輯畫面" class="更多icon" src="/icon/更多_直.svg" @click="toggleMoreSettings">
        <img v-if="編輯畫面" class="取消icon" src="/icon/取消按鈕.svg" @click="取消"> 
    </div>
    <!--點擊查看更多後的畫面-->
    <div class="更多設定btn"  v-if="查看更多">
      <div class="history" @click="GoAllHistory">查看設備歷史紀錄</div>
      <div class="delete" @click="刪除設備">刪除設備</div>
    </div>
    
    <div class="區域" v-if="裝置畫面">
      <div 
        class="place" 
        :class="{ active: activePlace === '全部' }" 
        @click="setActive('全部')">
        全部
      </div>
      <div 
        class="place" 
        :class="{ active: activePlace === '臥室' }" 
        @click="setActive('臥室')">
        臥室
      </div>
      <div 
        class="place" 
        :class="{ active: activePlace === '客廳' }" 
        @click="setActive('客廳')">
        客廳
      </div>
      <div 
        class="place" 
        :class="{ active: activePlace === '廚房' }" 
        @click="setActive('廚房')">
        廚房
      </div>
    </div>
    <!--各設備-->
    <div class="自動化body" v-if="編輯畫面">    
      <div class="所有模式modeframe">
        <div class="模式塊區">
          <div class="模式塊" >
            <img src="/icon/燈泡.svg" alt="work" class="left" @click="工作模式">
            <span class="right">燈泡</span>
            <img class="rightIcon" src="/icon/垃圾桶.svg" @click="刪除功能">
          </div>
          <div class="模式塊">
            <img src="/icon/燈條.svg" alt="goout" class="left">
            <span class="right">燈條</span>
            <img class="rightIcon" src="/icon/垃圾桶.svg" @click="刪除功能">
          </div>
          <div class="模式塊" >
            <img src="/icon/插座.svg" alt="home" class="left">
            <span class="right">Tuya插座</span>
            <img class="rightIcon" src="/icon/垃圾桶.svg"@click="刪除功能" >
          </div>
          <div class="模式塊" >
            <img src="/icon/插座.svg" alt="home" class="left">
            <span class="right">Tapo插座</span>
            <img class="rightIcon" src="/icon/垃圾桶.svg"@click="刪除功能" >
          </div>
          <div class="模式塊" >
            <img src="/icon/門窗感應器.svg" alt="home" class="left">
            <span class="right">門窗感應器</span>
            <img class="rightIcon" src="/icon/垃圾桶.svg"@click="刪除功能" >
          </div>
          <div class="模式塊" >
            <img src="/icon/temperature.svg" alt="home" class="left">
            <span class="right">溫溼度感測器
            </span>
            <img class="rightIcon" src="/icon/垃圾桶.svg"@click="刪除功能" >
          </div>
          <div v-if="showConfirmDelete" class="confirm-background"></div>
          <div v-if="showConfirmDelete" class="confirm-window">
            <p>刪除所選的裝置？</p>
            <div class="confirm-buttons">
              <button @click="恢復">否</button>
              <button @click="恢復" style="color: red;">是</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="設備區" v-if="裝置畫面">
      <div class="同設備區">
        
        <!--裝置 :燈條 實體id:light.zhi_hui_deng_tiao_l900 -->
        <div class="裝置格" v-if="LightOK" :style="{ backgroundColor: LEDisChecked ? '#FFE6C7' : '#e2e2e2' }">
          <!-- 裝置icon + 開關 -->
          <div class="上半部">
            <div class="裝置icon"><img src="/icon/燈條.svg"></div>
            <div 
                class="toggle-switch" 
                :style="{ backgroundColor: LEDisChecked ? '#96B87A' : '#927b7b' }" 
                @click="toggleSwitch('LED')"
                >
                <div 
                    class="toggle-knob"
                    :class="{ 'knob-on': LEDisChecked }">
                </div>
            </div>
          </div>
          <div class="裝置名字">{{ LightData[1].attributes.friendly_name }}</div> 
          <!-- 更多 + 裝置名字  -->
          <div class="下半部">
            <div class="more"><img src="/icon/更多_橫.svg" @click="GoLedHistory"></div>
            <div class="裝置個別icon"  @click="toggleHeart('燈條')">
              <!-- 根據 isHeartSelected 狀態切換圖片 -->
              <img :src="燈條HeartSelected ? '/icon/愛心_點選後.svg' : '/icon/愛心_點選前.svg'">
            </div>
          </div>
        </div>
        <!-- 裝置 : sengled燈泡 實體id : light.w41_n15a_deng_guang -->
        <div class="裝置格" v-if="LightOK" :style="{ backgroundColor: BulbisChecked ? '#FFE6C7' : '#e2e2e2' }">
          <!-- 裝置icon + 開關 -->
          <div class="上半部">
            <div class="裝置icon"><img src="/icon/燈泡.svg"> </div>
            <div 
              class="toggle-switch" 
              :style="{ backgroundColor: BulbisChecked ? '#96B87A' : '#927b7b' }" 
              @click="toggleSwitch('bulb')"
              >
              <div 
                  class="toggle-knob"
                  :class="{ 'knob-on': BulbisChecked }">
              </div>
            </div>
          </div>
          <div class="裝置名字" >{{ LightData[0].attributes.friendly_name }}</div> 
          <!-- 更多 + 裝置名字  -->
          <div class="下半部">
            <div class="more"><img src="/icon/更多_橫.svg" @click="GoBuldHistory"></div>
            <div class="裝置個別icon"  @click="toggleHeart('燈泡')">
              <!-- 根據 isHeartSelected 狀態切換圖片 -->
              <img :src="燈泡HeartSelected ? '/icon/愛心_點選後.svg' : '/icon/愛心_點選前.svg'">
            </div>
          </div>
        </div>
      </div>
      <div class="同設備區">
        <!-- 裝置 : TuyaPlug-->
        <div class="裝置格" v-if="PlugOK" :style="{ backgroundColor: PlugTuyaisChecked ? '#FFE6C7' : '#e2e2e2' }">
          <!-- 裝置icon + 開關 -->
          <div class="上半部">
            <div class="裝置icon"><img src="/icon/Plug.svg"></div>
            <div 
              class="toggle-switch" 
              :style="{ backgroundColor: PlugTuyaisChecked ? '#96B87A' : '#927b7b' }" 
              @click="toggleSwitch('TuyaPlug')"
              >
              <div 
                  class="toggle-knob"
                  :class="{ 'knob-on': PlugTuyaisChecked }">
              </div>
            </div>
          </div>
          <div class="裝置名字">{{ PlugData[1].attributes.friendly_name }}</div> 
          <!-- 更多 + 裝置名字  -->
          <div class="下半部">
            <div class="more"><img src="/icon/更多_橫.svg" @click="GoTuyaPlugHistory"></div>
            
            <div class="裝置個別icon"  @click="toggleHeart('TuyaPlug')">
              <!-- 根據 isHeartSelected 狀態切換圖片 -->
              <img :src="TuyaPlugHeartSelected ? '/icon/愛心_點選後.svg' : '/icon/愛心_點選前.svg'">
            </div>
          </div>
        </div>
        <!--裝置 : Tapo插頭  -->
        <div class="裝置格" v-if="PlugOK" :style="{ backgroundColor: PlugTapoisChecked ? '#FFE6C7' : '#e2e2e2' }" >
          <!-- 裝置icon + 開關 -->
          <div class="上半部">
            <div class="裝置icon"> <img src="/icon/Plug.svg"></div>
            <div
                class="toggle-switch" 
                :style="{ backgroundColor: PlugTapoisChecked ? '#96B87A' : '#927b7b' }" 
                @click="toggleSwitch('TapoPlug')"
                >
                <div 
                    class="toggle-knob"
                    :class="{ 'knob-on': PlugTapoisChecked }">
                </div>
            </div>
          </div>
          <div class="裝置名字">{{ PlugData[0].attributes.friendly_name }}</div>
          <!-- 更多 + 裝置名字  -->
          <div class="下半部">
            <div class="more"><img src="/icon/更多_橫.svg" @click="GoTapoPlugHistory"></div>
            
            <div class="裝置個別icon"  @click="toggleHeart('TapoPlug')">
              <!-- 根據 isHeartSelected 狀態切換圖片 -->
              <img :src="TapoPlugHeartSelected ? '/icon/愛心_點選後.svg' : '/icon/愛心_點選前.svg'">
            </div>
          </div>
        </div>
      </div>
      <div class="同設備區">
        <!--裝置 : 門窗感應器  --> <!-- 狀態樣式待設定-->
        <div class="裝置格" v-if="SensorOK" :style="{ backgroundColor: SensorOK ? '#FFE6C7' : '#e2e2e2' }">
          <!-- 裝置icon + 開關 -->
          <div class="門窗感應器上半部">
            <div class="門窗感應器裝置icon"><img src="/icon/門窗感應器.svg"> </div>
            <div  v-for="(item, index) in filteredDeviceData" :key="index">
              <div v-if="item.entity_id === 'sensor.isa_dw2hl_d3b8_illumination'">
                <!-- 狀態按鈕（開啟和關閉方塊） -->
                <div class="狀態區">
                  <div 
                    class="狀態方塊" 
                    :class="{ active: item.state === 'strong' }">
                    開啟
                  </div>
                  <div 
                    class="狀態方塊" 
                    :class="{ active: item.state !== 'strong' }">
                    關閉
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="裝置名字">門窗感應器</div>
          <!-- 更多 + 裝置名字  -->
          <div class="下半部">
            <div class="more"><img src="/icon/更多_橫.svg" @click="GoSensorDoorHistory"></div>
            
            <div class="裝置個別icon"  @click="toggleHeart('門窗感應器')">
              <!-- 根據 isHeartSelected 狀態切換圖片 -->
              <img :src="門窗感應器HeartSelected ? '/icon/愛心_點選後.svg' : '/icon/愛心_點選前.svg'">
            </div>
          </div>
        </div>

        <!--裝置:溫濕度sensor--><!-- 狀態樣式待設定-->
        <div class="裝置格" v-if="SensorOK" :style="{ backgroundColor: SensorOK ? '#FFE6C7' : '#e2e2e2' }">
          <!-- 裝置icon + 開關 -->
          <div class="溫溼度上半部" >
            <!--過濾抓到的資料-->
            <div  v-for="(item, index) in filteredDeviceData" :key="index">
              <!--溫度-->
              <div class="溫濕度區" v-if="item.entity_id === 'sensor.mg_wifi_t_h_sensor_temperature'">
                <div class="溫濕度icon"><img src="/icon/temperature.svg"></div>
                <div class="溫濕度裝置名字">{{ item.state }}°C </div>
              </div> 
              <!--濕度-->
              <div class="溫濕度區" v-if="item.entity_id === 'sensor.mg_wifi_t_h_sensor_humidity'">
                <div class="溫濕度icon"><img src="/icon/drop_fill 1.svg"></div>
                <div class="溫濕度裝置名字"> {{ item.state }}% </div>
              </div> 
            </div>
          </div>
          <!-- 更多 + 裝置名字  -->
          <div class="下半部">
            <div class="more"><img src="/icon/更多_橫.svg" @click="GoSensorWeatherHistory"></div>
            <div class="裝置個別icon"  @click="toggleHeart('溫濕度感應器')">
              <!-- 根據 isHeartSelected 狀態切換圖片 -->
              <img :src="溫濕度感應器HeartSelected ? '/icon/愛心_點選後.svg' : '/icon/愛心_點選前.svg'">
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--裝置 :監視器-->
    <div class="攝影機區"  v-if="裝置畫面">
      <button class="camera">攝影機</button>
    </div>
    <!--新增裝置按鈕-->
    <div class="addicon" v-if="裝置畫面">
      <img class="裝置個別icon" src="/icon/新增.svg" @click="GoAddTapo">
    </div>
  </div>
  <!--底部列表-->
  <div  class="裝置bottomList">
    <button class="icon" @click="GoFavorite">
      <img src="/icon/我的最愛(點選前).svg">
    </button>
    <button class="icon">
      <img src="/icon/裝置(點選後).svg" >
    </button>
    <button class="icon" @click="GoMode">
      <img src="/icon/生活(點選前).svg" >
    </button>
  </div>
</div>
</template>

<style scoped>
/*全頁面*/
.裝置container{
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}
/*------------------------------ */
/*頂部列表*/
.裝置top{
  position: fixed;
  top: 0;
  width: 100vw;
  height: 10vh;
  background-color: #EAE0D7;
  display:flex;
  flex-direction: row;
  align-items: center;
}
.裝置標題{
  display: flex;
  flex-direction: row;
  width: 100%;
  font-size: 30px;
  font-weight: bold;
  margin-left: 5%;
}
.裝置topButton{
  display: flex;
  flex-direction: row;
  width:50%;
  justify-content: flex-end;
  margin-right: 5%;
  gap:5%;
}
/*------------------------------- */


/*body區放所有裝置*/
.裝置body{
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
  .裝置body {
    width: 50vw; /* 將寬度改為50% */
    margin: 0 auto; /* 大框框的東西在中間 */
    left: 0;
    right: 0;
  }
}
/*--------------------------------------------------------- */

.更多設定{
  display: flex;
  flex-direction: row;
  justify-content: flex-end; 
  margin-top:5%;
  cursor: pointer;
}

.更多icon{
  width: 30px;
  height: 30px;
  cursor: pointer;
  margin-right: 5%;
}
.取消icon{
  cursor: pointer;
  width: 50px;
  height:50px;
  margin-left: auto;
  margin-right: 5%;
  
}
/* --------------------------------------------*/

/* 所有裝置icon共用 */
.裝置個別icon{
  cursor: pointer;
}
.裝置個別icon:hover{
  transform: scale(1.2);
}

/*---------------------------------------------- */
.區域{
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin-top: 0%;
  color: #969595;
}
.place{
  cursor: pointer;
}
.place.active{
  color: #483e39;
  font-weight: bold;
  font-size: 1.3em;
}
/*---------------------------------------------- */
.設備區{
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
  margin-top: 5%;
  flex: 1; /* 使每個格子有相同的擴展 */
}
.同設備區{
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  height: 40%;
  width: 100%;
  margin-bottom: 60px;
  flex: 1; /* 使每個格子有相同的擴展 */
}

/* 各裝置共用class */
.裝置格{
  display:flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left:5%;
  margin-right: 5%;
  /* 寬高尺寸寫鼠的 才不會因為在適應各個父容器而造成每格大小不
  一的情況 */
  width:250px;
  height:150px;
  border-radius: 10px;
  flex-wrap: wrap;
}
.刪除裝置{
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  cursor: pointer;
  margin-bottom: 2%;
}
/* icon + 開關 */

.上半部{
  /*元素的寬度和高度包括內邊距（padding）*/
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 40%;
  align-items: center;
  justify-content: space-between;
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 5%;
}
.裝置icon{
  display: flex;
  flex-direction: row;
  width:30px;
  height: 30px;
  margin-right: 20%;
  cursor: pointer;
}
/*toggle 開關區 */
.toggle-switch {
  width: 50px;
  height: 20px;
  border-radius: 15px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;
}

/*toggle的圓形 */
.toggle-knob {
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 0px;
  left: -0px;
  transition: transform 0.3s;
}
.toggle-switch[style*="#96B87A"] .toggle-knob {
  transform: translateX(30px);
}
.knob-on {
  transform: translateX(30px);
}
/*更多 + 裝置名字 */
.下半部{
  /*元素的寬度和高度包括內邊距（padding）*/
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 40%;
  align-items: center;
  justify-content: space-between;
  padding-left: 5%;
  padding-right: 5%;
  padding-bottom: 5%;
}
.more{
  display: flex;
  flex-direction: row;
  /*用height控制圖片大小*/
  height:25px;
  cursor: pointer;
}
/*讓圖片乖乖的待在 div 範圍中 */
.more img{
  width: 100%;
  height: 100%;
}
.裝置名字{
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 60%;
  margin-left: 5%;
  font-size: 15px;
  font-weight: bold;
  color: #6D5D55;
}


/* 溫溼度 sensor 專用 */
.溫溼度上半部{
  /*元素的寬度和高度包括內邊距（padding）*/
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 60%;
  align-items: flex-start;
  justify-content: space-between;
}
.溫濕度區{
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  margin-top: 10%;
  margin-left: 10%;
}
.溫濕度icon{
  height: 30px;
  width:30px;
  margin-right: 5%;

}
.溫濕度裝置名字{
  font-size: 20px;
  font-weight: bold;
  color: #6D5D55;
}
/*門窗感應器專用 */
/* 內容目前雖然跟.上半部 一樣 但用同一種class時他的狀態區就是會超出去 */
.門窗感應器裝置icon{
  /*元素的寬度和高度包括內邊距（padding）*/
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  cursor: pointer;
}
.門窗感應器上半部{
  /*元素的寬度和高度包括內邊距（padding）*/
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 40%;
  align-items: center;
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 5%;
}
.狀態區 {
  display: flex;
  flex-direction: row;
  margin-left: 2%;
  width: 80%;
  /* 10% 是精挑細選後的數字 */
  padding-left: 10%;
  gap: 10px; /* 控制方塊間的距離 */
}
.狀態方塊 {
  width:50px;
  height: 30px;
  text-align: center;
  border-radius: 5px;
  background-color: #A4A4A4; /* 預設灰色背景 */
  color: black;
  font-weight: bold;
}

.狀態方塊.active {
  background-color: #7FBB70; /* 當選中時變為綠色 */
  color: black;
}


/*-------------------------------------------------- */
/*底部列表*/  
.裝置bottomList{
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
.icon {
  display: flex;
  border:none;
  outline: none;
  cursor: pointer;
  background-color: transparent;
  cursor: pointer;
}
.icon:hover{ 
  transform: scale(1.1);
}
.攝影機區{
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 30%;
  height: 5%;
  /*跟上面裝置左邊切齊*/
  margin-left: 5%;
  margin-top: 5%;
}
.camera{
  border-radius:10px;
  background-color: #FFFFFF;
  border:2px solid #A59C9C;
  color:#614C4C;
  font-weight: bold;
}
.addicon{
  display: flex;
  flex-direction: row;
  width: 90%;
  height: 10%;
  justify-content: flex-start;
  margin-left: 5%;
  margin-top: 3%;
  margin-bottom: 3%;
}

/*------------------------------ */
/*更多設定按鈕*/
/* 灰色遮罩層 */
.更多設定btn{
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 93%;
  /* 邊框 */
  margin-right: 8%;
  margin-bottom: 10%;
}
.history{
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 40%;
  margin-top: 5%;
  font-size: 15px;
  background-color: rgb(232, 231, 231);
  border-radius: 10px 0 0 0;
  border: 2px solid #cbcbcb; /* 白色邊框，寬度為2px */
  border-radius: 10px 0 0 0; /* 可選，添加圓角 */
  color: #614C4C;
  padding:2% ;
  cursor: pointer;
}
.history:hover{
  background-color: #c6c4c4;
}
 .delete{
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 40%;
  font-size: 15px;
  background-color: rgb(232, 231, 231);
  margin-bottom: 5%;
  border-radius: 0 0 0 10px;
  border: 2px solid #cbcbcb; /* 白色邊框，寬度為2px */
  border-radius: 0 0 0 10px; /* 可選，添加圓角 */
  color: #614C4C;
  padding:2% ;
  cursor: pointer;
 }

.delete:hover{
  background-color: #c6c4c4;
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

.自動化body{
  /*將中間部分位置固定從頂部列表的底到底部列表的頂*/
  position: fixed;
  top: 18vh;
  bottom: 8vh;
  width: 100%;
  /* height : 已經用上面絕對位置定位過了 所以不用再調整 */
  /* width : 繼承父容器的100%寬度 */
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
/* 中間區 */
.所有模式modeframe {
    display: flex;
    flex-direction: column;
    height:80%;
    width: 100%;
    margin-bottom: 3%;
    margin-top: 3%;

}
.模式塊區{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  /* 3 是精挑細選過的數字 */
  margin-top: 3%;
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
  height: 15%;
  background-color:#E9E9E9;
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
  width: 30px;
  height: 30px;
  margin-left: 3%;
}
.right {
  margin-left:3%;
  font-weight: bold;
  font-size: 16px;
}
/* 更多箭頭 : margin-left: auto; 靠右 */
.rightIcon{
  margin-left: auto;
  margin-right: 3%;
  cursor: pointer;
  /* 利用高度控制icon大小 */
  /* 30是精挑細選的數字 */
  width: 30px;
  height:30px;

}
.rightIcon:hover{
  transform: scale(1.3);
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

</style>