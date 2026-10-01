<template>
  <div class="application">
    <AppHeader />

    <main class="main">
      <RouterView />
    </main>

    <footer class="footer">
      <div class="container footerInner">
        <p class="footerText">© 2026 Водить.РФ — школа вождения катеров, круизных лайнеров и яхт</p>
        <a
          class="social"
          :href="SOCIAL.url"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="SOCIAL.title"
        >
          <img class="socialIcon" :src="SOCIAL.icon" :alt="SOCIAL.title" />
        </a>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";

import AppHeader from "./components/AppHeader.vue";
import { SOCIAL } from "./constants/index";
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

.footerInner {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: center;
}

.footerText {
  font-size: 12px;
  font-weight: 300;
  color: var(--color-white);
  text-align: center;
}

.social {
  display: flex;
  transition: opacity 0.2s ease;
}

.social:hover {
  opacity: 0.8;
}

.socialIcon {
  width: 96px;
}
</style>
