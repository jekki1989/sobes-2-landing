<template>
  <section id="audience" class="audience-strip" aria-label="Кому подходит StageOne">
    <div class="audience-inner">
      <span class="strip-label">Для кого</span>
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
  gap: 20px;
  padding: 24px 0;
  border-top: 1px solid var(--so-line);
  border-bottom: 1px solid var(--so-line);
}

.strip-label {
  display: none;
}

.segment-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.segment-row span {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 14px;
  border: 1px solid var(--so-line);
  border-radius: 999px;
  background: var(--so-surface);
  color: var(--so-ink);
  font-size: 13px;
  font-weight: 800;
}

strong {
  color: var(--so-brand);
  font-size: clamp(18px, 2.4vw, 28px);
  line-height: 1.1;
  letter-spacing: -0.02em;
  text-align: right;
}

@media (max-width: 980px) {
  .audience-inner {
    grid-template-columns: 1fr;
    width: min(1400px, calc(100% - 32px));
  }

  strong {
    text-align: left;
  }
}
</style>
