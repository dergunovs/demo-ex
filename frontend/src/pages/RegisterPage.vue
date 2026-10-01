<template>
  <div class="container">
    <div class="card">
      <h1>Регистрация</h1>

      <UiFlex tag="form" column gap="16" @submit.prevent="submitRegister">
        <UiField label="Логин" :error="error('login')" isRequired>
          <UiInput
            :modelValue="formData.login"
            placeholder="Латинские буквы и цифры, минимум 6 символов"
            :isDisabled="isSending"
            @update:modelValue="writeField('login', $event)"
          />
        </UiField>

        <UiField label="Пароль" :error="error('password')" isRequired>
          <UiInput
            :modelValue="formData.password"
            type="password"
            isPassword
            :isDisabled="isSending"
            @update:modelValue="writeField('password', $event)"
          />
        </UiField>

        <UiField label="ФИО" :error="error('fullName')" isRequired>
          <UiInput
            :modelValue="formData.fullName"
            placeholder="Иванов Иван Иванович"
            :isDisabled="isSending"
            @update:modelValue="writeField('fullName', $event)"
          />
        </UiField>

        <UiField label="Дата рождения" :error="error('birthDate')" isRequired>
          <UiInput
            :modelValue="formData.birthDate"
            :placeholder="DATE_PLACEHOLDER"
            :maxlength="DATE_LENGTH"
            :isDisabled="isSending"
            @update:modelValue="writeDate"
          />
        </UiField>

        <UiField label="Телефон" :error="error('phone')" isRequired>
          <UiInput
            :modelValue="formData.phone"
            type="tel"
            placeholder="+7 (900) 000-00-00"
            :isDisabled="isSending"
            @update:modelValue="writeField('phone', $event)"
          />
        </UiField>

        <UiField label="E-mail" :error="error('email')" isRequired>
          <UiInput
            :modelValue="formData.email"
            type="email"
            placeholder="ivan@mail.ru"
            :isDisabled="isSending"
            @update:modelValue="writeField('email', $event)"
          />
        </UiField>

        <p v-if="notice" class="notice">{{ notice }}</p>

        <UiButton type="submit" :isDisabled="isSending"
          >Зарегистрироваться</UiButton
        >
      </UiFlex>

      <RouterLink :to="URLS.login">Уже зарегистрированы? Вход</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

import { UiButton, UiField, UiFlex, UiInput, toast } from "mhz-ui";
import {
  email,
  handleError,
  letters,
  min,
  required,
  useValidate,
} from "mhz-helpers";

import { registerCustomer } from "../api/index";
import { DATE_PATTERN, DATE_PLACEHOLDER, PASSWORD_MIN } from "driverf-contracts";

import { DATE_LENGTH, URLS } from "../constants/index";
import { formatDateInput } from "../helpers/index";

import type { TRegisterData } from "driverf-contracts";

const router = useRouter();

const formData = ref<TRegisterData>({
  login: "",
  password: "",
  fullName: "",
  birthDate: "",
  phone: "",
  email: "",
});

const isSending = ref(false);
const notice = ref("");

const { error, isValid } = useValidate(
  formData,
  {
    login: [
      required("ru"),
      {
        pattern: /^[a-zA-Z0-9]{6,}$/,
        message: "Латинские буквы и цифры, минимум 6 символов",
      },
    ],
    password: [required("ru"), min(PASSWORD_MIN, "ru")],
    fullName: [required("ru"), letters("ru")],
    birthDate: [
      required("ru"),
      { pattern: DATE_PATTERN, message: "Дата в формате ДД.ММ.ГГГГ" },
    ],
    phone: [
      required("ru"),
      {
        pattern: /^\+?[\d\s()-]{10,18}$/,
        message: "Телефон в формате +7 (900) 000-00-00",
      },
    ],
    email: [required("ru"), email("ru")],
  },
  "ru",
);

function writeField(field: keyof TRegisterData, value?: string | number): void {
  formData.value[field] = String(value ?? "");
}

function writeDate(value?: string | number): void {
  formData.value.birthDate = formatDateInput(value);
}

async function submitRegister(): Promise<void> {
  notice.value = "";

  if (!isValid()) return;

  isSending.value = true;

  try {
    const { data } = await registerCustomer({ ...formData.value });

    toast.success(data.message);
    await router.push(URLS.login);
  } catch (requestError) {
    const message = handleError(requestError);

    notice.value = message;
    toast.error(message);
  } finally {
    isSending.value = false;
  }
}
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 560px;
  padding: 24px;
  margin: 0 auto;
  background-color: var(--color-white);
  border: 1px solid var(--color-gray-light);
  border-radius: var(--radius);
}

.notice {
  padding: 12px;
  font-size: 12px;
  font-weight: 300;
  color: var(--color-error-dark);
  background-color: var(--color-error-light);
  border-radius: var(--radius);
}
</style>
