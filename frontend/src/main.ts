import {createApp} from "vue";

import App from "./App.vue";
import {checkUser} from "./auth";
import {setupApi} from "./helpers";
import router from "./router";
import "./styles/main.css";

setupApi();

void checkUser().finally(() => {
  createApp(App).use(router).mount("#app");
});
