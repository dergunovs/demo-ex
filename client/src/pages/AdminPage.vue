<template>  <div class="page">
    <section class="container">
      <div class="head">
        <div>
          <h1>Панель администратора</h1>
          <p class="subtitle">Все заявки портала: фильтры, сортировка, постраничная навигация и смена статуса.</p>
        </div>

        <UiButton layout="secondary" isNarrow :isDisabled="isLoading" @click="loadOrders">Обновить</UiButton>
      </div>

      <div class="filters">
        <UiField label="Статус заявки">
          <UiSelect :model-value="statusOption" :options="ORDER_STATUS_OPTIONS" isClearable @update:model-value="chooseStatus" />
        </UiField>

        <UiField label="Вид транспорта">
          <UiSelect :model-value="transportOption" :options="transportOptions" isClearable @update:model-value="chooseTransport" />
        </UiField>

        <UiField label="Сортировка">
          <UiSelect :model-value="sortOption" :options="SORT_OPTIONS" @update:model-value="chooseSort" />
        </UiField>

        <UiField label="Поиск заявителя">
          <UiInput :model-value="searchDraft" :placeholder="SEARCH_HINT" @update:model-value="writeSearch" @keyup.enter="applyFilters" />
        </UiField>

        <div class="filterActions">
          <UiButton isNarrow @click="applyFilters">Найти</UiButton>
          <UiButton isNarrow layout="secondary" @click="resetFilters">Сбросить</UiButton>

          <UiButton isNarrow layout="secondary" @click="sortBy">
            {{ sortDir === "asc" ? "↑ По возрастанию" : "↓ По убыванию" }}
          </UiButton>
        </div>
      </div>
    </section>

    <section class="container">
      <p class="summary">Найдено заявок: {{ total }}</p>

      <p v-if="isLoading" class="notice">Загружаем заявки…</p>
      <p v-else-if="!orders.length" class="notice">По заданным условиям заявок нет.</p>

      <div class="list">
        <OrderCard v-for="order in orders" :key="order._id" :order="order" isAdmin @change-status="openStatusModal" />
      </div>

      <UiPagination v-if="total > PAGE_LIMIT" class="pagination" :page="page" :total="totalPages" @update="changePage" />
    </section>

    <StatusModal v-model="isShowStatusModal" :order="selectedOrder" @confirm="saveStatus" />
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, shallowRef} from "vue";

import {UiButton, UiField, UiInput, UiPagination, UiSelect, toast} from "mhz-ui";
import {handleError} from "mhz-helpers";

import {fetchOrders, fetchTransports, updateOrderStatus} from "@/api";
import OrderCard from "@/components/OrderCard.vue";
import StatusModal from "@/components/StatusModal.vue";
import {ORDER_STATUS_OPTIONS, PAGE_LIMIT, SEARCH_HINT, SORT_OPTIONS} from "@/constants";

import type {IOrder, IOrdersFilter, ISelectOption, TDirection, TOrderStatus} from "@/types";

const orders = ref<IOrder[]>([]);
const transportOptions = ref<ISelectOption[]>([]);
const total = ref(0);
const page = shallowRef(1);
const isLoading = shallowRef(false);
const filter = ref<IOrdersFilter>({status: "", transport: "", search: ""});
const searchDraft = shallowRef("");
const sortField = shallowRef("createdAt");
const sortDir = shallowRef<TDirection>("desc");
const selectedOrder = shallowRef<IOrder | null>(null);
const isShowStatusModal = shallowRef(false);

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / PAGE_LIMIT)));
const statusOption = computed(() => ORDER_STATUS_OPTIONS.find((option) => option._id === filter.value.status));
const transportOption = computed(() => transportOptions.value.find((option) => option._id === filter.value.transport));
const sortOption = computed(() => SORT_OPTIONS.find((option) => option._id === sortField.value));

function getOptionId(value?: string | number | ISelectOption): string {
  return typeof value === "object" && value?._id ? value._id : "";
}

async function loadOrders(): Promise<void> {
  isLoading.value = true;

  try {
    const {data} = await fetchOrders({
      page: page.value,
      limit: PAGE_LIMIT,
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
    transportOptions.value = (await fetchTransports()).data.map((transport) => ({
      _id: transport._id,
      title: transport.title,
    }));
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
  filter.value = {status: "", transport: "", search: ""};
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
    const {data} = await updateOrderStatus(selectedOrder.value._id, status);

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
