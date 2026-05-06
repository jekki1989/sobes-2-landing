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
  --section-gap: clamp(72px, 7.5vw, 112px);
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  isolation: isolate;
  background: transparent;
  color: var(--so-ink);
  padding: calc(var(--section-gap) / 2) 0;
}

.landing-section + .landing-section {
  border-top: 0;
}

.landing-section + .landing-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: min(1400px, calc(100% - 80px));
  border-top: 1px solid rgba(13, 16, 32, 0.05);
  pointer-events: none;
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
}

.landing-section :deep(.reveal) {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

.landing-section.is-visible :deep(.reveal) {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

.landing-section :deep(.kicker) {
  display: none;
}

.landing-section :deep(h2) {
  margin: 18px 0 0;
  color: var(--so-ink);
  font-size: clamp(36px, 4.5vw, 56px);
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.landing-section :deep(h3) {
  color: var(--so-ink);
  font-size: clamp(22px, 2.2vw, 28px);
  line-height: 1.12;
  letter-spacing: -0.02em;
}

.landing-section :deep(p) {
  color: var(--so-mute);
}

@media (max-width: 900px) {
  .landing-section {
    --section-gap: 56px;
  }

  .landing-section + .landing-section::before {
    width: min(1320px, calc(100% - 32px));
  }

  .section-inner {
    width: min(1320px, calc(100% - 32px));
  }
}
</style>
