import { createApp } from "vue";

import App from "./App.vue";
import { setupApi } from "./api";
import { restoreUser } from "./auth";
import router from "./router";
import "./styles/main.css";

setupApi();

void restoreUser().finally(() => {
  createApp(App).use(router).mount("#app");
});
