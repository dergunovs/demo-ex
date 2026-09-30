<template>
  <div class="page">
    <section class="container">
      <div class="hero">
        <h1>Курсы вождения речного транспорта</h1>
        <p class="lead">
          Катера, круизные лайнеры и яхты: теория, практика на воде и подготовка
          к экзамену. Зарегистрируйтесь и подайте заявку на обучение онлайн.
        </p>

        <UiFlex gap="12" wrap>
          <UiButton v-if="!isAuth" @click="openRegister"
            >Зарегистрироваться</UiButton
          >
          <UiButton v-else @click="openOrder">Оформить заявку</UiButton>
          <UiButton layout="secondary" @click="openPrivateArea"
            >Личный кабинет</UiButton
          >
        </UiFlex>
      </div>
    </section>

    <section class="container">
      <BaseSlider :images="SLIDES" />
    </section>

    <section class="container">
      <h2>Виды транспорта</h2>

      <div class="cards">
        <article
          v-for="transport in transports"
          :key="transport._id"
          class="card"
        >
          <h3>{{ transport.title }}</h3>
          <p class="cardText">{{ transport.description }}</p>
          <p class="price">{{ formatPrice(transport.price) }}</p>
        </article>
      </div>

      <p v-if="!transports.length" class="empty">
        Учебные программы загружаются.
      </p>
    </section>

    <section class="container">
      <h2>Как записаться на обучение</h2>

      <ol class="steps">
        <li v-for="step in STEPS" :key="step.title" class="step">
          <p class="stepTitle">{{ step.title }}</p>
          <p class="stepText">{{ step.text }}</p>
        </li>
      </ol>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import { UiButton, UiFlex, toast } from "mhz-ui";
import { handleError } from "mhz-helpers";

import { fetchTransports } from "../api/index";
import { isAuth } from "../auth/index";
import BaseSlider from "../components/BaseSlider.vue";
import { SLIDES, URLS } from "../constants/index";
import { formatPrice } from "../helpers/index";

import type { ITransport } from "driverf-contracts";

interface IStep {
  title: string;
  text: string;
}

const STEPS: IStep[] = [
  {
    title: "1. Регистрация",
    text: "Создайте личный кабинет: логин, пароль и персональные данные.",
  },
  {
    title: "2. Заявка",
    text: "Выберите вид транспорта, дату старта занятий и способ оплаты.",
  },
  {
    title: "3. Согласование",
    text: "Администратор проверяет заявку и переводит её в статус «Идет обучение».",
  },
  {
    title: "4. Обучение и отзыв",
    text: "После завершения курса оставьте отзыв в личном кабинете.",
  },
];

const router = useRouter();
const transports = ref<ITransport[]>([]);

async function loadTransports(): Promise<void> {
  try {
    transports.value = (await fetchTransports()).data;
  } catch (requestError) {
    toast.error(handleError(requestError));
  }
}

function openRegister(): void {
  void router.push(URLS.register);
}

function openOrder(): void {
  void router.push(URLS.order);
}

function openPrivateArea(): void {
  void router.push(isAuth.value ? URLS.account : URLS.login);
}

onMounted(loadTransports);
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius);
}

.lead {
  max-width: 640px;
  color: var(--color-gray-dark);
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.cards > * {
  flex: 1 1 280px;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius);
}

.cardText {
  flex-grow: 1;
  font-size: 12px;
  font-weight: 300;
  color: var(--color-gray-dark);
}

.price {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-primary);
}

.empty {
  color: var(--color-gray-dark);
}

.steps {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding-left: 0;
  list-style: none;
}

.steps > * {
  flex: 1 1 240px;
}

.step {
  padding: 16px;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius);
}

.stepTitle {
  font-weight: 500;
  color: var(--color-primary-dark);
}

.stepText {
  font-size: 12px;
  font-weight: 300;
  color: var(--color-gray-dark);
}
</style>
