<template>
  <span ref="el" class="counter">{{ display }}</span>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  value: { type: Number, required: true },
  duration: { type: Number, default: 1600 },
  decimals: { type: Number, default: 0 },
  prefix: { type: String, default: '' },
  suffix: { type: String, default: '' },
  separator: { type: String, default: ' ' },
  trigger: { type: Boolean, default: true },
})

const el = ref(null)
const display = ref('')
let observer = null
let started = false

function format(n) {
  const fixed = n.toFixed(props.decimals)
  const [intPart, dec] = fixed.split('.')
  const withSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, props.separator)
  return props.prefix + (dec ? `${withSep}.${dec}` : withSep) + props.suffix
}

function animate() {
  if (started) return
  started = true
  const startTime = performance.now()
  const from = 0
  const to = props.value
  function tick(now) {
    const t = Math.min(1, (now - startTime) / props.duration)
    const eased = 1 - Math.pow(1 - t, 3)
    display.value = format(from + (to - from) * eased)
    if (t < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

onMounted(() => {
  display.value = format(0)
  if (!props.trigger) return
  observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) animate()
    })
  }, { threshold: 0.4 })
  observer.observe(el.value)
})

watch(() => props.trigger, (v) => {
  if (v) animate()
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<style scoped>
.counter {
  font-variant-numeric: tabular-nums;
  display: inline-block;
}
</style>
