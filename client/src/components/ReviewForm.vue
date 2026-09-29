<template>
  <UiFlex tag="form" column gap="16" @submit.prevent="saveReview">
    <p>Заявка {{ formatOrderNumber(order._id) }} · {{ order.transport.title }}</p>

    <UiField label="Оценка" :error="error('rating')" isRequired>
      <div class="rating">
        <button
          v-for="position in REVIEW_RATING_MAX"
          :key="position"
          type="button"
          class="star"
          :class="{ starActive: position <= formData.rating }"
          :aria-label="`Оценка ${position}`"
          @click="setRating(position)"
        >
          ★
        </button>
      </div>
    </UiField>

    <UiField label="Текст отзыва" :error="error('text')" isRequired>
      <UiTextarea :model-value="formData.text" :is-disabled="isSending" @update:model-value="writeText" />
    </UiField>

    <UiButton type="submit" :isDisabled="isSending">Сохранить отзыв</UiButton>
  </UiFlex>
</template>

<script setup lang="ts">
import { ref, shallowRef } from "vue";

import { UiButton, UiField, UiFlex, UiTextarea, toast } from "mhz-ui";
import { handleError, min, required, useValidate } from "mhz-helpers";

import { createReview } from "@/api";
import { REVIEW_RATING_MAX, REVIEW_TEXT_MIN } from "@/constants";
import { formatOrderNumber } from "@/format";

import type { IOrder } from "@/types";

interface IProps {
  order: IOrder;
}

interface IEmit {
  saved: [];
}

interface IReviewForm {
  rating: number;
  text: string;
}

const props = defineProps<IProps>();
const emit = defineEmits<IEmit>();

const formData = ref<IReviewForm>({ rating: 0, text: "" });
const isSending = shallowRef(false);

const ratingRule = {
  validator: (rule: unknown, value: unknown) => {
    const rating = Number(value);

    return rating >= 1 && rating <= REVIEW_RATING_MAX;
  },
  message: `Поставьте оценку от 1 до ${REVIEW_RATING_MAX}`,
};

const { error, isValid } = useValidate(
  formData,
  {
    rating: [ratingRule],
    text: [required("ru"), min(REVIEW_TEXT_MIN, "ru")],
  },
  "ru",
);

function setRating(position: number): void {
  formData.value.rating = position;
}

function writeText(value: string): void {
  formData.value.text = value;
}

async function saveReview(): Promise<void> {
  if (!isValid()) return;

  isSending.value = true;

  try {
    await createReview({
      order: props.order._id,
      rating: formData.value.rating,
      text: formData.value.text,
    });

    toast.success("Спасибо за отзыв");
    emit("saved");
  } catch (requestError) {
    toast.error(handleError(requestError));
  } finally {
    isSending.value = false;
  }
}
</script>

<style scoped>
.rating {
  display: flex;
  gap: 4px;
}

.star {
  padding: 0;
  font-size: 24px;
  line-height: 1;
  color: var(--color-gray);
  background: none;
  border: none;
}

.starActive {
  color: var(--color-success);
}
</style>
