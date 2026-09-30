<template>
  <div class="page">
    <section class="container">
      <div class="profile">
        <div>
          <h1>{{ currentUser?.fullName }}</h1>
          <p class="role">{{ roleLabel }} · логин {{ currentUser?.login }}</p>
        </div>

        <UiFlex gap="12" wrap>
          <UiButton v-if="!isAdmin" isNarrow @click="openOrderPage"
            >Новая заявка</UiButton
          >
          <UiButton v-else isNarrow @click="openAdminPage"
            >Админ-панель</UiButton
          >
          <UiButton layout="secondary" isNarrow @click="signOut"
            >Выйти</UiButton
          >
        </UiFlex>
      </div>

      <dl class="contacts">
        <div class="contact">
          <dt class="term">Дата рождения</dt>
          <dd class="value">{{ currentUser?.birthDate }}</dd>
        </div>
        <div class="contact">
          <dt class="term">Телефон</dt>
          <dd class="value">{{ currentUser?.phone }}</dd>
        </div>
        <div class="contact">
          <dt class="term">E-mail</dt>
          <dd class="value">{{ currentUser?.email }}</dd>
        </div>
      </dl>
    </section>

    <section class="container">
      <BaseSlider :images="SLIDES" />
    </section>

    <section class="container">
      <h2>История заявок</h2>

      <div class="list">
        <OrderCard
          v-for="order in orders"
          :key="order._id"
          :order="order"
          @write-review="openReviewModal"
        />
      </div>

      <p v-if="isLoaded && !orders.length" class="empty">
        Заявок пока нет.
        <RouterLink :to="URLS.order" class="link"
          >Оформить первую заявку</RouterLink
        >
      </p>
    </section>

    <UiModal v-model="isShowReviewModal" width="440">
      <ReviewForm
        v-if="selectedOrder"
        :order="selectedOrder"
        @saved="closeReviewModal"
      />
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from "vue";
import { RouterLink, useRouter } from "vue-router";

import { UiButton, UiFlex, UiModal, toast } from "mhz-ui";
import { handleError } from "mhz-helpers";

import { fetchOrders } from "../api/index";
import { currentUser, isAdmin, logoutUser } from "../auth/index";
import BaseSlider from "../components/BaseSlider.vue";
import OrderCard from "../components/OrderCard.vue";
import ReviewForm from "../components/ReviewForm.vue";
import { SLIDES, URLS } from "../constants/index";

import type { IOrder } from "driverf-contracts";

const router = useRouter();

const orders = ref<IOrder[]>([]);
const isLoaded = shallowRef(false);
const selectedOrder = shallowRef<IOrder | null>(null);
const isShowReviewModal = shallowRef(false);

const roleLabel = computed(() => (isAdmin.value ? "Администратор" : "Клиент"));

async function loadOrders(): Promise<void> {
  try {
    const { data } = await fetchOrders({
      limit: 50,
      sort: "createdAt",
      dir: "desc",
    });

    orders.value = data.data;
  } catch (requestError) {
    toast.error(handleError(requestError));
  } finally {
    isLoaded.value = true;
  }
}

function openOrderPage(): void {
  void router.push(URLS.order);
}

function openAdminPage(): void {
  void router.push(URLS.admin);
}

function openReviewModal(order: IOrder): void {
  selectedOrder.value = order;
  isShowReviewModal.value = true;
}

function closeReviewModal(): void {
  isShowReviewModal.value = false;
  selectedOrder.value = null;
  void loadOrders();
}

function signOut(): void {
  logoutUser();
  toast.info("Вы вышли из личного кабинета");
  void router.push(URLS.home);
}

onMounted(loadOrders);
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile,
.empty {
  padding: 16px;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius);
}

.profile {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
}

.empty {
  text-align: center;
}

.role {
  font-size: 12px;
  font-weight: 300;
  color: var(--color-gray-dark);
}

.contacts {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 16px 0 0;
}

.contact {
  flex: 1 1 200px;
  padding: 16px;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius);
}

.term {
  font-size: 12px;
  font-weight: 300;
  color: var(--color-gray-dark);
}

.value {
  margin: 0;
  font-weight: 500;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.link {
  font-weight: 500;
}
</style>
