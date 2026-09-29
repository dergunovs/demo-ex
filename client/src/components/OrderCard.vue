<template>
  <article class="card">
    <header class="head">
      <div>
        <p class="number">{{ formatOrderNumber(order._id) }}</p>
        <p class="date">Создана: {{ formatDate(order.createdAt) }}</p>
      </div>
      <span class="status" :class="order.status">{{
        ORDER_STATUS_LABEL[order.status]
      }}</span>
    </header>

    <dl class="rows">
      <div class="row">
        <dt class="term">Вид транспорта</dt>
        <dd class="value">
          {{ order.transport.title }} — {{ formatPrice(order.transport.price) }}
        </dd>
      </div>
      <div class="row">
        <dt class="term">Способ оплаты</dt>
        <dd class="value">{{ order.paymentMethod.title }}</dd>
      </div>
      <div class="row">
        <dt class="term">Старт обучения</dt>
        <dd class="value">{{ formatDate(order.startDate) }}</dd>
      </div>
    </dl>

    <div v-if="isAdmin" class="customer">
      <p class="customerTitle">Заявитель</p>
      <p>{{ order.customer.fullName }}, {{ order.customer.birthDate }}</p>
      <p>
        {{ order.customer.phone }} · {{ order.customer.email }} ·
        {{ order.customer.login }}
      </p>
    </div>

    <div v-if="order.review" class="review">
      <p class="reviewTitle">
        Отзыв клиента — {{ order.review.rating }} из {{ REVIEW_RATING_MAX }}
      </p>
      <p>{{ order.review.text }}</p>
    </div>

    <footer v-if="isAdmin || canWriteReview" class="actions">
      <UiButton
        v-if="isAdmin"
        isNarrow
        :isDisabled="!hasTransitions"
        @click="changeStatus"
      >
        Сменить статус
      </UiButton>
      <UiButton
        v-if="canWriteReview"
        isNarrow
        layout="accent"
        @click="writeReview"
        >Оставить отзыв</UiButton
      >
    </footer>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { UiButton } from "mhz-ui";
import { formatDate } from "mhz-helpers";

import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_TRANSITIONS,
  REVIEW_RATING_MAX,
} from "../constants";
import { formatOrderNumber, formatPrice } from "../format";

import type { IOrder } from "../types";

interface IProps {
  order: IOrder;
  isAdmin?: boolean;
}

interface IEmit {
  changeStatus: [order: IOrder];
  writeReview: [order: IOrder];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const hasTransitions = computed(
  () => ORDER_STATUS_TRANSITIONS[props.order.status].length > 0,
);
const canWriteReview = computed(
  () =>
    !props.isAdmin && props.order.status === "completed" && !props.order.review,
);

function changeStatus(): void {
  emit("changeStatus", props.order);
}

function writeReview(): void {
  emit("writeReview", props.order);
}
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius);
}

.head {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
}

.number {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-primary-dark);
}

.date {
  font-size: 12px;
  font-weight: 300;
  color: var(--color-gray-dark);
}

.status {
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-white);
  background-color: var(--color-primary);
  border-radius: var(--radius);
}

.new {
  background-color: var(--color-accent);
}

.completed {
  background-color: var(--color-success);
}

.rows {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
  justify-content: space-between;
}

.term {
  color: var(--color-gray-dark);
}

.value {
  margin: 0;
  font-weight: 500;
}

.customer,
.review {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  font-size: 12px;
  font-weight: 300;
  background-color: var(--color-gray-light-extra);
  border-radius: var(--radius);
}

.customerTitle,
.reviewTitle {
  font-weight: 500;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
