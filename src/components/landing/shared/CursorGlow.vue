<template>
  <div ref="el" class="cursor-glow" aria-hidden="true"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const el = ref(null)
let raf = 0
let targetX = 0
let targetY = 0
let curX = 0
let curY = 0

function onMove(e) {
  targetX = e.clientX
  targetY = e.clientY
}

function loop() {
  curX += (targetX - curX) * 0.12
  curY += (targetY - curY) * 0.12
  if (el.value) el.value.style.transform = `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%)`
  raf = requestAnimationFrame(loop)
}

onMounted(() => {
  window.addEventListener('mousemove', onMove, { passive: true })
  raf = requestAnimationFrame(loop)
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMove)
  cancelAnimationFrame(raf)
})
</script>

<style scoped>
.cursor-glow {
  position: fixed;
  top: 0;
  left: 0;
  width: 520px;
  height: 520px;
  pointer-events: none;
  z-index: 1;
  background: radial-gradient(circle, rgba(124, 99, 255, 0.18) 0%, rgba(124, 99, 255, 0.04) 35%, transparent 70%);
  mix-blend-mode: screen;
  transition: opacity 0.3s;
}

@media (max-width: 900px) {
  .cursor-glow { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .cursor-glow { display: none; }
}
</style>
