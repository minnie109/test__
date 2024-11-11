<script setup>

import {ref,nextTick} from 'vue';
/* 串畫面區 */
  /* 這個畫面會連到哪些畫面App 那邊怎麼定義，這邊要一樣 */
  //去快捷訊息的變數
  const emit = defineEmits(['GoChat']);
  /* 內部函數定義 : 該畫面按鈕點擊後會觸發的函數 */
  //去快捷訊息的畫面
  function GoChat(){
    emit('GoChat');
  }

let toShortcut = ref(true);
//選取按鈕
let 選取 = ref(true);
//刪除按鈕
let 刪除列 = ref(false);

// 確認刪除視窗
let showConfirmDelete = ref(false);
// 被選中的項目索引
let indicesToDelete = ref([]);

// 儲存快捷訊息的陣列
let shortcuts = ref(["請幫我把燈調亮", "明天天氣如何", "一小時候關閉智能插座"]);
// 刪除按鈕功能
function 刪除功能(){
  // 顯示確認視窗
  if (indicesToDelete.value.length > 0) {
    showConfirmDelete.value = true;
  }
}
// 確認刪除
function confirmDelete() {
  // 按照索引從大到小的順序刪除，避免索引錯位
  indicesToDelete.value.sort((a, b) => b - a).forEach(index => {
    shortcuts.value.splice(index, 1);
  });

  // 重置狀態
  indicesToDelete.value = [];
  showConfirmDelete.value = false;
  刪除列.value = false;
  選取.value = true;
}
// 取消刪除
function cancelDelete() {
  showConfirmDelete.value = false;
}

// 選取/取消選取快捷訊息
function toggleDelete(index) {
  const idx = indicesToDelete.value.indexOf(index);
  if (idx > -1) {
    // 如果該索引已存在，移除它
    indicesToDelete.value.splice(idx, 1);
  } else {
    // 如果該索引不存在，添加它
    indicesToDelete.value.push(index);
  }
}
function 切換選取(){
  選取.value = !選取.value;
  刪除列.value = !刪除列.value;
};
function 新增(){
  shortcuts.value.push(""); // 新增一個空的快捷訊息
  nextTick(() => {
    // 確保 DOM 更新完成後滾動到最後一個快捷訊息
    const mediumDiv = document.querySelector('.medium');
    mediumDiv.scrollTop = mediumDiv.scrollHeight;
  });
};


</script>
<template>
  <!--整個視窗-->
  <div v-if="toShortcut" class="container">
    
    <div class="top">
      <img src="\icon\回上一頁.svg" class="back" @click="GoChat">
      <span class="title">快捷訊息</span>
    </div>
    <div class="down">
      <div class="選取列">
        <button class="選取前" v-if="選取" @click="切換選取">選取</button>
        <div class="選取後" v-else>
          <img  class="刪除" @click="刪除功能" src="/icon/垃圾桶.svg">
          <button class="取消" @click="切換選取">取消</button>
        </div>
        
      </div>
      <div class="medium">
        <div class="divBtn" v-for="(shortcut, index) in shortcuts" :key="index">
          <input type="checkbox" v-if="刪除列" class="選取點點" :id="'checkbox-' + index" :checked="indicesToDelete.includes(index)" @change="toggleDelete(index)"/>
          <label  v-if="刪除列" :for="'checkbox-' + index "></label>
          <input type="text" class="btn" v-model="shortcuts[index]" />
        </div>
        <div class="divBtn_加">
          <img src="\icon\新增快捷鍵.svg" class="add" @click="新增"/>
          <button class="more-text" @click="新增">新增快捷訊息</button>
        </div>
      </div>
      <div class="bottom">
        <button class="store" @click="GoChat">儲存</button>
      </div>
    </div>
    <div v-if="showConfirmDelete" class="confirm-background">
      <!-- 半透明背景層 -->
    </div>
    <div v-if="showConfirmDelete" class="confirm-window">
      <p>刪除所選的快捷訊息？</p>
      <div class="confirm-buttons">
        <button @click="cancelDelete">否</button>
        <button @click="confirmDelete" style="color: red;">是</button>
      </div>
    </div>
  </div>

</template>

<style scoped>  
.container{
    position: fixed;  /* 確保它固定在螢幕上 */
    width: 100vw;     /* 寬度設置為 100% 的視口寬度 */
    height: 100vh;    /* 高度設置為 100% 的視口高度 */
    display: flex;    /* 使用 Flexbox 來定位內容 */
    justify-content: flex-start;  /* 水平方向居中 */
    flex-direction: column;   /* 垂直方向 */
    background-color: #EDE7E7; /* 背景色 */
}
/* 當螢幕寬度大於或等於1024px（電腦螢幕）時，設定為50% */
@media (min-width: 1024px) {
  .container {
    width: 50vw; /* 將寬度改為50% */
    margin: 0 auto; /* 大框框的東西在中間 */
    left: 0;
    right: 0;
  }
}
.top{
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
    gap: 2%;
    margin-top: 3%;
    margin-left:5%;
}
.back{
  cursor: pointer;
}
.title{
    font-size: 16px;
    font-weight: bold;
    color:#614C4C;
}
.down{
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    margin-top: 2%;
    background-color: #EDE7E7;
    flex-grow: 1;
}
.選取列{
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: flex-end;
    margin-right: 13%;
    margin-top: 2%;
}
.選取前{
    border-radius: 10px;
    color:#ffffff;
    font-weight: bold;
    outline: none;
    border: none;
    cursor: pointer;
    background-color:#A59C9C;
}
.選取後{
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
}
.取消{
    border-radius: 10px;
    color:#ffffff;
    font-weight: bold;
    outline: none;
    border: none;
    cursor: pointer;
    background-color:#A59C9C;
}
.取消:hover{
    background-color:#7d7575;
}
.刪除{
    cursor: pointer;
}
.medium{
    display: flex;
    flex-direction: column;
    width: 100%;
    flex-grow: 1;
    align-items: center;
    margin-top: 2%;
    padding-top: 2%;
    padding-bottom: 2%;
    justify-content: flex-start;
    box-sizing: border-box;
    gap: 10px;
    overflow-y:scroll;
    overflow-x: hidden;
    /* 限制最大高度 */
    max-height:400px; 

}
.divBtn{
    display: flex;
    flex-direction: row;
    width: 90%;
    height: 10px;
    align-items: center;
    justify-content: flex-start;
    background-color: #FFFFFF;
    margin-left: 5%;
    margin-right: 5%;
    padding: 2%;
    border-radius: 15px;
    cursor: pointer;
}
.divBtn:hover{
    background-color:#e6e3e3;
}
.選取點點{
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
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #974242;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.divBtn_加{
    display: flex;
    flex-direction: row;
    width: 90%;
    height: 10px;
    align-items: center;
    justify-content: center;
    background-color: #FFFFFF;
    margin-left: 5%;
    margin-right: 5%;
    padding: 2%;
    border-radius: 15px;
    cursor: pointer;
}
.divBtn_加:hover{
    background-color:#e6e3e3;
}
.btn{
    color:#000000;
    font-weight: bold;
    outline: none;
    border: none;
    cursor: pointer;
    background-color: transparent;
}
.more-text{
    color:#974242;
    font-weight: bold;
    outline: none;
    border: none;
    cursor: pointer;
    background-color: transparent;
}

.bottom{
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    width: 100%;
    align-items: center;
    gap: 2%;
    margin-top: 2%;
    margin-bottom: 2%;
    min-height: 50px;
}
.add{
    cursor: pointer;
}
.store{
    box-sizing: border-box;
    background-color: #A59C9C;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color:#FFFFFF;
    font-weight: bold;
    outline: none;
    border: none;
    margin: 2%;
    width: 10%;
    padding: 1%;
    cursor: pointer;
}
.store:hover{
    background-color:#7d7575;
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