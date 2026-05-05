<template>
  <section
    :id="id"
    ref="sectionRef"
    class="landing-section"
    :class="[{ 'is-visible': isVisible }, variant && `variant-${variant}`]"
    :data-section-id="id"
  >
    <div class="section-bg" aria-hidden="true">
      <slot name="bg" />
    </div>
    <div class="section-inner">
      <slot />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  id: { type: String, required: true },
  variant: { type: String, default: '' },
})

const emit = defineEmits(['enter', 'leave'])
const sectionRef = ref(null)
const isVisible = ref(false)
let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
          isVisible.value = true
          emit('enter', props.id)
        } else if (!entry.isIntersecting) {
          emit('leave', props.id)
        }
      })
    },
    { threshold: [0, 0.3, 0.6, 0.9] }
  )
  if (sectionRef.value) observer.observe(sectionRef.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<style scoped>
.landing-section {
  position: relative;
  min-height: 100vh;
  width: 100%;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  isolation: isolate;
}

.section-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.section-inner {
  position: relative;
  z-index: 1;
  width: min(1400px, calc(100% - 80px));
  padding: 80px 0;
}

.landing-section.is-visible :deep(.reveal) {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

@media (max-width: 900px) {
  .landing-section {
    min-height: auto;
    padding: 64px 0;
    scroll-snap-align: none;
  }
  .section-inner {
    width: min(1320px, calc(100% - 32px));
    padding: 32px 0;
  }
}
</style>
