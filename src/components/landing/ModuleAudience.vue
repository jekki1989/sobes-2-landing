<template>
  <section id="audience" class="audience-strip" aria-label="Кому подходит StageOne">
    <div class="audience-inner">
      <div class="segment-row">
        <span v-for="segment in segments" :key="segment">{{ segment }}</span>
      </div>
      <strong>1000+ интервью в месяц без расширения команды</strong>
    </div>
  </section>
</template>

<script setup>
const segments = [
  'Стартапы',
  'Скейл-апы',
  'Агентства',
  'Внутренние оценки',
]
</script>

<style scoped>
.audience-strip {
  min-height: 104px;
  display: flex;
  align-items: center;
  background: transparent;
}

.audience-inner {
  width: min(1400px, calc(100% - 80px));
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 24px;
  padding: 28px 0;
  border-top: 1px solid var(--so-line);
  border-bottom: 1px solid var(--so-line);
}

.segment-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.segment-row span {
  display: inline-flex;
  align-items: center;
  min-height: var(--so-control-h);
  padding: 0 18px;
  border: 1px solid var(--so-line);
  border-radius: 999px;
  background: var(--so-surface);
  color: var(--so-ink);
  font-size: 13px;
  font-weight: 700;
  transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s var(--so-ease);
}

.segment-row span:hover {
  border-color: color-mix(in srgb, var(--so-brand) 30%, var(--so-line));
  color: var(--so-brand);
  transform: translateY(-1px);
}

strong {
  color: var(--so-brand);
  font-size: clamp(18px, 2.4vw, 28px);
  line-height: 1.1;
  letter-spacing: -0.02em;
  text-align: right;
}

@media (max-width: 900px) {
  .audience-inner {
    grid-template-columns: 1fr;
    width: min(1400px, calc(100% - 32px));
  }

  strong {
    text-align: left;
  }
}
</style>
