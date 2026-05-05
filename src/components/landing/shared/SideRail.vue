<template>
  <nav class="side-rail" aria-label="Section navigation">
    <ul>
      <li v-for="s in sections" :key="s.id">
        <a
          :href="`#${s.id}`"
          :class="['rail-dot', { active: activeId === s.id }]"
          :aria-current="activeId === s.id ? 'true' : 'false'"
          @click.prevent="onClick(s.id)"
        >
          <span class="dot"></span>
          <span class="label">{{ s.label }}</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
defineProps({
  sections: { type: Array, required: true },
  activeId: { type: String, default: '' },
})

const emit = defineEmits(['navigate'])

function onClick(id) {
  emit('navigate', id)
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped>
.side-rail {
  position: fixed;
  right: 22px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 50;
}

.side-rail ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 10px;
  border-radius: 999px;
  background: rgba(8, 10, 30, 0.36);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.rail-dot {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  text-decoration: none;
}

.rail-dot .dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.32);
  transition: background 0.25s, transform 0.25s, box-shadow 0.25s;
}

.rail-dot.active .dot {
  background: #fff;
  transform: scale(1.6);
  box-shadow: 0 0 0 4px rgba(124, 99, 255, 0.4), 0 0 16px rgba(124, 99, 255, 0.5);
}

.rail-dot:hover .dot {
  background: #b9c2ff;
}

.rail-dot .label {
  position: absolute;
  right: 32px;
  top: 50%;
  transform: translateY(-50%) translateX(8px);
  white-space: nowrap;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #fff;
  background: rgba(8, 10, 30, 0.78);
  padding: 6px 10px;
  border-radius: 8px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s, transform 0.2s;
}

.rail-dot:hover .label {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}

@media (max-width: 1100px) {
  .side-rail { display: none; }
}
</style>
