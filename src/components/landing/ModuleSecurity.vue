<template>
  <section id="security" class="security-strip" aria-label="Безопасность StageOne">
    <div class="security-inner">
      <div class="security-items">
        <span v-for="item in items" :key="item.title">
          <i v-html="item.icon"></i>
          {{ item.title }}
        </span>
      </div>
      <a href="#faq">Подробнее</a>
    </div>
  </section>
</template>

<script setup>
const items = [
  {
    title: '152-ФЗ',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4Z" stroke-linejoin="round"/></svg>',
  },
  {
    title: 'SOC 2',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9"/></svg>',
  },
  {
    title: 'Шифрование',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  },
  {
    title: 'Аудит-лог',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z"/><path d="M14 3v6h6M9 13h6M9 17h6M9 9h2" stroke-linecap="round"/></svg>',
  },
]
</script>

<style scoped>
.security-strip {
  min-height: 104px;
  display: flex;
  align-items: center;
  background: var(--so-surface-2);
}

.security-inner {
  width: min(1400px, calc(100% - 80px));
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 24px;
  padding: 28px 0;
}

.security-items {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.security-items span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: var(--so-control-h);
  border: 1px solid var(--so-line);
  border-radius: 999px;
  background: var(--so-surface);
  color: var(--so-ink);
  font-size: 13px;
  font-weight: 700;
  transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s var(--so-ease);
}

.security-items span:hover {
  border-color: color-mix(in srgb, var(--so-brand) 30%, var(--so-line));
  color: var(--so-brand);
  transform: translateY(-1px);
}

i {
  display: inline-flex;
  width: 18px;
  height: 18px;
  color: var(--so-brand);
}

i :deep(svg) {
  width: 18px;
  height: 18px;
}

a {
  color: var(--so-brand);
  font-weight: 700;
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--so-brand-hover);
}

@media (max-width: 1024px) {
  .security-items {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .security-inner {
    grid-template-columns: 1fr;
    width: min(1400px, calc(100% - 32px));
  }
}

@media (max-width: 560px) {
  .security-items {
    grid-template-columns: 1fr;
  }
}
</style>
