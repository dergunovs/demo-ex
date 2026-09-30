<template>
  <div class="application">
    <AppHeader />

    <main class="main">
      <RouterView />
    </main>

    <footer class="footer">
      <div class="container">
        <p class="footerText">© 2026 Водить.РФ — школа вождения катеров, круизных лайнеров и яхт</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";

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

.footer {
  padding: 24px 0;
  background-color: var(--color-primary-dark);
}

.footerText {
  font-size: 12px;
  font-weight: 300;
  color: var(--color-white);
  text-align: center;
}
</style>
