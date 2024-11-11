//程式進入點
//載入createApp 函式
import {createApp} from "vue";
//載入根組件  "./" : 代表在同一個資料夾底下
import App from "./App1.vue";
import router from './router';
//建立Vue App 物件
const app=createApp(App);

app.use(router)

/* loadding 動畫*/
app.config.compilerOptions.isCustomElement = (tag) => {
    return tag === 'dotlottie-player';
};
//掛載到HTML標籤底下
//#id
app.mount("#app")