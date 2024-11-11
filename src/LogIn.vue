<script setup>
  import { ref } from "vue";
  let toloadding = ref(false);
/* 串畫面區 */  
/* 這個畫面會連到哪些畫面App 那邊怎麼定義，這邊要一樣 */
  const emit = defineEmits(['GoRegister','GoHome','Goloadding']);
  
  function GoRegister(){
    emit('GoRegister');
  }
// 將這一段的function加進下面的login function裡面


  function GoHome(){
    emit('GoHome');
  }
  function Goloadding(){
    emit('Goloadding');
  }
//API 的部分
  const account = ref('');
  const password = ref('');
  const message = ref('');
  const login = async () => {
    try {
        const response = await fetch('http://163.22.17.116:8122/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            account: account.value,
            password: password.value,
        }),
        });

        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
        message.value = '登入成功！';
        emit('GoHome');  // 如果登入成功，到主頁
        } else {
        message.value = '登入失敗！';
        }
    } catch (error) {
        message.value = `錯誤: ${error.message}`;
    }
};
</script>

<template>
    <div class="content">
        <div class="box">
            <div class="text1">歡迎回家!</div>
            <div class="text2">登入後開始使用</div>
            <img src="\icon\使用者.svg" alt="people" class="people">
            <input class="Account" v-model="account" type="text" placeholder="帳號" />
            <input class="password" v-model="password" type="password" placeholder="密碼" />
            <button class="in" @click="GoHome">登入</button>
            <button class="register" @click="GoRegister">註冊</button>
        </div>
    </div>
</template>

<style scoped>

.content{
    background-color: #F2EBE7;
    width: 100%;
    height: 100%;
    position: fixed; /* 確保元素固定在視窗內 */
    top: 0;
    left: 0;
    margin-top: 0;
    display:flex;
    justify-content: center;  /* 水平方向居中 */
}

.box{
    background-color:#FFFFFF;
    width: 80%;
    margin-top: 15%;
    border-top-left-radius: 50px;
    border-top-right-radius: 50px;
    display:flex;
    align-items: center;  /* 水平方向居中 */
    flex-direction: column;
    position: fixed;
    bottom: 0;
    height: 90%;
    margin-left: 10%;
    margin-right: 10%;
}
/* 當螢幕寬度大於或等於1024px（電腦螢幕）時，設定為50% */
@media (min-width: 1024px) {
  .box {
    width: 50vw; /* 將寬度改為50% */
    margin: 0 auto; /* 大框框的東西在中間 */
    left: 0;
    right: 0;
  }
}
.text1{
    font-weight: bold;
    font-size: 40px;
    margin-top:10%;
    margin-left:2%;
}
.text2{
    margin-top:3%;
    font-size: 15px;
    color:#A59C9C; 
}
.people{
    margin-top: 3%;
}
/*隱藏輸入框預設的外框 */
input {
  border: none;
  outline: none; /* 也可以移除 focus 時的外框 */
  padding-left: 10px;      /* 調整內部邊距 */
  margin-left: 10%;
  margin-right: 10%;
}

.Account{
    background-color: rgba(165, 156, 156, 0.4);
    width: 50%;
    height: 8%;
    border-radius: 10px;
    display:flex;
    align-items: center;     /* 縱軸（垂直方向）居中 */
    color:#000000;
    font-weight: bold;
    margin-top: 3%;
   
}

.password{
    background-color: rgba(165, 156, 156, 0.4);
    width: 50%;
    height: 8%;
    border-radius: 10px;
    align-items: center;     /* 縱軸（垂直方向）居中 */
    color:#000000;
    font-weight: bold;
    margin-top: 3%;
    
}

.in{
    width: 50px;
    height: 35px;
    margin-top: 5%;
    border-radius: 5px;
    border: none;
    background-color: rgba(165, 156, 156, 0.4);
    font-weight: bold;
    cursor: pointer;
    color: #000000;
    font-size: 15px;
}
.in:hover{
    background-color: #aea9a9;
}
.register{
    width: 50px;
    height: 35px;
    margin-top: 3%;
    border-radius: 5px;
    border: none;
    background-color:transparent;
    font-weight: bold;
    cursor: pointer;
    color:#A59C9C;
}
.register:hover{
    color: #545252;
}
/* 當螢幕寬度大於或等於1024px（電腦螢幕）時，設定為50% */
@media (min-width: 1024px) {
    .box {
      width: 50%; /* 將寬度改為50% */
      margin-top: 8%; /* 保持 margin-top */
      margin-left: auto; /* 水平居中 */
      margin-right: auto; /* 水平居中 */
    }
  }

</style>