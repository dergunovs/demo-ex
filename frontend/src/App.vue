<template>
  <div class="application">
    <AppHeader />

    <main class="main">
      <RouterView />
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";

import AppFooter from "./components/AppFooter.vue";
import AppHeader from "./components/AppHeader.vue";
</script>

<style scoped>
.application {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main {
  flex: 1;
  padding: 24px 0 32px;
}
</style>
