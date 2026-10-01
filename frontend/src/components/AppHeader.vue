<template>
  <header class="header">
    <div class="container inner">
      <RouterLink :to="URLS.home" class="logo" @click="closeMenu">
        <img class="logoImage" :src="LOGO.icon" :alt="LOGO.title" />
        <span>Водить.РФ</span>
      </RouterLink>

      <button
        type="button"
        class="burger"
        :aria-expanded="isMenuOpen"
        aria-label="Открыть меню"
        @click="toggleMenu"
      >
        <span class="burgerLine" />
        <span class="burgerLine" />
        <span class="burgerLine" />
      </button>

      <nav class="nav" :class="{ navOpen: isMenuOpen }">
        <RouterLink
          :to="URLS.home"
          class="link"
          :class="{ linkActive: isLinkActive(route.path, URLS.home) }"
          @click="closeMenu"
        >
          Главная
        </RouterLink>
        <RouterLink
          v-if="isAuth"
          :to="URLS.order"
          class="link"
          :class="{ linkActive: isLinkActive(route.path, URLS.order) }"
          @click="closeMenu"
        >
          Оформить заявку
        </RouterLink>
        <RouterLink
          v-if="isAuth"
          :to="URLS.account"
          class="link"
          :class="{ linkActive: isLinkActive(route.path, URLS.account) }"
          @click="closeMenu"
        >
          Личный кабинет
        </RouterLink>
        <RouterLink
          v-if="isAdmin"
          :to="URLS.admin"
          class="link"
          :class="{ linkActive: isLinkActive(route.path, URLS.admin) }"
          @click="closeMenu"
        >
          Админ-панель
        </RouterLink>

        <span v-if="currentUser" class="user">{{ currentUser.fullName }}</span>

        <UiButton v-if="isAuth" layout="secondary" isNarrow @click="signOut"
          >Выйти</UiButton
        >
        <UiButton v-else isNarrow @click="openLogin">Войти</UiButton>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { shallowRef } from "vue";
import { useRoute, useRouter } from "vue-router";

import { UiButton, toast } from "mhz-ui";
import { isLinkActive } from "mhz-helpers";

import { currentUser, isAdmin, isAuth, logoutUser } from "../auth/index";
import { LOGO, URLS } from "../constants/index";

const route = useRoute();
const router = useRouter();

const isMenuOpen = shallowRef(false);

function toggleMenu(): void {
  isMenuOpen.value = !isMenuOpen.value;
}

function closeMenu(): void {
  isMenuOpen.value = false;
}

function openLogin(): void {
  closeMenu();
  void router.push(URLS.login);
}

function signOut(): void {
  closeMenu();
  logoutUser();
  toast.info("Вы вышли из личного кабинета");
  void router.push(URLS.home);
}
</script>

<style scoped>
.header {
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-gray-light);
}

.inner {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
}

.logo {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 20px;
  font-weight: 700;
  color: var(--color-primary-dark);
  text-decoration: none;
}

.logoImage {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.burger {
  display: none;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  background: none;
  border: none;
}

.burgerLine {
  width: 24px;
  height: 2px;
  background-color: var(--color-primary-dark);
}

.nav {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.link {
  color: var(--color-gray-dark-extra);
}

.linkActive {
  font-weight: 500;
  color: var(--color-primary);
}

.user {
  font-size: 12px;
  font-weight: 300;
  color: var(--color-gray-dark);
}

@media (max-width: 960px) {
  .burger {
    display: flex;
  }

  .nav {
    display: none;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }

  .navOpen {
    display: flex;
  }
}
</style>
