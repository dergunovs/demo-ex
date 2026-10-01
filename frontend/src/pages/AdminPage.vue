<template>
  <div class="page">
    <section class="container">
      <div class="head">
        <div>
          <h1>Панель администратора</h1>
          <p class="subtitle">
            Все заявки портала: фильтры, сортировка, постраничная навигация и
            смена статуса.
          </p>
        </div>

        <UiButton
          layout="secondary"
          isNarrow
          :isDisabled="isLoading"
          @click="loadOrders"
          >Обновить</UiButton
        >
      </div>

      <div class="filters">
        <UiField label="Статус заявки">
          <UiSelect
            :modelValue="statusOption"
            :options="ORDER_STATUS_OPTIONS"
            isClearable
            @update:modelValue="chooseStatus"
          />
        </UiField>

        <UiField label="Вид транспорта">
          <UiSelect
            :modelValue="transportOption"
            :options="transportOptions"
            isClearable
            @update:modelValue="chooseTransport"
          />
        </UiField>

        <UiField label="Сортировка">
          <UiSelect
            :modelValue="sortOption"
            :options="SORT_OPTIONS"
            @update:modelValue="chooseSort"
          />
        </UiField>

        <UiField label="Поиск заявителя">
          <UiInput
            :modelValue="searchDraft"
            placeholder="Поиск по ФИО, логину или почте"
            @update:modelValue="writeSearch"
            @keyup.enter="applyFilters"
          />
        </UiField>

        <div class="filterActions">
          <UiButton isNarrow @click="applyFilters">Найти</UiButton>
          <UiButton isNarrow layout="secondary" @click="resetFilters"
            >Сбросить</UiButton
          >

          <UiButton isNarrow layout="secondary" @click="sortBy">
            {{ sortDir === "asc" ? "↑ По возрастанию" : "↓ По убыванию" }}
          </UiButton>
        </div>
      </div>
    </section>

    <section class="container">
      <p class="summary">Найдено заявок: {{ total }}</p>

      <p v-if="isLoading" class="notice">Загружаем заявки…</p>
      <p v-else-if="!orders.length" class="notice">
        По заданным условиям заявок нет.
      </p>

      <div class="list">
        <OrderCard
          v-for="order in orders"
          :key="order._id"
          :order="order"
          isAdmin
          @changeStatus="openStatusModal"
        />
      </div>

      <UiPagination
        v-if="total > 5"
        class="pagination"
        :page="page"
        :total="totalPages"
        @update="changePage"
      />
    </section>

    <StatusModal
      v-model="isShowStatusModal"
      :order="selectedOrder"
      @confirm="saveStatus"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import {
  UiButton,
  UiField,
  UiInput,
  UiPagination,
  UiSelect,
  toast,
} from "mhz-ui";
import { handleError } from "mhz-helpers";

import { fetchOrders, fetchTransports, updateOrderStatus } from "../api/index";
import OrderCard from "../components/OrderCard.vue";
import StatusModal from "../components/StatusModal.vue";
import { ORDER_STATUS_OPTIONS, SORT_OPTIONS } from "../constants/index";

import type { IOrder, TDirection, TOrderStatus } from "driverf-contracts";

import type { IOrdersFilter, ISelectOption } from "../types/index";

const orders = ref<IOrder[]>([]);
const transportOptions = ref<ISelectOption[]>([]);
const total = ref(0);
const page = ref(1);
const isLoading = ref(false);
const filter = ref<IOrdersFilter>({ status: "", transport: "", search: "" });
const searchDraft = ref("");
const sortField = ref("createdAt");
const sortDir = ref<TDirection>("desc");
const selectedOrder = ref<IOrder | null>(null);
const isShowStatusModal = ref(false);

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / 5)));
const statusOption = computed(() =>
  ORDER_STATUS_OPTIONS.find((option) => option._id === filter.value.status),
);
const transportOption = computed(() =>
  transportOptions.value.find(
    (option) => option._id === filter.value.transport,
  ),
);
const sortOption = computed(() =>
  SORT_OPTIONS.find((option) => option._id === sortField.value),
);

function getOptionId(value?: string | number | ISelectOption): string {
  return typeof value === "object" && value?._id ? value._id : "";
}

async function loadOrders(): Promise<void> {
  isLoading.value = true;

  try {
    const { data } = await fetchOrders({
      page: page.value,
      limit: 5,
      sort: sortField.value,
      dir: sortDir.value,
      status: filter.value.status || undefined,
      transport: filter.value.transport || undefined,
      search: filter.value.search || undefined,
    });

    orders.value = data.data;
    total.value = data.total;
  } catch (requestError) {
    toast.error(handleError(requestError));
  } finally {
    isLoading.value = false;
  }
}

async function loadTransports(): Promise<void> {
  try {
    transportOptions.value = (await fetchTransports()).data.map(
      (transport) => ({
        _id: transport._id,
        title: transport.title,
      }),
    );
  } catch (requestError) {
    toast.error(handleError(requestError));
  }
}

function applyFilters(): void {
  filter.value.search = searchDraft.value.trim();
  page.value = 1;
  void loadOrders();
}

function resetFilters(): void {
  filter.value = { status: "", transport: "", search: "" };
  searchDraft.value = "";
  page.value = 1;
  void loadOrders();
}

function chooseStatus(value?: string | number | ISelectOption): void {
  filter.value.status = getOptionId(value);
  applyFilters();
}

function chooseTransport(value?: string | number | ISelectOption): void {
  filter.value.transport = getOptionId(value);
  applyFilters();
}

function chooseSort(value?: string | number | ISelectOption): void {
  sortField.value = getOptionId(value) || "createdAt";
  applyFilters();
}

function writeSearch(value?: string | number): void {
  searchDraft.value = String(value ?? "");
}

function sortBy(): void {
  sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
  applyFilters();
}

function changePage(value: number): void {
  page.value = value;
  void loadOrders();
}

function openStatusModal(order: IOrder): void {
  selectedOrder.value = order;
  isShowStatusModal.value = true;
}

async function saveStatus(status: TOrderStatus): Promise<void> {
  if (!selectedOrder.value) return;

  try {
    const { data } = await updateOrderStatus(selectedOrder.value._id, status);

    toast.success(data.message);
    selectedOrder.value = null;
    isShowStatusModal.value = false;
    await loadOrders();
  } catch (requestError) {
    toast.error(handleError(requestError));
  }
}

onMounted(() => {
  void loadTransports();
  void loadOrders();
});
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.head {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.subtitle {
  color: var(--color-gray-dark);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius);
}

.filters > * {
  flex: 1 1 240px;
}

.filterActions {
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 8px;
}

.summary {
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--color-primary-dark);
}

.notice {
  padding: 24px;
  text-align: center;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius);
}

.list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pagination {
  margin-top: 24px;
}
</style>
