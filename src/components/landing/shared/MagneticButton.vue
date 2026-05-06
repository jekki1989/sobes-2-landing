<template>
  <component
    :is="tag"
    :to="to"
    :href="href"
    class="magnetic-btn"
    :class="[`variant-${variant}`, { 'is-large': large }]"
    @click="$emit('click', $event)"
  >
    <span class="btn-content">
      <slot />
    </span>
  </component>
</template>

<script setup>
const props = defineProps({
  variant: { type: String, default: 'primary' },
  to: { type: [String, Object], default: undefined },
  href: { type: String, default: undefined },
  large: { type: Boolean, default: false },
})

defineEmits(['click'])

const tag = props.to ? 'router-link' : (props.href ? 'a' : 'button')
</script>

<style scoped>
.magnetic-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 44px;
  padding: 0 18px;
  border: none;
  border-radius: 999px;
  font-family: inherit;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.magnetic-btn.is-large {
  min-height: 44px;
  padding: 0 18px;
  font-size: 15px;
  border-radius: 999px;
}

.variant-primary {
  color: var(--so-surface);
  border: 1px solid var(--so-brand);
  background: var(--so-brand);
}
.variant-primary:hover {
  background: color-mix(in srgb, var(--so-brand) 86%, var(--so-ink));
  border-color: color-mix(in srgb, var(--so-brand) 86%, var(--so-ink));
}

.variant-ghost {
  color: var(--so-mute);
  border: 1px solid transparent;
  background: transparent;
}
.variant-ghost:hover {
  color: var(--so-brand);
}

.variant-light {
  color: var(--so-ink);
  background: var(--so-surface);
  border: 1px solid var(--so-line);
}
.variant-light:hover {
  border-color: var(--so-brand);
}

.btn-content {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
</style>
