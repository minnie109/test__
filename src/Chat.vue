<script setup>
  import { ref, onMounted, nextTick,onBeforeUnmount} from 'vue';
/* 串畫面區 */
  /* 這個畫面會連到哪些畫面App 那邊怎麼定義，這邊要一樣 */
  //去快捷訊息的變數
  const emit = defineEmits(['GoShortcut','GoHome']);
  /* 內部函數定義 : 該畫面按鈕點擊後會觸發的函數 */
  //去快捷訊息的畫面
  function GoShortcut(){
    emit('GoShortcut');
  }
  //回主畫面
  function GoHome(){
    emit('GoHome');
  }


/*
onMounted(() => {
  connectWebSocket(websocketUrl);
});

onBeforeUnmount(() => {
  disconnectWebSocket();
});

/*--------------------------------- */
let toChat = ref(true);


// 用來顯示伺服器回應的文字
const responseText = ref('嗨!我是你的家庭助理');
// 儲存使用者的輸入
const userInput = ref('');
// 儲存對話的紀錄
const conversationHistory = ref([]);
//擴增功能
const isExpanded = ref(false);
//自動將訊息往上的功能
const chatContainer = ref(null);
// 切換高度
const more = () => {
    isExpanded.value = !isExpanded.value; // 切換高度
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
};

// 發送命令的功能
async function sendCommand(text) {
    // 先將使用者的輸入推入對話歷史
    conversationHistory.value.push({ type: 'user', text: text });
    // 發送命令後立即滾動到底部
    userInput.value = '';
    scrollToBottom();
    try {
        const response = await fetch('/api/conversation/process', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJmMWE3YzFhYmEwZGQ0MTEzOTg5YWNiZDUyMjA1ZmYyMyIsImlhdCI6MTcyNzQxNzE3NSwiZXhwIjoyMDQyNzc3MTc1fQ.GNiFXZ1iWVwu8Io4QDP9lwbvNiHdBuTUx_mbiQy8dcw',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "text": text,
                "language": "zh-tw",
                "agent_id": "a5a61228021ffe6dca0732e33280cf77"
            })
        });

        // 檢查回應是否成功
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // 更新對話歷史
        conversationHistory.value.push({ type: 'assistant', text: data.response.speech.plain.speech });
        // 等待 DOM 更新完成後滾動到最新消息
        await nextTick();
        // 確保 chatContainer 存在後滾動到底部
        if (chatContainer.value) {
            chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
        }
    } catch (error) {
        console.error('Error:', error);
        responseText.value = 'An error occurred while fetching the data.';
    }
}

// 在組件掛載時初始化對話歷史
onMounted(() => {
    conversationHistory.value.push({ type: 'assistant', text: responseText.value });
});
</script>

<template>
    <div v-if="toChat" class="all">
        <div class="對話框">
            <div class="back">
                <img src="\icon\叉叉.svg" @click="GoHome">
            </div>
            <div class="小對話框" ref="chatContainer">
                <div v-for="(message, index) in conversationHistory" :key="index">
                    <!-- 顯示使用者訊息，靠右且無機器人頭像 -->
                    <div v-if="message.type === 'user'" class="message user-message">
                        <p>{{ message.text }}</p>
                    </div>
                    <!-- 顯示機器人訊息，靠左且顯示機器人頭像 -->
                    <div v-else class="message assistant-message">
                        <img src="\icon\機器人.svg" class="robot">
                        <p>{{ message.text }}</p>
                    </div>
                </div>
            </div>
            <!-- 擴增功能 -->
            <div class="question" @click="more" :class="{ expanded: isExpanded }">
                <div class="row1">
                    <!--@click.stop 不會觸發父元素的@click事件-->
                    <div class="快捷訊息Btn外的div">
                        <button class="快捷訊息Btn" @click.stop="sendCommand('幫我把燈調亮')">幫我把燈調亮</button>
                    </div>
                    <div class="快捷訊息Btn外的div">
                        <button class="快捷訊息Btn"  @click.stop="sendCommand('明天天氣如何')">明天天氣如何 ? </button>
                    </div>
                    <div class="快捷訊息Btn外的div">
                        <button class="快捷訊息Btn" @click.stop="sendCommand('一小時之後關閉智能插座')">一小時之後關閉智能插座</button>
                    </div>
                </div>
                <!-- 額外的按鈕，默認隱藏 -->
                <div class="row2">
                    <div v-if="isExpanded" class="快捷訊息Btn外的div">
                        <button class="快捷訊息Btn"@click.stop="sendCommand('開啟工作模式')">開啟工作模式</button>
                    </div>
                    <div v-if="isExpanded" class="快捷訊息Btn外的div">
                        <button class="快捷訊息Btn" @click.stop="sendCommand('開啟出門模式')">開啟出門模式</button>
                    </div>
                    <div v-if="isExpanded" class="快捷訊息Btn外的div">
                        <button class="快捷訊息Btn" @click.stop="sendCommand('開啟回家模式')">開啟回家模式</button>
                    </div>
                </div>
                <div class="row3">
                    <div v-if="isExpanded" class="快捷訊息Btn外的div">
                        <button class="快捷訊息Btn" @click.stop="sendCommand('開啟起床模式')">開啟起床模式</button>
                    </div>
                    <div v-if="isExpanded" class="快捷訊息Btn外的div"> 
                        <button class="快捷訊息Btn" @click.stop="sendCommand('開啟睡眠模式')">開啟睡眠模式</button>
                    </div>
                    <div v-if="isExpanded" class="快捷訊息Btn外的div">
                        <button class="快捷訊息Btn" @click.stop="sendCommand('開啟節能模式')">開啟節能模式</button>
                    </div>
                </div>
                <div v-if="isExpanded" class="edit外的div">
                    <img src="\icon\編輯.svg" class="edit" @click="GoShortcut"> 
                </div>
            </div>

            <div class="輸入框">
                <!-- 按ENTER鍵一樣可以發送 -->
                <input class="input" v-model="userInput" type="text" placeholder="請輸入指令" @keyup.enter="sendCommand(userInput)">
                <div class="小按鈕">
                    <div class="send">
                        <img src="\icon\傳送訊息.svg" @click="sendCommand(userInput)">
                    </div>
                </div>
            </div>
        </div>  
    </div>
</template>

<style scoped>
/* 同時引入 Outfit 和 Oswald 字體 */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&family=Oswald:wght@400;700&display=swap');

html, body {
    height: 100%;
    margin: 0;
    padding: 0;
}

.all {
    position: fixed;  /* 保持視窗固定 */
    height: 100vh;
    width: 100vw;
    display: flex;
    margin: 0;
    flex-direction: column;
    align-items: center;
    background-color: rgba(217, 217, 217, 0.9);
}
.對話框 {
    margin-top: 5%; 
    background-color: #FFFFFF;
    width: 90vw; /*使用視窗寬度的 90% */
    height: 85%; /*使用視窗高度的 95% */
    max-width: 600px; /*但限制最大寬度*/ 
    border-radius: 15px ;
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* 將內容推到底部 */
}

.back {
    display: flex;
    justify-content: flex-end;
    margin: 10px;
    cursor: pointer;
}

.小對話框 {
    display: flex;
    flex-grow: 1; /* 讓對話框充滿剩餘空間 */
    flex-direction: column;
    width: 100%;
    background-color: transparent;
    overflow-y: scroll; /* 啟用垂直滾動 */
    padding: 10px; /* 添加內邊距 */
    box-sizing: border-box; /* 使寬度和高度包括內邊距和邊框 */
    margin-bottom: 0%;
    padding-bottom: 20px; /* 給一些下邊距 */
}

/* 自定義滾動條樣式 */
.小對話框::-webkit-scrollbar {
    width: 12px; /* 設置滾動條的寬度 */
    height: 4px;
}

.小對話框::-webkit-scrollbar-track {
    background: #f1f1f1; /* 滾動條軌道的顏色 */
    border-radius: 10px; /* 滾動條軌道的圓角 */
    height: 4px;
}

.小對話框::-webkit-scrollbar-thumb {
    background: #888; /* 滾動條滑塊的顏色 */
    border-radius: 10px; /* 滾動條滑塊的圓角 */
    height: 4px;
}

.小對話框::-webkit-scrollbar-thumb:hover {
    background: #555; /* 滾動條滑塊在懸停時的顏色 */
}

.message {
    display: flex;
    align-items: center;
    margin: 10px;
    padding: 10px;
    border-radius: 10px;
    width: 100%; /* 確保訊息佔滿整個行寬 */
}

/* 使用者訊息靠右 */
.user-message {
    display: flex;
    justify-content: center;
    align-self: flex-start;
    background-color: #F2EBE7;
    overflow-y:auto;
    width: fit-content; /* 適當縮放寬度來包住內容 */
    height: auto;/* 高度自動調整 */
    max-width: 60%;
    margin-left: auto; /* 確保訊息靠右對齊 */
    text-align: left;
    padding-top: 0%;
    padding-bottom: 0%;
    border-radius: 50px 0 50px 50px; /* 左上 右上 右下 左下 */
    word-wrap: break-word; /* 避免較長的句子超出邊界 */
    color: #614C4C;
    font-family: 'Oswald', sans-serif;
}

/* 機器人訊息靠左 */
.assistant-message {
    justify-content: flex-start;
    background-color:transparent;
    width: fit-content;
    max-width: 60%;
    color: #614C4C;
    font-family: 'Oswald', sans-serif;
    word-wrap: break-word;
    word-break: break-word;
    white-space: normal; 
}


/* 機器人頭像 */
.robot{
    width: 40px;
    height: 40px;
    margin-right: 10px;
    background-color: transparent;
}

/*對話快捷鍵*/ 
.question{
    flex-direction: column;
    box-sizing: border-box; /* 使寬度和高度包括內邊距和邊框 */
    position: relative;
    display:flex;
    align-items: center;
    justify-items: center;
    width: 100%;
    height:60px;
    margin-bottom: 5%;
    background-color: rgba(217, 217, 217, 0.6);
    padding: 5px;
    transition: height 1s ease;
}

.question.expanded {
    box-sizing: border-box; /* 使寬度和高度包括內邊距和邊框 */
    position: relative;
    display:flex;
    align-items: center;
    justify-items: center;
    width: 100%;
    height: auto; /* 展開後的高度 */
    transform: translateY(-10px); /* 向上展開 */
}

.row1, .row2, .row3{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 30px;
    flex-direction: row;
    margin: 5px;
}

.快捷訊息Btn{
    color:#A4979E;
    background-color: #FFFFFF;
    border: none;
    font-size: 12px;
    font-family:'Oswald', sans-serif; ;
    font-weight: bold;
    cursor: pointer;
    width: 90%;
    outline: none;
}
.快捷訊息Btn:hover{
    background-color:#e1e1e1;
}

.快捷訊息Btn外的div{
    width: 175px;
    height: 25px;
    background-color:#FFFFFF;
    border-radius: 25px;
    margin-left: 10px;
    display:flex;
    align-items: center; /* Centers items vertically */
    justify-content: center; 
    border: 1px solid #D7C8C8;
    margin-top: 15px;
    outline: none;
}
.快捷訊息Btn外的div:hover{
    background-color:#e1e1e1;
}
.edit外的div{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    height: 30px;
    margin-top: 10px;
}
.edit{
    cursor: pointer;
    width: 23px;
}


.輸入框 {
    box-sizing: border-box; /* 使寬度和高度包括內邊距和邊框 */
    display: flex;/* 使用 Flexbox 來定位內容 */
    flex-direction: row; /* 將子內容排列成一行 */
    justify-content: flex-end;
    width: 97%; /* 寬度設置為父容器的寬度400px - 左右兩邊的 margin  */
    align-items: center;
    background-color: #F2EBE7;
    border-radius: 30px;
    padding: 10px;
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 5%;
    position: relative;
}

.input {
    display: flex;
    border: none;
    outline: none;
    border-radius: 10px;
    background-color: #F2EBE7;
    width: 100%;
    font-size: 15px;
    font-family: 'Oswald', sans-serif;
    font-weight: bold;
}

.小按鈕{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
}

.send {
    display: flex;
    border-radius: 50%;
    background-color: #A39090;
    margin: 5px;
    width: 30px;  /* 設定固定寬度 */
    height: 30px; /* 設定固定高度，確保它是正圓 */
    justify-content: center; /* 將內容置中 */
    align-items: center; /* 將內容置中 */
    cursor: pointer;
}


</style>
