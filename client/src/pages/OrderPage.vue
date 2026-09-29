<template>
  <div class="container">
    <div class="page">
      <section class="card">
        <h1>Оформление заявки</h1>
        <p class="lead">
          Выберите вид транспорта, укажите дату старта занятий в формате ДД.ММ.ГГГГ и способ оплаты.
          Заявка получит статус «Новая» и будет отправлена администратору на согласование.
        </p>

        <OrderForm
          :transports="transports"
          :payment-methods="paymentMethods"
          :is-loading="isSending || isLoading"
          @submit="submitOrder"
        />
      </section>

      <aside class="info">
        <h2>Программы обучения</h2>

        <div v-for="transport in transports" :key="transport._id" class="infoItem">
          <p class="infoTitle">{{ transport.title }}</p>
          <p class="infoPrice">{{ formatPrice(transport.price) }}</p>
          <p class="infoText">{{ transport.description }}</p>
        </div>

        <p v-if="!transports.length" class="infoText">Данные о программах загружаются.</p>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, shallowRef } from "vue";
import { useRouter } from "vue-router";

import { toast } from "mhz-ui";
import { handleError } from "mhz-helpers";

import { createOrder, fetchPaymentMethods, fetchTransports } from "@/api";
import OrderForm from "@/components/OrderForm.vue";
import { URLS } from "@/constants";
import { formatPrice } from "@/format";

import type { IPaymentMethod, ITransport, TOrderFormData } from "@/types";

const router = useRouter();

const transports = ref<ITransport[]>([]);
const paymentMethods = ref<IPaymentMethod[]>([]);
const isLoading = shallowRef(true);
const isSending = shallowRef(false);

async function loadDictionaries(): Promise<void> {
  isLoading.value = true;

  try {
    const [transportsReply, paymentMethodsReply] = await Promise.all([fetchTransports(), fetchPaymentMethods()]);

    transports.value = transportsReply.data;
    paymentMethods.value = paymentMethodsReply.data;
  } catch (requestError) {
    toast.error(handleError(requestError));
  } finally {
    isLoading.value = false;
  }
}

async function submitOrder(data: TOrderFormData): Promise<void> {
  isSending.value = true;

  try {
    const reply = await createOrder(data);

    toast.success(reply.data.message);
    await router.push(URLS.account);
  } catch (requestError) {
    toast.error(handleError(requestError));
  } finally {
    isSending.value = false;
  }
}

onMounted(loadDictionaries);
</script>

<style scoped>
.page {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: flex-start;
}

.page > * {
  flex: 1 1 360px;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius);
}

.lead {
  font-size: 12px;
  font-weight: 300;
  color: var(--color-gray-dark);
}

.info {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius);
}

.infoItem {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.infoTitle {
  font-weight: 500;
  color: var(--color-primary-dark);
}

.infoPrice {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-primary);
}

.infoText {
  font-size: 12px;
  font-weight: 300;
  color: var(--color-gray-dark);
}
</style>
