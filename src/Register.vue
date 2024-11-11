<script setup>
  import { ref } from "vue";
  /* 串畫面區 */
  /* 這個畫面會連到哪些畫面App 那邊怎麼定義，這邊要一樣 */
  const emit = defineEmits(['GoLogIn']);
/* 內部函數定義 : 該畫面按鈕點擊後會觸發的函數 */
  function GoLogIn(){
    emit('GoLogIn');
  }
</script>


<template>
    <div class="content">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <div class="box">
            <p class="welcome">歡迎加入!</p>
            <p class="text1">建立帳號使用智慧家庭</p>
            <input class="other" type="text" placeholder="帳號">
            <input class="other" type="text" placeholder="密碼">
            <button class="register" @click="GoLogIn">註冊</button>
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
    display:flex;
    margin-top: 0;
}
.box{
    background-color:#FFFFFF;
    width: 80%;
    margin-top: 10%;
    border-top-left-radius: 50px;
    border-top-right-radius: 50px;
    flex-direction: column; /* 垂直排列 */
    display:flex;
    align-items: center; /* 水平方向居中 */
    font-size: 40px;
    position: fixed;
    bottom: 0;
    margin-left: 10%;
    margin-right: 10%;
    height: 90%;
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
.welcome{
    margin-top:10%;
    font-weight: bold;
}
.cross{
    margin-left:85%;
    width: 25px;
    cursor: pointer;
    padding:3%;
}
.text1{
    color:#A59C9C; 
    font-size: 15px;
    margin:  -2% 0 ; /* 移除邊距 */
    text-align: center; /* 確保文本置中 */
    margin-bottom: 2px;
}
.name{
    background-color: rgba(165, 156, 156, 0.4);
    width: 45%;
    height: 60px;
    border-radius: 10px;
    display:flex;
    align-items: center;     /* 縱軸（垂直方向）居中 */
    border-radius: 10px;
    color:#A59C9C;
    border: none;
    margin-top:3%;
    outline: none;
    padding-left: 10px;
}
.other{
    background-color: rgba(165, 156, 156, 0.4);
    width: 45%;
    height: 60px;
    border-radius: 10px;
    display:flex;
    align-items: center;     /* 縱軸（垂直方向）居中 */
    border-radius: 10px;
    color:#A59C9C;
    border: none;
    margin-top:3%;
    outline: none;
    padding-left: 10px;
}
.register{
    height: 30px;
    width: 50px;
    font-weight: bold;
    background-color: rgba(165, 156, 156, 0.4);
    border: none;
    border-radius: 5px;
    margin-top:5%;
    transition: background-color 0.3s ease; /* 使顏色變化有過渡效果 */
    cursor: pointer;

}
.register:hover{
    background-color:rgb(182, 180, 180);
}
@media (max-width: 1440px){
    .cross{
        margin-top: 6%;
        margin-right:5%;
    }
}
</style>