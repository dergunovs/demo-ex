<template>  <div class="slider" @mouseenter="stopAutoSlide" @mouseleave="startAutoSlide">
    <div class="track" :style="{transform: `translateX(-${activeIndex * 100}%)`}">
      <img v-for="(image, position) in images" :key="image" class="image" :src="image" :alt="`Слайд ${position + 1}`" />
    </div>

    <button type="button" class="arrow arrowPrev" aria-label="Предыдущий слайд" @click="showPreviousSlide">‹</button>
    <button type="button" class="arrow arrowNext" aria-label="Следующий слайд" @click="showNextSlide">›</button>

    <div class="dots">
      <button
        v-for="(image, position) in images"
        :key="image"
        type="button"
        class="dot"
        :class="{dotActive: position === activeIndex}"
        :aria-label="`Показать слайд ${position + 1}`"
        @click="goToSlide(position)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, shallowRef} from "vue";

import {SLIDE_INTERVAL} from "@/constants";

interface IProps {
  images: string[];
  interval?: number;
}

const props = withDefaults(defineProps<IProps>(), {interval: SLIDE_INTERVAL});

const activeIndex = shallowRef(0);
let timer: number | undefined;

function showNextSlide(): void {
  activeIndex.value = (activeIndex.value + 1) % props.images.length;
}

function showPreviousSlide(): void {
  activeIndex.value = (activeIndex.value - 1 + props.images.length) % props.images.length;
}

function goToSlide(position: number): void {
  activeIndex.value = position;
}

function stopAutoSlide(): void {
  if (timer === undefined) return;

  window.clearInterval(timer);
  timer = undefined;
}

function startAutoSlide(): void {
  stopAutoSlide();
  timer = window.setInterval(showNextSlide, props.interval);
}

onMounted(startAutoSlide);
onUnmounted(stopAutoSlide);
</script>

<style scoped lang="scss">
.slider {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius);
}

.track {
  display: flex;
  transition: transform 400ms ease;
}

.image {
  flex-shrink: 0;
  width: 100%;
  aspect-ratio: 2 / 1;
  object-fit: cover;
}

.arrow {
  position: absolute;
  top: calc(50% - 24px);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 48px;
  font-size: 24px;
  line-height: 1;
  color: var(--color-primary-dark);
  background-color: var(--color-white-transparent);
  border: none;
  border-radius: var(--radius);
  padding-bottom: 8px;
}

.arrowPrev {
  left: 8px;
}

.arrowNext {
  right: 8px;
}

.dots {
  position: absolute;
  right: 0;
  bottom: 12px;
  left: 0;
  display: flex;
  gap: 8px;
  justify-content: center;
}

.dot {
  width: 8px;
  height: 8px;
  padding: 0;
  background-color: var(--color-white-transparent);
  border: none;
  border-radius: 4px;
}

.dotActive {
  background-color: var(--color-white);
}
</style>
