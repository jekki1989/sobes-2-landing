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
        <transition name="fade-slide">
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
    const visible = ref(0)
    const typing = ref(false)
    const messages = [
      { role: 'ai', text: 'Здравствуйте! Расскажите про последний проект.' },
      { role: 'user', text: 'Финтех-платформа: Go, PostgreSQL, React.' },
      { role: 'ai', text: 'Какой объём трафика выдерживала?' },
      { role: 'user', text: '~12K RPS, p99 латентность 80 мс.' },
      { role: 'ai', text: 'Как организовали мониторинг и алерты?' },
      { role: 'user', text: 'Prometheus + Grafana, алерты в Slack on-call.' },
    ]
    let timer = 0

    function step() {
      if (visible.value >= messages.length) {
        timer = window.setTimeout(() => {
          visible.value = 0
          typing.value = false
          timer = window.setTimeout(step, 600)
        }, 2600)
        return
      }
      typing.value = true
      timer = window.setTimeout(() => {
        typing.value = false
        visible.value++
        timer = window.setTimeout(step, 1100)
      }, 700)
    }

    onMounted(() => {
      timer = window.setTimeout(step, 400)
    })
    onBeforeUnmount(() => {
      window.clearTimeout(timer)
    })

    return () => h('div', { class: 'mock-interview' }, [
      h('div', { class: 'mi-chat' }, [
        ...messages.slice(0, visible.value).map((m, i) =>
          h('div', { class: ['mi-bubble', m.role], key: i }, m.text)
        ),
        typing.value && visible.value < messages.length
          ? h('div', { class: ['mi-bubble', 'mi-typing', messages[visible.value].role], key: 'typing' }, [
              h('span'), h('span'), h('span'),
            ])
          : null,
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
    radial-gradient(50% 50% at 50% 50%, color-mix(in srgb, var(--so-brand) 12%, transparent), transparent 70%),
    linear-gradient(180deg, var(--so-surface) 0%, var(--so-surface) 100%);
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
  letter-spacing: 0.18em; text-transform: uppercase; color: var(--so-brand);
  padding: 6px 12px; background: color-mix(in srgb, var(--so-brand) 10%, transparent);
  border-radius: 999px; border: 1px solid color-mix(in srgb, var(--so-brand) 10%, transparent);
}
.head h2 { margin-top: 18px; font-size: clamp(34px, 4vw, 56px); line-height: 1.05; letter-spacing: -0.03em; color: var(--so-surface); }
.head p { margin-top: 12px; color: var(--so-mute); font-size: 17px; max-width: 580px; }

.track {
  position: relative;
  padding: 20px 24px;
  border-radius: 18px;
  background: var(--so-surface);
  border: 1px solid var(--so-surface);
  overflow: hidden;
}
.track::before {
  content: '';
  position: absolute;
  left: 24px; right: 24px;
  top: 50%;
  height: 2px;
  background: var(--so-surface);
  border-radius: 999px;
}
.track-progress {
  position: absolute;
  left: 24px;
  top: 50%;
  height: 2px;
  width: calc(var(--p) - 6%);
  background: var(--so-brand);
  border-radius: 999px;
  transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow: 0 0 12px color-mix(in srgb, var(--so-brand) 12%, transparent);
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
  border: 1px solid var(--so-surface);
  border-radius: 14px;
  background: transparent;
  color: var(--so-mute);
  font: inherit;
  cursor: pointer;
  transition: 0.25s;
  text-align: left;
}
.step-num {
  font-family: inherit;
  font-weight: 800;
  font-size: 16px;
  color: var(--so-brand);
  letter-spacing: 0.05em;
}
.step-title { font-size: 14px; font-weight: 600; }
.step-btn.active {
  background: linear-gradient(135deg, color-mix(in srgb, var(--so-brand) 12%, transparent), color-mix(in srgb, var(--so-brand) 12%, transparent));
  color: var(--so-surface);
  border-color: color-mix(in srgb, var(--so-brand) 12%, transparent);
  box-shadow: 0 8px 24px -8px color-mix(in srgb, var(--so-brand) 12%, transparent);
}
.step-btn.done { color: var(--so-surface); }

.stage {
  position: relative;
  min-height: 460px;
}
.stage-card {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 32px;
  padding: 32px;
  align-items: start;
  opacity: 1;
  transform: none;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.18s ease;
}
.fade-slide-enter-from { opacity: 0; }
.fade-slide-leave-to { opacity: 0; }
.fade-slide-leave-active {
  position: absolute;
  inset: 0;
}

.stage-visual {
  padding: 28px;
  min-height: 360px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.stage-step {
  display: inline-block;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--so-brand);
  background: color-mix(in srgb, var(--so-brand) 12%, transparent);
  padding: 6px 12px;
  border-radius: 999px;
  font-weight: 800;
}
.stage-info h3 {
  margin-top: 18px;
  letter-spacing: -0.02em;
  line-height: 1.1;
}
.stage-info p {
  margin-top: 14px;
  color: var(--so-mute);
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
  color: var(--so-ink);
  font-size: 14px;
}
.stage-info li svg {
  color: var(--so-brand);
  background: color-mix(in srgb, var(--so-brand) 10%, transparent);
  padding: 4px;
  border-radius: 999px;
  flex-shrink: 0;
}

.stage-controls { margin-top: 24px; display: flex; gap: 10px; }
.ctl {
  width: 44px; height: 44px;
  border-radius: 12px;
  border: 1px solid var(--so-surface);
  background: var(--so-surface);
  color: var(--so-surface);
  font-size: 18px;
  cursor: pointer;
  transition: 0.2s;
}
.ctl:hover { background: var(--so-surface); }

/* Mock visuals */
:deep(.mock-form) { width: 100%; max-width: 100%; }
:deep(.mf-head) { color: var(--so-surface); font-weight: 700; margin-bottom: 16px; font-size: 14px; }
:deep(.mf-field) { display: block; margin-bottom: 12px; }
:deep(.mf-field span) { display: block; font-size: 11px; color: var(--so-mute); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; }
:deep(.mf-field input) { width: 100%; padding: 10px 12px; border-radius: 10px; border: 1px solid var(--so-surface); background: var(--so-surface); color: var(--so-surface); font: inherit; font-size: 13px; }
:deep(.mf-cta) { margin-top: 8px; padding: 12px; border-radius: 10px; background: var(--so-brand); text-align: center; color: var(--so-surface); font-weight: 700; font-size: 13px; }

:deep(.mock-share) { width: 100%; }
:deep(.ms-link) { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-radius: 12px; background: var(--so-surface); border: 1px solid var(--so-surface); }
:deep(.ms-icon) { font-size: 18px; }
:deep(.ms-url) { flex: 1; font-family: 'SF Mono', monospace; color: var(--so-brand); font-size: 13px; }
:deep(.ms-copy) { padding: 6px 12px; border: none; border-radius: 8px; background: var(--so-brand); color: var(--so-surface); font: inherit; font-size: 12px; font-weight: 700; cursor: pointer; }
:deep(.ms-copy.copied) { background: var(--so-brand); }
:deep(.ms-channels) { display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap; }
:deep(.ms-channels span) { padding: 6px 10px; background: var(--so-surface); border-radius: 999px; font-size: 12px; color: var(--so-mute); }
:deep(.ms-toast) { margin-top: 18px; display: inline-flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 10px; background: color-mix(in srgb, var(--so-brand) 10%, transparent); color: var(--so-brand); font-size: 12px; font-weight: 600; animation: slidein 0.6s ease; }
:deep(.ms-toast-dot) { width: 7px; height: 7px; border-radius: 999px; background: var(--so-brand); animation: pulse-rec 1.4s infinite; }
@keyframes slidein { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: none; } }

:deep(.mock-interview) { width: 100%; display: flex; align-items: stretch; }
:deep(.mi-chat) { display: flex; flex-direction: column; gap: 10px; width: 100%; min-height: 280px; }
:deep(.mi-bubble) {
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 13px;
  line-height: 1.45;
  max-width: 78%;
  animation: mi-bubble-in 0.32s var(--so-ease) both;
}
:deep(.mi-bubble.ai) { align-self: flex-start; }
:deep(.mi-bubble.user) { align-self: flex-end; }
:deep(.mi-typing) {
  display: inline-flex;
  gap: 5px;
  padding: 12px 14px;
  align-items: center;
}
:deep(.mi-typing span) {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: currentColor;
  opacity: 0.5;
  animation: mi-typing 1.1s ease-in-out infinite;
}
:deep(.mi-typing span:nth-child(2)) { animation-delay: 0.15s; }
:deep(.mi-typing span:nth-child(3)) { animation-delay: 0.3s; }
@keyframes mi-bubble-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes mi-typing {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.35; }
  40% { transform: scale(1); opacity: 1; }
}

:deep(.mock-report) { width: 100%; }
:deep(.mr-score) { display: flex; align-items: baseline; gap: 8px; color: var(--so-surface); }
:deep(.mr-score strong) { font-size: 56px; font-family: inherit; font-weight: 700; line-height: 1; background: var(--so-brand); -webkit-background-clip: text; background-clip: text; color: transparent; }
:deep(.mr-score span) { color: var(--so-mute); }
:deep(.mr-bars) { margin-top: 22px; display: flex; flex-direction: column; gap: 10px; }
:deep(.mr-bar) { display: grid; grid-template-columns: 110px 1fr; gap: 12px; align-items: center; font-size: 12px; color: var(--so-mute); }
:deep(.mr-bar-track) { height: 8px; background: var(--so-surface); border-radius: 999px; overflow: hidden; }
:deep(.mr-bar-fill) { height: 100%; width: var(--w); background: var(--so-brand); border-radius: 999px; animation: barfill 0.8s ease forwards; transform-origin: 0; }
@keyframes barfill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
:deep(.mr-tags) { display: flex; gap: 8px; margin-top: 18px; flex-wrap: wrap; }
:deep(.mr-tags span) { padding: 6px 12px; background: color-mix(in srgb, var(--so-brand) 10%, transparent); color: var(--so-brand); border-radius: 999px; font-size: 12px; font-weight: 700; }

@media (max-width: 1100px) {
  .step-numbers { grid-template-columns: repeat(2, 1fr); }
  .stage-card { grid-template-columns: 1fr; }
}
@media (max-width: 700px) {
  .step-numbers { grid-template-columns: 1fr 1fr; }
  .stage-card { padding: 22px; }
}

/* Palette pass */
.pipe-bg {
  background: transparent;
}

.head h2 {
  color: var(--so-ink);
}

.head p,
.step-btn,
.stage-info p,
.stage-info li {
  color: var(--so-mute);
}

.kicker,
.stage-step {
  color: var(--so-mute);
  padding: 0;
  background: transparent;
  border: 0;
  border-radius: 0;
  letter-spacing: 0.12em;
}

.track,
.stage-card,
.stage-visual {
  background: var(--so-surface);
  border: 1px solid var(--so-line);
  border-radius: var(--so-radius-md);
  box-shadow: var(--so-shadow-sm);
}

.stage-visual {
  background: var(--so-surface-2);
  box-shadow: none;
}

.track::before {
  background: var(--so-line);
}

.track-progress {
  background: var(--so-brand);
  box-shadow: none;
}

.step-btn,
.ctl {
  background: var(--so-surface);
  border-color: var(--so-line);
  color: var(--so-ink);
  border-radius: var(--so-radius-sm);
  transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease, transform 0.2s var(--so-ease);
}

.step-btn:hover {
  border-color: color-mix(in srgb, var(--so-brand) 30%, var(--so-line));
  transform: translateY(-1px);
}

.step-btn.active {
  background: color-mix(in srgb, var(--so-brand) 6%, var(--so-surface));
  border-color: var(--so-brand);
  color: var(--so-brand);
}

.step-btn.done,
.step-num,
.stage-info li svg {
  color: var(--so-brand);
}

.stage-info h3 {
  color: var(--so-ink);
}

.stage-info li svg {
  background: var(--so-surface);
}

.ctl:hover {
  border-color: var(--so-brand);
  color: var(--so-brand);
  transform: translateY(-1px);
}

:deep(.mf-head),
:deep(.mr-score),
:deep(.mr-score strong) {
  color: var(--so-ink);
  background: none;
}

:deep(.mf-field span),
:deep(.mr-score span),
:deep(.mr-bar),
:deep(.ms-channels span) {
  color: var(--so-mute);
}

:deep(.mf-field input),
:deep(.ms-link),
:deep(.mi-bubble.ai),
:deep(.mr-bar-track) {
  background: var(--so-surface);
  border: 1px solid var(--so-line);
  color: var(--so-ink);
}

:deep(.mf-cta),
:deep(.ms-copy),
:deep(.mi-bubble.user),
:deep(.mr-bar-fill) {
  background: var(--so-brand);
  color: var(--so-surface);
}

:deep(.ms-url),
:deep(.ms-toast),
:deep(.mr-tags span) {
  color: var(--so-brand);
}

:deep(.ms-toast),
:deep(.mr-tags span) {
  background: var(--so-surface);
  border: 1px solid var(--so-line);
}

:deep(.ms-toast-dot) {
  background: var(--so-brand);
  box-shadow: none;
}

:deep(.mi-typing) {
  background: var(--so-surface-2);
  color: var(--so-mute);
  border: 1px solid var(--so-line);
}

:deep(.mi-typing.user) {
  background: var(--so-brand);
  color: var(--so-surface);
  border-color: var(--so-brand);
}

:deep(.mi-bubble) {
  color: var(--so-ink);
}
</style>
