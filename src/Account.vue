<script setup>
  import { ref } from "vue";
  /* 串畫面區 */
  /* 這個畫面會連到哪些畫面App 那邊怎麼定義，這邊要一樣 */
  const emit = defineEmits(['GoHome','GoLogIn']);
  /* 內部函數定義 : 該畫面按鈕點擊後會觸發的函數 */
  function GoHome(){
    emit('GoHome');
  }
  function GoLogIn(){
    emit('GoLogIn');
  }
  
</script>

<template>
  <meta name="viewport" content="width=device-width, initial-scale=1">
    <div class="content">
      <div class="content1">
        <div class="back">
          <img src="/icon/回上一頁.svg" alt="go back"  @click="GoHome">
        </div>
        <div class="middle">
          <p class="text">帳號</p>
          <div class="Account-box">
          </div>
          <div class="sign-out" @click="GoLogIn"> 登出</div>
        </div>
      </div>
    </div>
</template>

<style scoped>

.content{
    background-color: #F1F1F1;
    width: 100%;
    height: 100%;
    position: fixed; /* 確保元素固定在視窗內 */
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
}
/* 當螢幕寬度大於或等於1024px（電腦螢幕）時，設定為50% */
@media (min-width: 1024px) {
  .content1 {
    width: 50vw; /* 將寬度改為50% */
    margin: 0 auto; /* 大框框的東西在中間 */
  }
}
.back{
  display: flex;
  width: 100%;
  justify-content: left;
  margin-top: 5%;
  margin-left: 5%;
  cursor: pointer;
}
.middle{
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-left:5%;
  margin-right: 5%;
  margin-top: 5%;
}
.text{
  font-weight: bold;
  font-size: 18px;
  color: #686868;
}
.Account-box{
    width: 90%;
    height: 60px;
    background-color:#FFFFFF;
    border-radius: 10px;
    display:flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: 5%;
}
.more{
  cursor: pointer;
  margin-right: 3%;
}


.sign-out{
    margin-top:2%;
    width: 90%;
    height: 60px;
    background-color:#FFFFFF;
    border-radius: 10px;
    display:flex;
    justify-content: center;  /* 水平方向居中 */
    align-items: center;     /* 縱軸（垂直方向）居中 */
    font-weight: bold;
    font-size: 20px;
    color: #C12323;
    cursor: pointer;
}
.sign-out:hover{
  background-color: rgb(228, 228, 228);
}

</style>