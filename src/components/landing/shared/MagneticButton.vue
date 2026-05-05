<template>
  <component
    :is="tag"
    ref="btnRef"
    :to="to"
    :href="href"
    class="magnetic-btn"
    :class="[`variant-${variant}`, { 'is-large': large }]"
    @mousemove="onMove"
    @mouseleave="onLeave"
    @click="$emit('click', $event)"
  >
    <span class="btn-bg" aria-hidden="true"></span>
    <span class="btn-content">
      <slot />
    </span>
  </component>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'primary' },
  to: { type: [String, Object], default: undefined },
  href: { type: String, default: undefined },
  large: { type: Boolean, default: false },
})

defineEmits(['click'])

const tag = props.to ? 'router-link' : (props.href ? 'a' : 'button')
const btnRef = ref(null)

function onMove(e) {
  const el = btnRef.value?.$el || btnRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const x = e.clientX - rect.left - rect.width / 2
  const y = e.clientY - rect.top - rect.height / 2
  el.style.transform = `translate(${x * 0.18}px, ${y * 0.32}px)`
}

function onLeave() {
  const el = btnRef.value?.$el || btnRef.value
  if (el) el.style.transform = ''
}
</script>

<style scoped>
.magnetic-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 52px;
  padding: 0 26px;
  border: none;
  border-radius: 16px;
  font-family: inherit;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: -0.01em;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  isolation: isolate;
  overflow: hidden;
}

.magnetic-btn.is-large {
  min-height: 62px;
  padding: 0 34px;
  font-size: 17px;
  border-radius: 18px;
}

.btn-bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  transition: transform 0.4s ease, opacity 0.3s;
}

.variant-primary {
  color: #fff;
}
.variant-primary .btn-bg {
  background: linear-gradient(135deg, #2c4dff 0%, #6e3df0 50%, #b837ff 100%);
  background-size: 220% 220%;
  background-position: 0% 50%;
  box-shadow: 0 18px 40px -10px rgba(76, 70, 245, 0.55);
}
.variant-primary:hover .btn-bg {
  background-position: 100% 50%;
  box-shadow: 0 22px 50px -8px rgba(184, 55, 255, 0.6);
}

.variant-ghost {
  color: var(--landing-text, #fff);
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(6px);
}
.variant-ghost:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.32);
}

.variant-light {
  color: #1a2554;
  background: #fff;
  box-shadow: 0 12px 28px -8px rgba(20, 30, 80, 0.18);
}
.variant-light:hover {
  background: #f4f6ff;
}

.btn-content {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  position: relative;
  z-index: 2;
}
</style>
