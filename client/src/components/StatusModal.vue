<template>
  <UiModal
    :model-value="modelValue"
    is-confirm
    width="400"
    @update:model-value="closeStatusModal"
    @confirm="confirmStatus"
  >
    <template v-if="order">
      <h3>Изменение статуса</h3>
      <p class="text">Заявка {{ formatOrderNumber(order._id) }} · {{ order.transport.title }}</p>
      <p class="text">Заявитель: {{ order.customer.fullName }}</p>
      <p class="current">Текущий статус: {{ ORDER_STATUS_LABEL[order.status] }}</p>

      <div class="options">
        <button
          v-for="status in availableStatuses"
          :key="status"
          type="button"
          class="option"
          :class="{ optionActive: status === chosenStatus }"
          @click="chooseStatus(status)"
        >
          {{ ORDER_STATUS_LABEL[status] }}
        </button>
      </div>
    </template>
  </UiModal>
</template>

<script setup lang="ts">
import { computed, shallowRef } from "vue";

import { UiModal } from "mhz-ui";

import { ORDER_STATUS_LABEL, ORDER_STATUS_TRANSITIONS } from "@/constants";
import { formatOrderNumber } from "@/format";

import type { IOrder, TOrderStatus } from "@/types";

interface IProps {
  modelValue: boolean;
  order?: IOrder | null;
}

interface IEmit {
  "update:modelValue": [value: boolean];
  confirm: [status: TOrderStatus];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const selectedStatus = shallowRef<TOrderStatus>();

const availableStatuses = computed<TOrderStatus[]>(() =>
  props.order ? ORDER_STATUS_TRANSITIONS[props.order.status] : [],
);

const chosenStatus = computed<TOrderStatus | undefined>(() => selectedStatus.value ?? availableStatuses.value[0]);

function chooseStatus(status: TOrderStatus): void {
  selectedStatus.value = status;
}

function closeStatusModal(value?: boolean): void {
  selectedStatus.value = undefined;
  emit("update:modelValue", value ?? false);
}

function confirmStatus(): void {
  if (!chosenStatus.value) return;

  emit("confirm", chosenStatus.value);
  closeStatusModal(false);
}
</script>

<style scoped>
.text {
  font-size: 12px;
  font-weight: 300;
  color: var(--color-gray-dark);
}

.current {
  margin: 8px 0;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-primary-dark);
}

.options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option {
  padding: 12px;
  font-size: 16px;
  text-align: left;
  background-color: var(--color-gray-light-extra);
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius);
}

.optionActive {
  background-color: var(--color-primary-light-extra);
  border-color: var(--color-primary);
}
</style>
