<template>
  <SectionScaffold id="demo" variant="demo">
    <template #bg>
      <div class="demo-bg"></div>
    </template>

    <div class="demo-layout">
      <div v-show="!hideTopInfo" class="head reveal">
        <span class="kicker">Live Demo</span>
        <h2>Попробуйте интервью прямо в браузере</h2>
        <p>Без регистрации, на ваших данных. Выберите вакансию — посмотрите, как AI ведёт сценарий.</p>
      </div>

      <div v-show="!hideTopInfo" class="presets reveal">
        <button
          v-for="p in presets"
          :key="p.id"
          :class="['preset', { active: activePreset === p.id }]"
          @click="setPreset(p.id)"
        >
          <span class="preset-icon" v-html="p.icon"></span>
          <span>
            <strong>{{ p.title }}</strong>
            <em>{{ p.stack }}</em>
          </span>
        </button>
      </div>

      <div v-show="!hideTopInfo" class="window reveal">
        <div class="window-bar">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
          <span class="window-url">stageone.ai/interview/{{ sessionToken }}</span>
          <span class="sandbox-tag">SANDBOX · данные не сохраняются</span>
        </div>

        <div class="window-body">
          <div class="left-col">
            <div class="ai-stage">
              <div class="ai-orb" :class="{ speaking: isSpeaking, listening: isListening }">
                <div class="orb-ring"></div>
                <div class="orb-ring r2"></div>
                <div class="orb-ring r3"></div>
                <div class="orb-center">
                  <div class="lipsync">
                    <span v-for="n in 16" :key="n" :style="{ animationDelay: `${n * 0.05}s` }"></span>
                  </div>
                </div>
              </div>
              <div class="ai-name">{{ activeAvatar.name }}</div>
              <div class="ai-status">
                <span class="status-pill" :class="status">{{ statusText }}</span>
              </div>
            </div>

            <div class="controls">
              <button class="play-btn" @click="togglePlay">
                <svg v-if="!playing" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5 3v18l16-9z"/>
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
                </svg>
                {{ playing ? 'Пауза' : 'Запустить' }}
              </button>
              <button class="mic-btn" :class="{ active: isListening }" @click="toggleMic">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="3" width="6" height="12" rx="3"/>
                  <path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke-linecap="round"/>
                </svg>
                {{ isListening ? 'Слушаю...' : 'Ответить голосом' }}
              </button>
            </div>
          </div>

          <div class="chat-col">
            <div class="chat-head">
              <div class="ch-info">
                <strong>Интервью · {{ activePresetData.title }}</strong>
                <em>{{ activePresetData.stack }}</em>
              </div>
              <span class="timer">{{ formattedTime }}</span>
            </div>

            <div ref="chatRef" class="chat-scroll">
              <transition-group name="msg" tag="div" class="msgs">
                <div
                  v-for="m in messages"
                  :key="m.id"
                  :class="['msg', `msg-${m.role}`]"
                >
                  <div class="msg-avatar" v-if="m.role === 'ai'">AI</div>
                  <div class="msg-bubble">
                    <div class="msg-text">{{ m.text }}</div>
                    <div class="msg-time">{{ m.time }}</div>
                  </div>
                </div>
              </transition-group>
              <div v-if="thinking" class="msg msg-ai">
                <div class="msg-avatar">AI</div>
                <div class="msg-bubble typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>

            <form class="composer" @submit.prevent="sendUser">
              <input
                v-model="userInput"
                type="text"
                placeholder="Напишите ответ или нажмите микрофон..."
                @keydown.enter.prevent="sendUser"
              />
              <button type="submit" :disabled="!userInput.trim()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"/>
                </svg>
              </button>
            </form>
          </div>
        </div>

        <transition name="report">
          <div v-if="reportShown" class="report-overlay">
            <div class="report">
              <button class="report-close" @click="reportShown = false">×</button>
              <div class="report-head">
                <div class="report-score">
                  <strong>{{ reportScore.toFixed(1) }}</strong>
                  <span>/ 10</span>
                </div>
                <div>
                  <h3>Демо-отчёт {{ activePresetData.title }}</h3>
                  <p>В реальной сессии этот отчёт прилетает HR в кабинет автоматически.</p>
                </div>
              </div>
              <div class="report-grid">
                <div class="report-block">
                  <span class="rb-label">Сильные стороны</span>
                  <ul>
                    <li v-for="(s, i) in reportPros" :key="i">{{ s }}</li>
                  </ul>
                </div>
                <div class="report-block">
                  <span class="rb-label">Зоны роста</span>
                  <ul>
                    <li v-for="(s, i) in reportCons" :key="i">{{ s }}</li>
                  </ul>
                </div>
              </div>
              <div class="report-meta">
                <span>5 вопросов · ~{{ formattedTime }}</span>
                <span>Скоринг: AI evaluator</span>
                <span>Mode: voice + text</span>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </SectionScaffold>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, nextTick } from 'vue'
import SectionScaffold from './shared/SectionScaffold.vue'

const hideTopInfo = true

const presets = [
  {
    id: 'fe',
    title: 'Frontend Middle',
    stack: 'React · TS · Next.js',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 16 4-4-4-4M6 8l-4 4 4 4M14.5 4l-5 16" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    avatar: { name: 'Светлана' },
    questions: [
      { ai: 'Привет! Расскажите, какие React-паттерны вы чаще всего используете в проде?', user: 'Использую composition + hooks, выношу логику в custom hooks, состояние держу в Zustand или Redux Toolkit.' },
      { ai: 'Отлично. Как вы оптимизируете перерисовки в больших списках?', user: 'react-window для виртуализации, memo + useMemo для тяжёлых вычислений, и часто разделяю context на тонкие.' },
      { ai: 'Хорошо. Как тестируете компоненты, которые делают API-вызовы?', user: 'MSW для перехвата сетевых запросов и react-testing-library. Юнит-тесты на хуки отдельно с renderHook.' },
      { ai: 'Последний вопрос: как вы организуете SSR с авторизацией в Next.js App Router?', user: 'Cookies через next/headers, проверка в layout.tsx, и redirect через next/navigation если токен невалидный.' },
    ],
    pros: ['Глубокое понимание hooks и performance', 'Корректная архитектура SSR с auth', 'Зрелый подход к тестированию'],
    cons: ['Не упомянул Suspense + RSC streaming', 'Стоит проработать кеширование на уровне fetch'],
    score: 8.4,
  },
  {
    id: 'be',
    title: 'Backend Senior',
    stack: 'Go · PostgreSQL · Kafka',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5M3 12a9 3 0 0 0 18 0"/></svg>',
    avatar: { name: 'Ирина' },
    questions: [
      { ai: 'Здравствуйте! Спроектируйте URL shortener на 1B запросов в день. С чего начнёте?', user: 'Read-heavy профиль → агрессивный кеш на CDN+Redis, генерация коротких ID через base62, шардинг PostgreSQL по hash(user_id).' },
      { ai: 'Как обеспечите отсутствие коллизий при генерации?', user: 'Pre-allocated диапазоны ID для каждого инстанса генератора, snowflake-подобный подход с timestamp + machine id.' },
      { ai: 'Где будет точка отказа в этой архитектуре?', user: 'Главная — БД при всплеске записи. Решение: write-batch через Kafka, eventual consistency для статистики.' },
      { ai: 'Как отдадите аналитику по кликам в реальном времени?', user: 'Kafka Streams агрегирует event-ы, в ClickHouse заливаем материализованные view, дашборд через WS.' },
    ],
    pros: ['Чёткая декомпозиция read/write путей', 'Правильный выбор Kafka для буфера', 'Хорошее понимание трейд-оффов'],
    cons: ['Не обсудил TTL и cleanup устаревших ссылок', 'Стоит проработать multi-region replication'],
    score: 9.1,
  },
  {
    id: 'de',
    title: 'Data Engineer',
    stack: 'Python · Airflow · Spark',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18M7 14l4-4 4 4 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    avatar: { name: 'Светлана' },
    questions: [
      { ai: 'Расскажите про последний пайплайн, который вы строили end-to-end?', user: 'CDC из Postgres через Debezium → Kafka → Spark Structured Streaming → Iceberg на S3. SLA на свежесть 5 минут.' },
      { ai: 'Как обеспечиваете идемпотентность при перезапуске задач?', user: 'Уникальные ключи событий, MERGE INTO в Iceberg, Airflow с execution_date в partition path.' },
      { ai: 'Что делаете при разборе late-arriving data?', user: 'Watermark + allowed lateness в Spark, переписывание партиций при необходимости через time-travel в Iceberg.' },
      { ai: 'Как валидируете качество данных?', user: 'Great Expectations в каждом DAG-step, отдельный канал в Slack на алерты, метрики в Grafana.' },
    ],
    pros: ['Современный стек: Iceberg + CDC', 'Зрелый подход к late data', 'Метрики и алертинг встроены в pipeline'],
    cons: ['Не озвучил retention policy', 'Стоит затронуть тестирование Spark джобов локально'],
    score: 8.7,
  },
]

const activePreset = ref('fe')
const activePresetData = computed(() => presets.find((p) => p.id === activePreset.value))
const activeAvatar = computed(() => activePresetData.value.avatar)
const sessionToken = computed(() => activePresetData.value.id + '-demo-' + Math.random().toString(36).slice(2, 8))

const messages = ref([])
const userInput = ref('')
const playing = ref(false)
const isSpeaking = ref(false)
const isListening = ref(false)
const thinking = ref(false)
const elapsed = ref(0)
const chatRef = ref(null)
const reportShown = ref(false)
const reportScore = ref(0)
const reportPros = ref([])
const reportCons = ref([])

let msgId = 0
let elapsedTimer = 0

const status = computed(() => {
  if (isSpeaking.value) return 'speaking'
  if (isListening.value) return 'listening'
  if (thinking.value) return 'thinking'
  return 'idle'
})
const statusText = computed(() => ({
  speaking: 'Говорит',
  listening: 'Слушает',
  thinking: 'Думает',
  idle: 'Готов',
}[status.value]))

const formattedTime = computed(() => {
  const m = Math.floor(elapsed.value / 60).toString().padStart(2, '0')
  const s = (elapsed.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})

function nowTime() {
  const d = new Date()
  return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0')
}

async function pushMsg(role, text) {
  messages.value.push({ id: ++msgId, role, text, time: nowTime() })
  await nextTick()
  if (chatRef.value) chatRef.value.scrollTop = chatRef.value.scrollHeight
}

async function setPreset(id) {
  activePreset.value = id
  stopPlay()
  messages.value = []
  reportShown.value = false
  elapsed.value = 0
  await pushMsg('ai', presets.find((p) => p.id === id).questions[0].ai)
}

setPreset('fe')

async function playStep(idx) {
  const data = activePresetData.value
  if (idx >= data.questions.length) {
    finishDemo()
    return
  }
  const step = data.questions[idx]
  if (idx > 0) {
    isSpeaking.value = true
    await pushMsg('ai', step.ai)
    await wait(1500)
    isSpeaking.value = false
  }
  thinking.value = true
  await wait(1100)
  thinking.value = false
  await pushMsg('user', step.user)
  await wait(900)
  if (playing.value) playStep(idx + 1)
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function togglePlay() {
  if (playing.value) {
    stopPlay()
  } else {
    playing.value = true
    elapsedTimer = setInterval(() => { elapsed.value++ }, 1000)
    playStep(messages.value.filter((m) => m.role === 'ai').length === 1 && messages.value.length === 1 ? 0 : messages.value.length)
  }
}

function stopPlay() {
  playing.value = false
  isSpeaking.value = false
  thinking.value = false
  clearInterval(elapsedTimer)
}

function finishDemo() {
  stopPlay()
  const d = activePresetData.value
  reportScore.value = d.score
  reportPros.value = d.pros
  reportCons.value = d.cons
  reportShown.value = true
}

async function sendUser() {
  const text = userInput.value.trim()
  if (!text) return
  userInput.value = ''
  await pushMsg('user', text)
  thinking.value = true
  await wait(800)
  thinking.value = false
  await pushMsg('ai', 'Отличный ответ. Уточните, как вы валидируете edge cases в этом сценарии?')
}

function toggleMic() {
  isListening.value = !isListening.value
  if (isListening.value) {
    setTimeout(() => {
      isListening.value = false
      sendUser({ preventDefault() {} })
    }, 1800)
    userInput.value = 'Тестовый ответ через голос'
  }
}

onBeforeUnmount(() => {
  clearInterval(elapsedTimer)
})
</script>

<style scoped>
.demo-bg {
  position: absolute; inset: 0;
  background:
    radial-gradient(60% 50% at 80% 20%, color-mix(in srgb, var(--so-brand) 12%, transparent), transparent 60%),
    radial-gradient(50% 50% at 0% 100%, color-mix(in srgb, var(--so-brand) 10%, transparent), transparent 60%),
    linear-gradient(180deg, var(--so-surface) 0%, var(--so-surface) 100%);
}

.demo-layout { display: grid; gap: 28px; }

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
.head h2 {
  margin-top: 18px; font-size: clamp(34px, 4vw, 56px);
  line-height: 1.05; letter-spacing: -0.03em; color: var(--so-surface);
}
.head p { margin-top: 12px; color: var(--so-mute); font-size: 17px; }

.presets {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.preset {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 16px;
  background: var(--so-surface);
  border: 1px solid var(--so-surface);
  color: var(--so-mute);
  font: inherit;
  cursor: pointer;
  transition: 0.25s;
}
.preset:hover {
  background: var(--so-surface);
  border-color: var(--so-surface);
}
.preset.active {
  background: linear-gradient(135deg, color-mix(in srgb, var(--so-brand) 12%, transparent), color-mix(in srgb, var(--so-brand) 12%, transparent));
  border-color: color-mix(in srgb, var(--so-brand) 12%, transparent);
  box-shadow: 0 8px 28px -8px color-mix(in srgb, var(--so-brand) 12%, transparent);
}
.preset-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px; height: 38px;
  border-radius: 10px;
  background: var(--so-surface);
  color: var(--so-surface);
}
.preset-icon svg { width: 18px; height: 18px; }
.preset strong { display: block; color: var(--so-surface); font-size: 14px; }
.preset em { display: block; font-style: normal; color: var(--so-mute); font-size: 12px; margin-top: 2px; }

.window {
  border-radius: 22px;
  background: linear-gradient(180deg, var(--so-surface) 0%, var(--so-surface) 100%);
  border: 1px solid var(--so-surface);
  overflow: hidden;
  position: relative;
  box-shadow: 0 40px 80px -20px transparent;
}

.window-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  background: transparent;
  border-bottom: 1px solid var(--so-surface);
  font-size: 12px;
  color: var(--so-mute);
}
.window-bar .dot {
  width: 11px; height: 11px; border-radius: 999px;
}
.window-bar .red { background: var(--so-line); }
.window-bar .yellow { background: var(--so-brand); }
.window-bar .green { background: var(--so-brand); }
.window-url {
  margin-left: 16px;
  padding: 4px 12px;
  border-radius: 8px;
  background: var(--so-surface);
  font-family: 'SF Mono', monospace;
}
.sandbox-tag {
  margin-left: auto;
  padding: 4px 10px;
  background: color-mix(in srgb, var(--so-brand) 10%, transparent);
  color: var(--so-brand);
  border-radius: 999px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.window-body {
  display: grid;
  grid-template-columns: 360px 1fr;
  min-height: 480px;
}

.left-col {
  padding: 24px;
  border-right: 1px solid var(--so-surface);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.ai-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 26px;
}

.ai-orb {
  position: relative;
  width: 200px;
  height: 200px;
}
.orb-ring {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--so-brand) 12%, transparent);
  animation: ringpulse 3s ease-in-out infinite;
}
.orb-ring.r2 { animation-delay: -1s; }
.orb-ring.r3 { animation-delay: -2s; }
@keyframes ringpulse {
  0% { transform: scale(0.85); opacity: 1; }
  100% { transform: scale(1.4); opacity: 0; }
}
.orb-center {
  position: absolute;
  inset: 22px;
  border-radius: 999px;
  background:
    radial-gradient(circle at 50% 30%, var(--so-brand) 0%, var(--so-brand) 45%, var(--so-surface) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 -20px 40px transparent, 0 16px 40px color-mix(in srgb, var(--so-brand) 12%, transparent);
}
.lipsync {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 30px;
}
.lipsync span {
  width: 4px;
  background: var(--so-surface);
  border-radius: 2px;
  height: 20%;
  opacity: 0.6;
  transition: 0.3s;
}
.ai-orb.speaking .lipsync span { animation: bar 0.8s ease-in-out infinite; opacity: 1; }
.ai-orb.listening .orb-center { box-shadow: inset 0 -20px 40px transparent, 0 16px 40px var(--so-brand); }
@keyframes bar {
  0%, 100% { height: 15%; }
  50% { height: 90%; }
}

.ai-name {
  margin-top: 18px;
  font-size: 16px;
  color: var(--so-surface);
  font-weight: 700;
}
.ai-status { margin-top: 8px; }
.status-pill {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: var(--so-surface);
  color: var(--so-mute);
}
.status-pill.speaking { background: color-mix(in srgb, var(--so-brand) 12%, transparent); color: var(--so-brand); }
.status-pill.listening { background: color-mix(in srgb, var(--so-brand) 10%, transparent); color: var(--so-brand); }
.status-pill.thinking { background: color-mix(in srgb, var(--so-brand) 10%, transparent); color: var(--so-brand); }

.controls {
  display: flex;
  gap: 8px;
  margin-top: 22px;
}
.play-btn, .mic-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--so-surface);
  background: var(--so-surface);
  color: var(--so-mute);
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}
.play-btn:hover, .mic-btn:hover { background: var(--so-surface); }
.play-btn { background: var(--so-brand); border-color: transparent; color: var(--so-surface); }
.mic-btn.active {
  background: var(--so-brand);
  color: var(--so-surface);
  border-color: transparent;
}

.chat-col {
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, var(--so-surface) 0%, var(--so-surface) 100%);
}

.chat-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 22px;
  border-bottom: 1px solid var(--so-surface);
}
.ch-info strong { color: var(--so-surface); font-size: 14px; }
.ch-info em { display: block; font-style: normal; color: var(--so-mute); font-size: 12px; margin-top: 2px; }
.timer {
  font-family: inherit;
  font-variant-numeric: tabular-nums;
  color: var(--so-brand);
  font-size: 14px;
  font-weight: 700;
  padding: 4px 10px;
  background: color-mix(in srgb, var(--so-brand) 10%, transparent);
  border-radius: 8px;
}

.chat-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 22px;
  max-height: 340px;
}
.msgs { display: flex; flex-direction: column; gap: 12px; }

.msg { display: flex; gap: 10px; max-width: 90%; }
.msg-ai { align-self: flex-start; }
.msg-user { align-self: flex-end; flex-direction: row-reverse; }
.msg-avatar {
  width: 32px; height: 32px; border-radius: 999px;
  background: var(--so-brand);
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 800; color: var(--so-surface); flex-shrink: 0;
}
.msg-bubble {
  padding: 12px 16px;
  border-radius: 16px;
  background: var(--so-surface);
  color: var(--so-ink);
  font-size: 14px;
  line-height: 1.5;
}
.msg-user .msg-bubble {
  background: var(--so-brand);
  color: var(--so-surface);
}
.msg-time {
  margin-top: 6px;
  font-size: 10px;
  color: var(--so-mute);
  font-weight: 700;
}
.msg-bubble.typing {
  display: inline-flex;
  gap: 5px;
  padding: 14px 18px;
}
.typing span {
  width: 7px; height: 7px; border-radius: 999px; background: var(--so-surface);
  animation: dot 1.2s ease-in-out infinite;
}
.typing span:nth-child(2) { animation-delay: 0.2s; }
.typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes dot {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

.msg-enter-from { opacity: 0; transform: translateY(8px); }
.msg-enter-active { transition: 0.3s; }

.composer {
  display: flex;
  padding: 14px 18px;
  border-top: 1px solid var(--so-surface);
  gap: 10px;
}
.composer input {
  flex: 1;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid var(--so-surface);
  background: var(--so-surface);
  color: var(--so-surface);
  font: inherit;
  font-size: 14px;
  outline: none;
  transition: 0.2s;
}
.composer input:focus { border-color: color-mix(in srgb, var(--so-brand) 12%, transparent); background: var(--so-surface); }
.composer button {
  width: 44px; height: 44px;
  border-radius: 12px;
  border: none;
  background: var(--so-brand);
  color: var(--so-surface);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.composer button:disabled { opacity: 0.4; cursor: not-allowed; }

.report-overlay {
  position: absolute;
  inset: 0;
  background: transparent;
  backdrop-filter: blur(14px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  z-index: 5;
}
.report-enter-from { opacity: 0; }
.report-enter-active { transition: 0.4s; }
.report-enter-to { opacity: 1; }

.report {
  position: relative;
  width: 100%;
  max-width: 640px;
  background: linear-gradient(180deg, var(--so-surface) 0%, var(--so-surface) 100%);
  border: 1px solid color-mix(in srgb, var(--so-brand) 12%, transparent);
  border-radius: 22px;
  padding: 32px;
  box-shadow: 0 40px 80px transparent;
}
.report-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: none;
  background: var(--so-surface);
  color: var(--so-surface);
  font-size: 22px;
  cursor: pointer;
}
.report-head {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 22px;
  align-items: center;
}
.report-score {
  width: 96px; height: 96px;
  border-radius: 24px;
  background: var(--so-brand);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--so-surface);
}
.report-score strong {
  font-size: 36px;
  font-family: inherit;
  font-weight: 700;
  line-height: 1;
}
.report-score span { font-size: 12px; opacity: 0.7; margin-top: 4px; }

.report-head h3 { color: var(--so-surface); font-size: 22px; }
.report-head p { color: var(--so-mute); margin-top: 6px; font-size: 14px; }

.report-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 24px;
}
.report-block {
  padding: 18px;
  border-radius: 16px;
  background: var(--so-surface);
  border: 1px solid var(--so-surface);
}
.rb-label {
  display: block;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--so-mute);
  font-weight: 800;
  margin-bottom: 12px;
}
.report-block ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--so-ink);
  font-size: 14px;
}
.report-block li {
  position: relative;
  padding-left: 18px;
}
.report-block li::before {
  content: '';
  position: absolute;
  left: 0; top: 8px;
  width: 6px; height: 6px;
  border-radius: 999px;
  background: var(--so-brand);
}

.report-meta {
  margin-top: 22px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 22px;
  font-size: 12px;
  color: var(--so-mute);
}

@media (max-width: 1100px) {
  .window-body { grid-template-columns: 1fr; }
  .left-col { border-right: none; border-bottom: 1px solid var(--so-surface); }
}
@media (max-width: 700px) {
  .window-bar { font-size: 10px; }
  .sandbox-tag { display: none; }
  .report-grid { grid-template-columns: 1fr; }
  .report-head { grid-template-columns: 1fr; text-align: center; }
}

/* Palette pass */
.demo-bg {
  background: transparent;
}

.head h2 {
  color: var(--so-ink);
  font-size: clamp(36px, 4.5vw, 56px);
}

.head p,
.preset em,
.window-bar,
.ch-info em,
.msg-time,
.report-head p,
.report-meta {
  color: var(--so-mute);
}

.kicker {
  color: var(--so-mute);
  padding: 0;
  background: transparent;
  border: 0;
  border-radius: 0;
  letter-spacing: 0.12em;
}

.preset,
.window,
.window-bar,
.chat-head,
.chat-scroll,
.report,
.report-block,
.composer input {
  background: var(--so-surface);
  border-color: var(--so-line);
  box-shadow: none;
}

.window,
.report {
  border-radius: 8px;
}

.preset {
  color: var(--so-ink);
}

.preset:hover,
.preset.active {
  background: var(--so-surface);
  border-color: var(--so-brand);
  box-shadow: none;
}

.preset-icon,
.msg-avatar {
  background: var(--so-surface);
  color: var(--so-brand);
  border: 1px solid var(--so-line);
}

.preset strong,
.ai-name,
.ch-info strong,
.report-head h3,
.report-block ul,
.msg-bubble,
.composer input {
  color: var(--so-ink);
}

.window-body {
  min-height: 480px;
}

.left-col,
.chat-head,
.composer,
.window-bar {
  border-color: var(--so-line);
}

.chat-col,
.stage,
.ai-stage {
  background: var(--so-surface);
}

.ai-orb {
  color: var(--so-brand);
}

.orb-ring {
  border-color: color-mix(in srgb, var(--so-brand) 26%, transparent);
}

.orb-center {
  background: var(--so-surface-2);
  border: 1px solid var(--so-line);
  box-shadow: none;
}

.lipsync span,
.typing span {
  background: var(--so-brand);
}

.ai-orb.listening .orb-center {
  box-shadow: none;
}

.status-pill,
.status-pill.speaking,
.status-pill.listening,
.status-pill.thinking,
.sandbox-tag,
.timer {
  background: var(--so-surface);
  border: 1px solid var(--so-line);
  color: var(--so-mute);
}

.play-btn,
.composer button,
.report-score,
.report-close {
  background: var(--so-brand);
  border-color: var(--so-brand);
  color: var(--so-surface);
  box-shadow: none;
}

.mic-btn {
  background: var(--so-surface);
  border-color: var(--so-line);
  color: var(--so-ink);
}

.mic-btn.active,
.mic-btn:hover {
  background: var(--so-surface);
  border-color: var(--so-brand);
  color: var(--so-brand);
}

.msg-bubble {
  background: var(--so-surface-2);
}

.msg-user .msg-bubble {
  background: var(--so-brand);
  color: var(--so-surface);
}

.composer input:focus {
  border-color: var(--so-brand);
  background: var(--so-surface);
}

.report-overlay {
  background: color-mix(in srgb, var(--so-surface) 82%, transparent);
}

.rb-label {
  color: var(--so-brand);
  background: transparent;
}

.report-block li::before {
  background: var(--so-brand);
}

.window-bar .red,
.window-bar .yellow,
.window-bar .green {
  background: var(--so-line);
}
</style>
