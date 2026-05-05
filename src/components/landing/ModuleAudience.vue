<template>
  <SectionScaffold id="audience" variant="audience">
    <template #bg>
      <div class="aud-bg"></div>
    </template>

    <div class="aud-layout">
      <div class="head reveal">
        <span class="kicker">Use cases</span>
        <h2>Под любую модель найма</h2>
        <p>Стартап без HR-отдела, продуктовая компания со 100+ вакансиями, агентство массового найма — у каждого свой плюс.</p>
      </div>

      <div class="aud-content reveal">
        <div class="tabs">
          <button
            v-for="(t, i) in tabs"
            :key="t.id"
            :class="['tab', { active: i === activeIdx }]"
            @click="activeIdx = i"
          >
            <span class="tab-icon" v-html="t.icon"></span>
            <span class="tab-text">
              <strong>{{ t.title }}</strong>
              <em>{{ t.subtitle }}</em>
            </span>
          </button>
        </div>

        <transition name="fade-up" mode="out-in">
          <div :key="activeIdx" class="panel">
            <div class="panel-info">
              <span class="panel-tag">{{ tabs[activeIdx].tag }}</span>
              <h3>{{ tabs[activeIdx].headline }}</h3>
              <p>{{ tabs[activeIdx].description }}</p>
              <div class="panel-bullets">
                <div v-for="(b, i) in tabs[activeIdx].bullets" :key="i" class="bullet">
                  <div class="bullet-icon" v-html="b.icon"></div>
                  <div>
                    <strong>{{ b.title }}</strong>
                    <span>{{ b.text }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="panel-metric">
              <div class="metric-card">
                <span class="metric-label">{{ tabs[activeIdx].metric.label }}</span>
                <div class="metric-value">{{ tabs[activeIdx].metric.value }}</div>
                <span class="metric-foot">{{ tabs[activeIdx].metric.note }}</span>
              </div>
              <div class="conveyor">
                <div class="conv-track">
                  <div
                    v-for="n in 8"
                    :key="n"
                    class="conv-item"
                    :style="{ animationDelay: `${n * 0.4}s` }"
                  >
                    <div class="conv-avatar"></div>
                  </div>
                </div>
                <div class="conv-pipe">
                  <span class="pipe-arrow"></span>
                </div>
                <div class="conv-output">
                  <div class="output-card">
                    <span>Отчёт</span>
                    <strong>{{ tabs[activeIdx].metric.value }}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <div class="logos reveal">
        <span class="logos-title">Доверяют</span>
        <div class="logos-row">
          <div v-for="n in 6" :key="n" class="logo-placeholder" :style="{ animationDelay: `${n * 0.15}s` }">
            <div class="logo-shape"></div>
            <span>BRAND·{{ n }}</span>
          </div>
        </div>
      </div>
    </div>
  </SectionScaffold>
</template>

<script setup>
import { ref } from 'vue'
import SectionScaffold from './shared/SectionScaffold.vue'

const activeIdx = ref(0)

const tabs = [
  {
    id: 'startup',
    title: 'Стартапы 5–50',
    subtitle: 'без HR-отдела',
    tag: 'Без HR-отдела',
    headline: 'Найм без отвлечения СEO и техлида',
    description: 'Один основатель ведёт 30 параллельных воронок. AI закрывает первый этап, фаундер видит только сильных кандидатов.',
    bullets: [
      { title: '30 параллельных воронок', text: 'Один человек ведёт найм по 5 ролям одновременно', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke-linecap="round"/></svg>' },
      { title: 'Старт за 5 минут', text: 'Создал интервью, отправил ссылку — и пошёл писать код', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2" stroke-linecap="round"/></svg>' },
      { title: 'Free tier на старт', text: '5 интервью бесплатно — больше не нужно для seed-стадии', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4Z" stroke-linejoin="round"/></svg>' },
    ],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 2 3 7h7l-5.7 4.3 2.2 7L12 16l-6.5 4.3 2.2-7L2 9h7l3-7Z" stroke-linejoin="round"/></svg>',
    metric: { label: 'Воронок на одного сотрудника', value: '30×', note: 'против 3–5 без AI' },
  },
  {
    id: 'scaleup',
    title: 'Скейл-апы',
    subtitle: 'продуктовые',
    tag: 'Продуктовые компании',
    headline: 'Сеньоры пишут код, а не интервью',
    description: 'AI отрабатывает первый и часть второго этапа. Тех-лиды получают только тех, кто прошёл скрининг по hard skills.',
    bullets: [
      { title: '−80% часов сеньоров', text: 'Ваш техлид проводит финал, а не первый этап', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m4 16 4-4 4 4 8-8m0 0v6m0-6h-6" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
      { title: 'Единый формат', text: 'Все кандидаты получают одинаково проработанный скрининг', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 13h6M9 17h3" stroke-linecap="round"/></svg>' },
      { title: 'ATS-интеграция', text: 'Greenhouse, Huntflow, Lever, custom webhook', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.5-1.5" stroke-linejoin="round"/></svg>' },
    ],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21V11l9-7 9 7v10M9 21v-6h6v6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    metric: { label: 'Экономия часов сеньоров', value: '−80%', note: 'на скрининге middle/junior' },
  },
  {
    id: 'agency',
    title: 'Агентства',
    subtitle: 'массовый найм',
    tag: 'Массовый найм',
    headline: 'Объём и стандарт одновременно',
    description: 'Один рекрутёр обрабатывает 300 кандидатов в неделю с одинаково глубоким интервью у каждого.',
    bullets: [
      { title: '300 кандидатов / неделю', text: 'На одного рекрутёра. Без переработок и выгорания', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2M16 11a4 4 0 1 0 0-8M22 21v-2a4 4 0 0 0-3-3.87" stroke-linecap="round"/></svg>' },
      { title: 'Брендирование', text: 'Custom аватар и логотип под каждого клиента', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3 4 7v6c0 4.42 3.58 8 8 9 4.42-1 8-4.58 8-9V7l-8-4Z" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" stroke-linecap="round"/></svg>' },
      { title: 'White label', text: 'Ваш домен, ваш бренд, ваш отчёт', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 9v12" stroke-linecap="round"/></svg>' },
    ],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2M16 11a4 4 0 1 0 0-8" stroke-linecap="round"/></svg>',
    metric: { label: 'Кандидатов / рекрутёр / неделя', value: '300+', note: 'против 40–60 без AI' },
  },
  {
    id: 'internal',
    title: 'Внутренние оценки',
    subtitle: 'аттестация',
    tag: 'L&D / People-team',
    headline: '100% сотрудников = 100% оценок',
    description: 'Полугодовая аттестация всей команды. AI ведёт стандартный фрейм компетенций — без привязки к календарю руководителей.',
    bullets: [
      { title: 'Promotion-интервью', text: 'Стандартный фрейм для оценки роста по уровням', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 2 3 7h7l-5.7 4.3 2.2 7L12 16l-6.5 4.3 2.2-7L2 9h7l3-7Z" stroke-linejoin="round"/></svg>' },
      { title: '360° feedback', text: 'AI подсвечивает паттерны в ответах команды', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0Z"/><path d="M12 3v18M3 12h18" stroke-linecap="round"/></svg>' },
      { title: 'Калибровка', text: 'Одинаковая планка по всем командам и регионам', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18M7 14l4-4 4 4 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    ],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9"/></svg>',
    metric: { label: 'Покрытие команды', value: '100%', note: 'за полугодие, без хаоса слотов' },
  },
]
</script>

<style scoped>
.aud-bg {
  position: absolute; inset: 0;
  background:
    radial-gradient(40% 50% at 70% 0%, rgba(74,222,128,0.12), transparent 60%),
    radial-gradient(50% 50% at 0% 100%, rgba(124,99,255,0.16), transparent 60%),
    linear-gradient(180deg, #0d1130 0%, #131734 100%);
}

.aud-layout { display: grid; gap: 48px; }
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

.head { max-width: 760px; }
.kicker {
  display: inline-block; font-size: 12px; font-weight: 800;
  letter-spacing: 0.18em; text-transform: uppercase; color: #4ade80;
  padding: 6px 12px; background: rgba(74,222,128,0.12);
  border-radius: 999px; border: 1px solid rgba(74,222,128,0.3);
}
.head h2 { margin-top: 18px; font-size: clamp(34px, 4vw, 56px); line-height: 1.05; letter-spacing: -0.03em; color: #fff; }
.head p { margin-top: 12px; color: rgba(214,222,255,0.66); font-size: 17px; max-width: 580px; }

.aud-content {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
  align-items: start;
}

.tabs { display: flex; flex-direction: column; gap: 8px; }
.tab {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 14px;
  align-items: center;
  padding: 14px 16px;
  border-radius: 14px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  color: #d6deff;
  text-align: left;
  font: inherit;
  cursor: pointer;
  transition: 0.25s;
}
.tab:hover { background: rgba(255,255,255,0.08); }
.tab.active {
  background: linear-gradient(135deg, rgba(124,99,255,0.3), rgba(184,55,255,0.2));
  border-color: rgba(124,99,255,0.5);
  box-shadow: 0 8px 28px -8px rgba(124,99,255,0.5);
}
.tab-icon {
  width: 44px; height: 44px;
  border-radius: 12px;
  background: rgba(255,255,255,0.06);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.tab-icon svg { width: 22px; height: 22px; }
.tab-text strong { display: block; color: #fff; font-size: 14px; }
.tab-text em { display: block; color: rgba(214,222,255,0.55); font-size: 12px; font-style: normal; margin-top: 3px; }

.panel {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 32px;
  padding: 32px;
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
  border: 1px solid rgba(255,255,255,0.08);
  align-items: center;
  min-height: 420px;
}

.fade-up-enter-from { opacity: 0; transform: translateY(16px); }
.fade-up-enter-active { transition: 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
.fade-up-leave-to { opacity: 0; transform: translateY(-12px); }
.fade-up-leave-active { transition: 0.3s; }

.panel-tag {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 999px;
  background: rgba(74,222,128,0.16);
  color: #4ade80;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.panel-info h3 {
  margin-top: 14px;
  font-size: clamp(26px, 3vw, 36px);
  color: #fff;
  letter-spacing: -0.02em;
  line-height: 1.1;
}
.panel-info p {
  margin-top: 12px;
  color: rgba(214,222,255,0.7);
  font-size: 16px;
  line-height: 1.55;
  max-width: 540px;
}
.panel-bullets {
  margin-top: 22px;
  display: grid;
  gap: 12px;
}
.bullet {
  display: grid;
  grid-template-columns: 36px 1fr;
  gap: 12px;
  align-items: center;
}
.bullet-icon {
  width: 36px; height: 36px;
  border-radius: 10px;
  background: rgba(74,222,128,0.16);
  color: #4ade80;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.bullet-icon svg { width: 18px; height: 18px; }
.bullet strong { color: #fff; font-size: 14px; display: block; }
.bullet span { color: rgba(214,222,255,0.62); font-size: 13px; display: block; margin-top: 2px; }

.panel-metric {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.metric-card {
  padding: 22px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(74,222,128,0.16), rgba(124,99,255,0.08));
  border: 1px solid rgba(74,222,128,0.24);
}
.metric-label {
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(214,222,255,0.55);
  font-weight: 800;
}
.metric-value {
  margin-top: 10px;
  font-size: clamp(38px, 4vw, 52px);
  line-height: 1;
  letter-spacing: -0.04em;
  font-family: 'Space Grotesk';
  font-weight: 800;
  color: #fff;
  background: linear-gradient(120deg, #79e1ff, #4ade80);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.metric-foot {
  display: block;
  margin-top: 10px;
  color: rgba(214,222,255,0.66);
  font-size: 13px;
}

.conveyor {
  position: relative;
  height: 90px;
  border-radius: 14px;
  background: rgba(8,10,30,0.5);
  border: 1px solid rgba(255,255,255,0.06);
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 60px 100px;
  align-items: center;
  padding: 0 12px;
}

.conv-track { position: relative; height: 60px; }
.conv-item {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  animation: conveyor 4s linear infinite;
}
.conv-avatar {
  width: 24px; height: 24px;
  border-radius: 999px;
  background: linear-gradient(135deg, #79e1ff, #b837ff);
}
@keyframes conveyor {
  0% { left: -10%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { left: 100%; opacity: 0; }
}

.conv-pipe {
  display: flex;
  align-items: center;
  justify-content: center;
}
.pipe-arrow {
  width: 0; height: 0;
  border-left: 14px solid #4ade80;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  filter: drop-shadow(0 0 6px rgba(74,222,128,0.5));
}

.output-card {
  padding: 10px 12px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(74,222,128,0.2), rgba(124,99,255,0.1));
  border: 1px solid rgba(74,222,128,0.3);
  text-align: center;
}
.output-card span { display: block; font-size: 9px; color: rgba(214,222,255,0.55); letter-spacing: 0.1em; text-transform: uppercase; font-weight: 800; }
.output-card strong { display: block; margin-top: 4px; color: #4ade80; font-family: 'Space Grotesk'; font-size: 16px; }

.logos {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}
.logos-title {
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(214,222,255,0.4);
  font-weight: 800;
}
.logos-row { display: flex; gap: 18px; flex-wrap: wrap; }
.logo-placeholder {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 12px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  opacity: 0.7;
  animation: float-logo 8s ease-in-out infinite;
}
@keyframes float-logo {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
.logo-shape {
  width: 18px; height: 18px;
  border-radius: 5px;
  background: linear-gradient(135deg, #79e1ff, #b837ff);
}
.logo-placeholder span {
  font-family: 'Space Grotesk';
  font-weight: 700;
  color: rgba(214,222,255,0.6);
  font-size: 13px;
  letter-spacing: 0.05em;
}

@media (max-width: 1100px) {
  .aud-content { grid-template-columns: 1fr; }
  .tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .panel { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .tabs { grid-template-columns: 1fr; }
}
</style>
