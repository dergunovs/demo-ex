<template>
  <div class="container">
    <div class="card">
      <h1>Вход в личный кабинет</h1>

      <UiFlex tag="form" column gap="16" @submit.prevent="submitLogin">
        <UiField label="Логин" :error="error('login')" isRequired>
          <UiInput
            :modelValue="formData.login"
            :isDisabled="isSending"
            @update:modelValue="writeLogin"
          />
        </UiField>

        <UiField label="Пароль" :error="error('password')" isRequired>
          <UiInput
            :modelValue="formData.password"
            type="password"
            isPassword
            :isDisabled="isSending"
            @update:modelValue="writePassword"
          />
        </UiField>

        <p v-if="notice" class="notice">{{ notice }}</p>

        <UiButton type="submit" :isDisabled="isSending">Войти</UiButton>
      </UiFlex>

      <RouterLink :to="URLS.register"
        >Еще не зарегистрированы? Регистрация</RouterLink
      >

      <p class="hint">
        Панель администратора доступна после входа с логином Admin26
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";

import { UiButton, UiField, UiFlex, UiInput, toast } from "mhz-ui";
import { handleError, min, required, useValidate } from "mhz-helpers";

import { loginCustomer } from "../api/index";
import { applyToken, currentUser } from "../auth/index";
import { URLS } from "../constants/index";

import type { TLoginData } from "driverf-contracts";

const route = useRoute();
const router = useRouter();

const formData = ref<TLoginData>({ login: "", password: "" });
const isSending = ref(false);
const notice = ref("");

const redirect = computed(() =>
  typeof route.query.redirect === "string" ? route.query.redirect : "",
);

const { error, isValid } = useValidate(
  formData,
  {
    login: [required("ru")],
    password: [required("ru")],
  },
  "ru",
);

function writeLogin(value?: string | number): void {
  formData.value.login = String(value ?? "");
}

function writePassword(value?: string | number): void {
  formData.value.password = String(value ?? "");
}

async function submitLogin(): Promise<void> {
  notice.value = "";

  if (!isValid()) return;

  isSending.value = true;

  try {
    const { data } = await loginCustomer({ ...formData.value });

    applyToken(data.token);
    currentUser.value = data.user;
    toast.success(`Здравствуйте, ${data.user.fullName}`);

    await router.push(
      redirect.value ||
        (data.user.role === "admin" ? URLS.admin : URLS.account),
    );
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
  max-width: 480px;
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

.hint {
  font-size: 12px;
  font-weight: 300;
  color: var(--color-gray-dark);
}
</style>
