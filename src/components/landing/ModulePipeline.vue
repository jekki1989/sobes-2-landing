<template>
  <SectionScaffold id="pipeline" variant="pipeline">
    <template #bg>
      <div class="pipe-bg"></div>
    </template>

    <div class="pipe-layout">
      <div class="head reveal">
        <span class="kicker">Pipeline</span>
        <h2>4 шага от вакансии до офера</h2>
        <p>Один процесс — от создания интервью до отчёта. Без переключений между таблицами и календарями.</p>
      </div>

      <div class="track reveal">
        <div class="track-progress" :style="{ '--p': progressPercent + '%' }"></div>
        <div class="step-numbers">
          <button
            v-for="(s, i) in steps"
            :key="s.title"
            :class="['step-btn', { active: active === i, done: i < active }]"
            @click="active = i"
          >
            <span class="step-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="step-title">{{ s.title }}</span>
          </button>
        </div>
      </div>

      <div class="stage">
        <transition name="fade-slide" mode="out-in">
          <div :key="active" class="stage-card reveal">
            <div class="stage-visual">
              <component :is="stages[active]" />
            </div>
            <div class="stage-info">
              <span class="stage-step">Шаг {{ active + 1 }} из {{ steps.length }}</span>
              <h3>{{ steps[active].title }}</h3>
              <p>{{ steps[active].description }}</p>
              <ul>
                <li v-for="(f, i) in steps[active].features" :key="i">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <path d="m5 12 5 5L20 7" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  {{ f }}
                </li>
              </ul>
              <div class="stage-controls">
                <button class="ctl prev" @click="active = (active - 1 + steps.length) % steps.length">←</button>
                <button class="ctl next" @click="active = (active + 1) % steps.length">→</button>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </SectionScaffold>
</template>

<script setup>
import { ref, computed, h, onMounted, onBeforeUnmount } from 'vue'
import SectionScaffold from './shared/SectionScaffold.vue'

const steps = [
  {
    title: 'Создаёте интервью',
    description: 'Указываете стек, уровень и количество вопросов. AI сам формирует базу вопросов под вакансию.',
    features: [
      'Стек, уровень, формат за 1 экран',
      'AI генерирует вопросы под роль',
      'Шаблоны Frontend / Backend / DevOps / Data',
    ],
  },
  {
    title: 'Отправляете ссылку',
    description: 'Уникальная ссылка работает 24/7. Кандидат открывает её и сразу попадает на интервью.',
    features: [
      'Без регистрации кандидата',
      'Один клик — интервью начато',
      'История переходов и попыток',
    ],
  },
  {
    title: 'AI ведёт диалог',
    description: 'Аватар голосом задаёт вопросы, слушает ответы и адаптирует follow-up по ходу разговора.',
    features: [
      'Голос, текст или видео-режим',
      'Адаптивные follow-up вопросы',
      'STT в реальном времени, latency <200ms',
    ],
  },
  {
    title: 'Получаете отчёт',
    description: 'После завершения сессии HR видит сводный скор, фидбек по каждому вопросу и транскрипт.',
    features: [
      'Скоринг 0–10 по каждому вопросу',
      'Транскрипт + аудио сессии',
      'Экспорт в PDF / интеграция с ATS',
    ],
  },
]

const active = ref(0)
const progressPercent = computed(() => ((active.value + 1) / steps.length) * 100)

let auto = 0
onMounted(() => {
  auto = setInterval(() => {
    if (!document.hidden) active.value = (active.value + 1) % steps.length
  }, 5400)
})
onBeforeUnmount(() => clearInterval(auto))

const StageCreate = {
  setup() {
    const fields = [
      { label: 'Должность', val: 'Frontend Engineer' },
      { label: 'Стек', val: 'React, TypeScript, Next.js' },
      { label: 'Уровень', val: 'Middle' },
      { label: 'Вопросов', val: '5' },
    ]
    const typed = ref(fields.map(() => ''))
    onMounted(() => {
      fields.forEach((f, fi) => {
        let i = 0
        const t = setInterval(() => {
          typed.value[fi] = f.val.slice(0, ++i)
          if (i >= f.val.length) clearInterval(t)
        }, 40 + fi * 8)
      })
    })
    return () => h('div', { class: 'mock-form' }, [
      h('div', { class: 'mf-head' }, 'Новое интервью'),
      ...fields.map((f, i) =>
        h('label', { class: 'mf-field' }, [
          h('span', f.label),
          h('input', { value: typed.value[i], readonly: true }),
        ])
      ),
      h('div', { class: 'mf-cta' }, 'Создать интервью →'),
    ])
  },
}

const StageShare = {
  setup() {
    const copied = ref(false)
    function copy() {
      copied.value = true
      setTimeout(() => { copied.value = false }, 1800)
    }
    return () => h('div', { class: 'mock-share' }, [
      h('div', { class: 'ms-link' }, [
        h('span', { class: 'ms-icon' }, '🔗'),
        h('span', { class: 'ms-url' }, 'stageone.ai/join/9b3f...a72c'),
        h('button', { class: ['ms-copy', copied.value ? 'copied' : ''], onClick: copy },
          copied.value ? '✓ Скопировано' : 'Копировать'),
      ]),
      h('div', { class: 'ms-channels' }, [
        h('span', '@candidate'),
        h('span', '✉ email'),
        h('span', '💬 Telegram'),
      ]),
      h('div', { class: 'ms-toast' }, [
        h('span', { class: 'ms-toast-dot' }),
        'Кандидат открыл ссылку',
      ]),
    ])
  },
}

const StageInterview = {
  setup() {
    return () => h('div', { class: 'mock-interview' }, [
      h('div', { class: 'mi-orb' }, [
        h('div', { class: 'mi-orb-inner' }),
        h('div', { class: 'mi-bars' }, [...Array(12)].map((_, i) =>
          h('span', { style: { animationDelay: `${i * 0.05}s` } })
        )),
      ]),
      h('div', { class: 'mi-bubbles' }, [
        h('div', { class: 'mi-bubble ai' }, 'Расскажите о последнем проекте'),
        h('div', { class: 'mi-bubble user' }, 'Я строил...'),
        h('div', { class: 'mi-bubble ai' }, 'Какую сложность преодолели?'),
      ]),
    ])
  },
}

const StageReport = {
  setup() {
    return () => h('div', { class: 'mock-report' }, [
      h('div', { class: 'mr-score' }, [
        h('strong', '8.4'),
        h('span', '/ 10'),
      ]),
      h('div', { class: 'mr-bars' }, ['React', 'Архитектура', 'Тестирование', 'Soft skills'].map((label, i) =>
        h('div', { class: 'mr-bar' }, [
          h('span', label),
          h('div', { class: 'mr-bar-track' },
            h('div', { class: 'mr-bar-fill', style: { '--w': [88, 76, 64, 82][i] + '%' } })
          ),
        ])
      )),
      h('div', { class: 'mr-tags' },
        ['Готов к офферу', 'Senior potential'].map((t) => h('span', t))
      ),
    ])
  },
}

const stages = [StageCreate, StageShare, StageInterview, StageReport]
</script>

<style scoped>
.pipe-bg {
  position: absolute; inset: 0;
  background:
    radial-gradient(50% 50% at 50% 50%, rgba(124,99,255,0.18), transparent 70%),
    linear-gradient(180deg, #0a0d28 0%, #161a3f 100%);
}

.pipe-layout {
  display: grid;
  gap: 48px;
}
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

.head { max-width: 760px; }
.kicker {
  display: inline-block; font-size: 12px; font-weight: 800;
  letter-spacing: 0.18em; text-transform: uppercase; color: #79e1ff;
  padding: 6px 12px; background: rgba(121, 225, 255, 0.12);
  border-radius: 999px; border: 1px solid rgba(121,225,255,0.3);
}
.head h2 { margin-top: 18px; font-size: clamp(34px, 4vw, 56px); line-height: 1.05; letter-spacing: -0.03em; color: #fff; }
.head p { margin-top: 12px; color: rgba(214,222,255,0.66); font-size: 17px; max-width: 580px; }

.track {
  position: relative;
  padding: 20px 24px;
  border-radius: 18px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  overflow: hidden;
}
.track::before {
  content: '';
  position: absolute;
  left: 24px; right: 24px;
  top: 50%;
  height: 2px;
  background: rgba(255,255,255,0.08);
  border-radius: 999px;
}
.track-progress {
  position: absolute;
  left: 24px;
  top: 50%;
  height: 2px;
  width: calc(var(--p) - 6%);
  background: linear-gradient(90deg, #79e1ff, #b837ff);
  border-radius: 999px;
  transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow: 0 0 12px rgba(184,55,255,0.6);
}
.step-numbers {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  z-index: 1;
}
.step-btn {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
  padding: 14px 16px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  background: rgba(8,10,30,0.6);
  color: rgba(214,222,255,0.55);
  font: inherit;
  cursor: pointer;
  transition: 0.25s;
  text-align: left;
}
.step-num {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: 16px;
  color: #79e1ff;
  letter-spacing: 0.05em;
}
.step-title { font-size: 14px; font-weight: 600; }
.step-btn.active {
  background: linear-gradient(135deg, rgba(124,99,255,0.3), rgba(184,55,255,0.2));
  color: #fff;
  border-color: rgba(124,99,255,0.5);
  box-shadow: 0 8px 24px -8px rgba(124,99,255,0.6);
}
.step-btn.done { color: rgba(255,255,255,0.7); }

.stage {
  min-height: 460px;
}
.stage-card {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 32px;
  padding: 32px;
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
  border: 1px solid rgba(255,255,255,0.08);
  align-items: center;
  opacity: 1;
  transform: none;
}

.fade-slide-enter-from { opacity: 0; transform: translateY(16px); }
.fade-slide-enter-active { transition: 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
.fade-slide-leave-to { opacity: 0; transform: translateY(-12px); }
.fade-slide-leave-active { transition: 0.3s; }

.stage-visual {
  border-radius: 18px;
  background: linear-gradient(180deg, #0c1130 0%, #1a1648 100%);
  padding: 28px;
  min-height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255,255,255,0.06);
}

.stage-step {
  display: inline-block;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #b837ff;
  background: rgba(184,55,255,0.16);
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 800;
}
.stage-info h3 {
  margin-top: 18px;
  font-size: clamp(28px, 3vw, 40px);
  color: #fff;
  letter-spacing: -0.02em;
  line-height: 1.1;
}
.stage-info p {
  margin-top: 14px;
  color: rgba(214,222,255,0.7);
  font-size: 16px;
  line-height: 1.55;
}
.stage-info ul {
  margin-top: 22px;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.stage-info li {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #e7ecff;
  font-size: 14px;
}
.stage-info li svg {
  color: #4ade80;
  background: rgba(74,222,128,0.16);
  padding: 4px;
  border-radius: 999px;
  flex-shrink: 0;
}

.stage-controls { margin-top: 24px; display: flex; gap: 10px; }
.ctl {
  width: 44px; height: 44px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.04);
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  transition: 0.2s;
}
.ctl:hover { background: rgba(255,255,255,0.1); }

/* Mock visuals */
:deep(.mock-form) { width: 100%; max-width: 320px; }
:deep(.mf-head) { color: #fff; font-weight: 700; margin-bottom: 16px; font-size: 14px; }
:deep(.mf-field) { display: block; margin-bottom: 12px; }
:deep(.mf-field span) { display: block; font-size: 11px; color: rgba(214,222,255,0.5); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; }
:deep(.mf-field input) { width: 100%; padding: 10px 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); color: #fff; font: inherit; font-size: 13px; }
:deep(.mf-cta) { margin-top: 8px; padding: 12px; border-radius: 10px; background: linear-gradient(135deg, #2c4dff, #b837ff); text-align: center; color: #fff; font-weight: 700; font-size: 13px; }

:deep(.mock-share) { width: 100%; }
:deep(.ms-link) { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); }
:deep(.ms-icon) { font-size: 18px; }
:deep(.ms-url) { flex: 1; font-family: 'SF Mono', monospace; color: #79e1ff; font-size: 13px; }
:deep(.ms-copy) { padding: 6px 12px; border: none; border-radius: 8px; background: linear-gradient(135deg, #2c4dff, #b837ff); color: #fff; font: inherit; font-size: 12px; font-weight: 700; cursor: pointer; }
:deep(.ms-copy.copied) { background: #4ade80; }
:deep(.ms-channels) { display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap; }
:deep(.ms-channels span) { padding: 6px 10px; background: rgba(255,255,255,0.04); border-radius: 999px; font-size: 12px; color: rgba(214,222,255,0.7); }
:deep(.ms-toast) { margin-top: 18px; display: inline-flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 10px; background: rgba(74,222,128,0.16); color: #4ade80; font-size: 12px; font-weight: 600; animation: slidein 0.6s ease; }
:deep(.ms-toast-dot) { width: 7px; height: 7px; border-radius: 999px; background: #4ade80; animation: pulse-rec 1.4s infinite; }
@keyframes slidein { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: none; } }

:deep(.mock-interview) { display: flex; align-items: center; gap: 22px; }
:deep(.mi-orb) { position: relative; width: 120px; height: 120px; flex-shrink: 0; }
:deep(.mi-orb-inner) { position: absolute; inset: 0; border-radius: 999px; background: radial-gradient(circle at 50% 30%, #b9a8ff, #4c46f5 50%, #0d1130); box-shadow: 0 12px 32px rgba(76,70,245,0.5); }
:deep(.mi-bars) { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 3px; }
:deep(.mi-bars span) { display: block; width: 3px; background: #fff; border-radius: 2px; height: 30%; animation: bar 0.8s ease-in-out infinite; }
:deep(.mi-bubbles) { display: flex; flex-direction: column; gap: 8px; }
:deep(.mi-bubble) { padding: 10px 14px; border-radius: 14px; font-size: 13px; max-width: 240px; }
:deep(.mi-bubble.ai) { background: rgba(255,255,255,0.06); color: #fff; align-self: flex-start; }
:deep(.mi-bubble.user) { background: linear-gradient(135deg, #2c4dff, #b837ff); color: #fff; align-self: flex-end; }

:deep(.mock-report) { width: 100%; }
:deep(.mr-score) { display: flex; align-items: baseline; gap: 8px; color: #fff; }
:deep(.mr-score strong) { font-size: 56px; font-family: 'Space Grotesk'; font-weight: 700; line-height: 1; background: linear-gradient(120deg, #79e1ff, #b837ff); -webkit-background-clip: text; background-clip: text; color: transparent; }
:deep(.mr-score span) { color: rgba(214,222,255,0.5); }
:deep(.mr-bars) { margin-top: 22px; display: flex; flex-direction: column; gap: 10px; }
:deep(.mr-bar) { display: grid; grid-template-columns: 110px 1fr; gap: 12px; align-items: center; font-size: 12px; color: rgba(214,222,255,0.7); }
:deep(.mr-bar-track) { height: 8px; background: rgba(255,255,255,0.06); border-radius: 999px; overflow: hidden; }
:deep(.mr-bar-fill) { height: 100%; width: var(--w); background: linear-gradient(90deg, #2c4dff, #b837ff); border-radius: 999px; animation: barfill 0.8s ease forwards; transform-origin: 0; }
@keyframes barfill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
:deep(.mr-tags) { display: flex; gap: 8px; margin-top: 18px; flex-wrap: wrap; }
:deep(.mr-tags span) { padding: 6px 12px; background: rgba(74,222,128,0.16); color: #4ade80; border-radius: 999px; font-size: 12px; font-weight: 700; }

@media (max-width: 1100px) {
  .step-numbers { grid-template-columns: repeat(2, 1fr); }
  .stage-card { grid-template-columns: 1fr; }
}
@media (max-width: 700px) {
  .step-numbers { grid-template-columns: 1fr 1fr; }
  .stage-card { padding: 22px; }
}
</style>
