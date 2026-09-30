<template>
  <UiFlex tag="form" column gap="16" @submit.prevent="submit">
    <UiField label="Вид транспорта" :error="error('transport')" isRequired>
      <UiSelect
        :model-value="transportOption"
        :options="transportOptions"
        :is-disabled="isLoading"
        @update:model-value="chooseTransport"
      />
    </UiField>

    <UiField
      label="Дата начала обучения"
      :error="error('startDate')"
      isRequired
    >
      <UiInput
        :model-value="formData.startDate"
        :placeholder="DATE_PLACEHOLDER"
        :is-disabled="isLoading"
        :maxlength="DATE_LENGTH"
        @update:model-value="writeDate"
      />
    </UiField>

    <UiField label="Способ оплаты" :error="error('paymentMethod')" isRequired>
      <UiSelect
        :model-value="paymentMethodOption"
        :options="paymentMethodOptions"
        :is-disabled="isLoading"
        @update:model-value="choosePaymentMethod"
      />
    </UiField>

    <UiFlex gap="12" wrap>
      <UiButton type="submit" :isDisabled="isLoading"
        >Отправить заявку</UiButton
      >
      <UiButton
        type="button"
        layout="secondary"
        :isDisabled="isLoading"
        @click="resetForm"
        >Очистить</UiButton
      >
    </UiFlex>
  </UiFlex>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef } from "vue";

import { UiButton, UiField, UiFlex, UiInput, UiSelect } from "mhz-ui";
import { required, useValidate } from "mhz-helpers";

import { DATE_LENGTH, DATE_PATTERN, DATE_PLACEHOLDER } from "../constants/index";
import { formatDateInput, formatPrice } from "../helpers/index";

import type {
  IPaymentMethod,
  ISelectOption,
  ITransport,
  TOrderFormData,
} from "../types/index";

interface IProps {
  transports: ITransport[];
  paymentMethods: IPaymentMethod[];
  isLoading?: boolean;
}

interface IEmit {
  submit: [data: TOrderFormData];
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const formData = ref<TOrderFormData>({
  transport: "",
  startDate: "",
  paymentMethod: "",
});
const transportOption = shallowRef<ISelectOption>();
const paymentMethodOption = shallowRef<ISelectOption>();

const transportOptions = computed<ISelectOption[]>(() =>
  props.transports.map((transport) => ({
    _id: transport._id,
    title: `${transport.title} — ${formatPrice(transport.price)}`,
  })),
);

const paymentMethodOptions = computed<ISelectOption[]>(() =>
  props.paymentMethods.map((paymentMethod) => ({
    _id: paymentMethod._id,
    title: paymentMethod.title,
  })),
);

const futureDateRule = {
  validator: (rule: unknown, value: unknown) => {
    const [day, month, year] = String(value).split(".").map(Number);
    const startDate = new Date(year, month - 1, day).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);

    return startDate >= today;
  },
  message: "Дата начала обучения не может быть в прошлом",
};

const { error, isValid } = useValidate(
  formData,
  {
    transport: [required("ru")],
    startDate: [
      required("ru"),
      { pattern: DATE_PATTERN, message: "Дата в формате ДД.ММ.ГГГГ" },
      futureDateRule,
    ],
    paymentMethod: [required("ru")],
  },
  "ru",
);

function chooseTransport(value?: string | number | ISelectOption): void {
  transportOption.value =
    typeof value === "object" && value ? value : undefined;
  formData.value.transport = transportOption.value?._id ?? "";
}

function choosePaymentMethod(value?: string | number | ISelectOption): void {
  paymentMethodOption.value =
    typeof value === "object" && value ? value : undefined;
  formData.value.paymentMethod = paymentMethodOption.value?._id ?? "";
}

function writeDate(value?: string | number): void {
  formData.value.startDate = formatDateInput(value);
}

function resetForm(): void {
  formData.value = { transport: "", startDate: "", paymentMethod: "" };
  transportOption.value = undefined;
  paymentMethodOption.value = undefined;
}

function submit(): void {
  if (!isValid()) return;

  emit("submit", { ...formData.value });
}
</script>
