<template>
  <div class="scroll-progress">
    <div class="progress-bar" :style="{ transform: `scaleX(${progress})` }"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  scroller: { type: [Object, null], default: null },
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
  height: 2px;
  z-index: 60;
  background: rgba(255, 255, 255, 0.04);
  pointer-events: none;
}

.progress-bar {
  height: 100%;
  width: 100%;
  transform-origin: 0 50%;
  background: linear-gradient(90deg, #2c4dff, #b837ff, #ff5bd5);
  background-size: 200% 100%;
  animation: shimmer 6s linear infinite;
  transform: scaleX(0);
  transition: transform 0.06s linear;
}

@keyframes shimmer {
  0% { background-position: 0% 0; }
  100% { background-position: 200% 0; }
}
</style>
