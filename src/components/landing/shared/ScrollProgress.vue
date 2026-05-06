<template>
  <nav class="scroll-progress" aria-label="Навигация по секциям">
    <div class="progress-track">
      <a
        v-for="s in sections"
        :key="s.id"
        :href="`#${s.id}`"
        :class="['progress-marker', { active: activeId === s.id }]"
        :style="{ width: `${100 / (sections.length || 1)}%` }"
        @click.prevent="navigate(s.id)"
      >
        <span>{{ s.label }}</span>
      </a>
      <div class="progress-bar" :style="{ transform: `scaleX(${progress})` }"></div>
    </div>
    <div class="scroll-thread">
      <span class="thread-dot" :style="{ top: `${progress * 100}%` }"></span>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  scroller: { type: [Object, null], default: null },
  sections: { type: Array, default: () => [] },
  activeId: { type: String, default: '' },
})

const progress = ref(0)
let target = null

function update() {
  const el = target
  if (!el) return
  const max = el.scrollHeight - el.clientHeight
  progress.value = max > 0 ? el.scrollTop / max : 0
}

onMounted(() => {
  target = props.scroller || window
  if (target === window) {
    window.addEventListener('scroll', updateWindow, { passive: true })
    updateWindow()
  } else {
    target.addEventListener('scroll', update, { passive: true })
    update()
  }
})

function updateWindow() {
  const max = document.documentElement.scrollHeight - window.innerHeight
  progress.value = max > 0 ? window.scrollY / max : 0
}

function navigate(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onBeforeUnmount(() => {
  if (target === window) window.removeEventListener('scroll', updateWindow)
  else target?.removeEventListener('scroll', update)
})
</script>

<style scoped>
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 0;
  z-index: 60;
  pointer-events: none;
}

.progress-track {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: color-mix(in srgb, var(--so-brand) 10%, transparent);
  pointer-events: none;
  visibility: hidden;
}

.progress-bar {
  position: absolute;
  inset: 0;
  height: 100%;
  width: 100%;
  transform-origin: 0 50%;
  background: var(--so-brand);
  transform: scaleX(0);
  transition: transform 0.06s linear;
}

.progress-marker {
  position: relative;
  z-index: 1;
  display: block;
  float: left;
  height: 100%;
  text-decoration: none;
}

.progress-marker::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  width: 1px;
  height: 100%;
  background: var(--so-surface);
  opacity: 0.65;
}

.progress-marker span {
  position: absolute;
  top: 9px;
  left: 50%;
  transform: translateX(-50%) translateY(-4px);
  color: var(--so-mute);
  background: var(--so-surface);
  border: 1px solid var(--so-line);
  border-radius: 999px;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.progress-marker:hover span,
.progress-marker.active span {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.scroll-thread {
  position: fixed;
  left: 28px;
  top: 118px;
  bottom: 32px;
  width: 1px;
  background: var(--so-line);
  pointer-events: none;
}

.thread-dot {
  position: absolute;
  left: 50%;
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--so-brand);
  transform: translate(-50%, -50%);
  transition: top 0.08s linear;
}

@media (max-width: 1100px) {
  .scroll-thread {
    display: none;
  }

  .progress-marker span {
    display: none;
  }
}
</style>
