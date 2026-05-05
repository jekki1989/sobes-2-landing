<template>
  <SectionScaffold id="hero" variant="hero">
    <template #bg>
      <div class="hero-aurora"></div>
      <div class="hero-grid"></div>
      <div class="hero-blob blob-a"></div>
      <div class="hero-blob blob-b"></div>
    </template>

    <div class="hero-grid-layout">
      <div class="hero-text reveal">
        <div class="badge">
          <span class="badge-dot"></span>
          <span>Live AI Interviewer · Beta</span>
        </div>

        <h1 class="hero-headline">
          <span class="line">Технические интервью</span>
          <span class="line gradient-text">на автопилоте</span>
        </h1>

        <p class="hero-sub">
          AI-аватар проводит интервью голосом, слушает кандидата и отдаёт вам
          готовый отчёт со скором и фидбеком. Вы — только смотрите финал.
        </p>

        <div class="cta-row">
          <MagneticButton variant="primary" large to="/register">
            Начать бесплатно
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </MagneticButton>
          <MagneticButton variant="ghost" large @click="scrollDemo">
            Посмотреть демо
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14m0 0-6-6m6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </MagneticButton>
        </div>

        <div class="proof">
          <div class="proof-counter">
            Уже сэкономлено
            <strong><AnimatedCounter :value="savedHours" /></strong>
            часов интервью
          </div>
          <div class="mode-switch">
            <button
              v-for="m in modes"
              :key="m.id"
              :class="['mode-btn', { active: activeMode === m.id }]"
              @click="activeMode = m.id"
            >
              <span :class="`mode-icon mode-${m.id}`"></span>
              {{ m.label }}
            </button>
          </div>
        </div>
      </div>

      <div class="hero-stage reveal">
        <div class="stage-frame">
          <div class="stage-status">
            <span class="rec-dot"></span>
            <span>{{ statusText }}</span>
            <span class="time-pill">{{ formattedTime }}</span>
          </div>

          <div class="avatar-stage" :class="`mode-${activeMode}`">
            <div class="avatar-orb">
              <div class="orb-pulse"></div>
              <div class="orb-pulse pulse-2"></div>
              <div class="orb-core">
                <svg viewBox="0 0 100 100" class="orb-svg">
                  <defs>
                    <radialGradient id="orbgrad" cx="50%" cy="40%">
                      <stop offset="0%" stop-color="#dee5ff"/>
                      <stop offset="55%" stop-color="#7c63ff"/>
                      <stop offset="100%" stop-color="#1a1448"/>
                    </radialGradient>
                  </defs>
                  <circle cx="50" cy="50" r="40" fill="url(#orbgrad)" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="0.4"/>
                </svg>
                <div class="waveform">
                  <span v-for="n in 24" :key="n" :style="{ animationDelay: `${n * 0.06}s` }"></span>
                </div>
              </div>
            </div>

            <div class="speech-bubble" :key="currentQuestion">
              <span class="bubble-tail"></span>
              <span class="typed">{{ typedText }}</span>
              <span class="caret" v-if="!doneTyping"></span>
            </div>
          </div>

          <div class="stage-controls">
            <button class="ctl-btn ctl-mic" :class="{ active: micActive }" @click="toggleMic">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="9" y="3" width="6" height="12" rx="3" stroke="currentColor" stroke-width="2"/>
                <path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              {{ micActive ? 'Слушаю...' : 'Попробовать голосом' }}
            </button>
            <button class="ctl-btn" @click="cycleQuestion">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Другой вопрос
            </button>
          </div>
        </div>

        <div class="stage-meta">
          <div class="meta-tile">
            <span class="meta-label">Голос</span>
            <span class="meta-value">ElevenLabs Flash 2.5</span>
          </div>
          <div class="meta-tile">
            <span class="meta-label">Latency</span>
            <span class="meta-value">&lt; 200 ms</span>
          </div>
          <div class="meta-tile">
            <span class="meta-label">Языки</span>
            <span class="meta-value">RU · EN · 27+</span>
          </div>
        </div>
      </div>
    </div>

    <div class="scroll-hint">
      <span>прокрутите</span>
      <div class="hint-line"></div>
    </div>
  </SectionScaffold>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import SectionScaffold from './shared/SectionScaffold.vue'
import MagneticButton from './shared/MagneticButton.vue'
import AnimatedCounter from './shared/AnimatedCounter.vue'

const modes = [
  { id: 'voice', label: 'Голос' },
  { id: 'text', label: 'Текст' },
  { id: 'video', label: 'Видео' },
]
const activeMode = ref('voice')
const savedHours = ref(48721)

const questions = [
  'Расскажите, как устроен event loop в JavaScript?',
  'Какой кейс из последнего проекта вам запомнился больше всего?',
  'Как бы вы спроектировали URL shortener на 1B запросов в день?',
  'Объясните разницу между GraphQL и REST с точки зрения backend.',
  'Как вы тестируете асинхронный код с side effects?',
]
const qIndex = ref(0)
const currentQuestion = computed(() => questions[qIndex.value])
const typedText = ref('')
const doneTyping = ref(false)
let typeTimer = 0

function typeOut(text) {
  typedText.value = ''
  doneTyping.value = false
  let i = 0
  clearInterval(typeTimer)
  typeTimer = setInterval(() => {
    typedText.value += text[i] || ''
    i++
    if (i >= text.length) {
      clearInterval(typeTimer)
      doneTyping.value = true
    }
  }, 28)
}

watch(currentQuestion, (q) => typeOut(q), { immediate: false })

function cycleQuestion() {
  qIndex.value = (qIndex.value + 1) % questions.length
}

const micActive = ref(false)
function toggleMic() {
  micActive.value = !micActive.value
  if (micActive.value) {
    setTimeout(() => { micActive.value = false }, 2400)
  }
}

const elapsed = ref(0)
let timer = 0
const formattedTime = computed(() => {
  const m = Math.floor(elapsed.value / 60).toString().padStart(2, '0')
  const s = (elapsed.value % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})
const statusText = computed(() => micActive.value ? 'Слушает кандидата' : 'Идёт интервью')

let counterTimer = 0

onMounted(() => {
  typeOut(currentQuestion.value)
  timer = setInterval(() => { elapsed.value++ }, 1000)
  counterTimer = setInterval(() => {
    savedHours.value += Math.floor(Math.random() * 3) + 1
  }, 4200)
})

onBeforeUnmount(() => {
  clearInterval(typeTimer)
  clearInterval(timer)
  clearInterval(counterTimer)
})

function scrollDemo() {
  const el = document.getElementById('demo')
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped>
.hero-aurora {
  position: absolute;
  inset: -10%;
  background:
    radial-gradient(60% 60% at 20% 30%, rgba(124, 99, 255, 0.36), transparent 60%),
    radial-gradient(40% 50% at 80% 20%, rgba(56, 189, 248, 0.28), transparent 65%),
    radial-gradient(50% 60% at 70% 90%, rgba(184, 55, 255, 0.26), transparent 65%);
  filter: blur(20px);
  animation: float 18s ease-in-out infinite;
}

.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse at 50% 50%, #000 30%, transparent 75%);
}

.hero-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.55;
  animation: float 24s ease-in-out infinite;
}
.blob-a { width: 380px; height: 380px; background: #4c46f5; top: 10%; left: -8%; }
.blob-b { width: 460px; height: 460px; background: #b837ff; bottom: -10%; right: -6%; animation-delay: -8s; }

@keyframes float {
  0%, 100% { transform: translate(0,0) scale(1); }
  50% { transform: translate(40px, -30px) scale(1.06); }
}

.hero-grid-layout {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 64px;
  align-items: center;
  width: 100%;
}

.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #cdd5ff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  backdrop-filter: blur(10px);
}

.badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #4ade80;
  box-shadow: 0 0 0 4px rgba(74, 222, 128, 0.18);
  animation: pulse 1.6s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 4px rgba(74, 222, 128, 0.18); }
  50% { box-shadow: 0 0 0 10px rgba(74, 222, 128, 0); }
}

.hero-headline {
  margin-top: 22px;
  font-size: clamp(48px, 6vw, 92px);
  line-height: 0.96;
  letter-spacing: -0.04em;
  color: #fff;
  font-weight: 700;
}
.hero-headline .line { display: block; }
.gradient-text {
  background: linear-gradient(120deg, #79e1ff 0%, #7c63ff 45%, #ff5bd5 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-sub {
  margin-top: 22px;
  max-width: 560px;
  font-size: 19px;
  line-height: 1.55;
  color: rgba(214, 222, 255, 0.78);
}

.cta-row {
  margin-top: 32px;
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.proof {
  margin-top: 38px;
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: center;
  justify-content: space-between;
}

.proof-counter {
  font-size: 14px;
  color: rgba(214, 222, 255, 0.75);
}
.proof-counter strong {
  color: #fff;
  font-weight: 800;
  font-size: 22px;
  margin: 0 6px;
  background: linear-gradient(120deg, #79e1ff, #b837ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.mode-switch {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border-radius: 14px;
  background: rgba(8, 10, 30, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.mode-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border: none;
  background: transparent;
  color: rgba(214, 222, 255, 0.66);
  font: inherit;
  font-weight: 700;
  font-size: 13px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
}
.mode-btn.active {
  background: linear-gradient(135deg, #2c4dff, #b837ff);
  color: #fff;
  box-shadow: 0 6px 16px -4px rgba(124, 99, 255, 0.6);
}
.mode-icon {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: currentColor;
}

.hero-stage {
  position: relative;
}

.stage-frame {
  position: relative;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);
  backdrop-filter: blur(20px);
  padding: 22px;
  overflow: hidden;
  box-shadow: 0 40px 80px -30px rgba(8, 10, 40, 0.6);
}

.stage-frame::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(124,99,255,0.2), transparent 50%);
  pointer-events: none;
}

.stage-status {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(8, 10, 30, 0.55);
  font-size: 12px;
  color: #cdd5ff;
  font-weight: 700;
}
.rec-dot {
  width: 8px; height: 8px; border-radius: 999px; background: #ff5b8a;
  box-shadow: 0 0 0 4px rgba(255, 91, 138, 0.2);
  animation: pulse-rec 1.4s ease-in-out infinite;
}
@keyframes pulse-rec {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.time-pill {
  margin-left: auto;
  padding: 2px 8px;
  background: rgba(255,255,255,0.06);
  border-radius: 6px;
  font-variant-numeric: tabular-nums;
}

.avatar-stage {
  margin-top: 18px;
  height: 320px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 22px;
  background:
    radial-gradient(circle at 50% 60%, rgba(124,99,255,0.18), transparent 70%),
    linear-gradient(180deg, #0c1130 0%, #1a1648 100%);
  overflow: hidden;
}

.avatar-orb {
  position: relative;
  width: 200px;
  height: 200px;
}
.orb-pulse {
  position: absolute;
  inset: -10px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(124,99,255,0.5), transparent 65%);
  animation: orbpulse 3s ease-in-out infinite;
}
.pulse-2 { animation-delay: -1.5s; opacity: 0.6; }
@keyframes orbpulse {
  0%, 100% { transform: scale(0.92); opacity: 0.5; }
  50% { transform: scale(1.18); opacity: 0.8; }
}
.orb-core {
  position: absolute;
  inset: 14px;
  border-radius: 999px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(76,70,245,0.4), inset 0 -20px 40px rgba(8,10,40,0.5);
}
.orb-svg { width: 100%; height: 100%; }

.waveform {
  position: absolute;
  bottom: 30%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 3px;
  height: 36px;
}
.waveform span {
  display: block;
  width: 3px;
  height: 10%;
  background: linear-gradient(180deg, #fff, #b9a8ff);
  border-radius: 2px;
  animation: wave 1.2s ease-in-out infinite;
}
@keyframes wave {
  0%, 100% { height: 10%; }
  50% { height: 90%; }
}

.speech-bubble {
  position: absolute;
  top: 24px;
  right: 24px;
  max-width: 56%;
  padding: 12px 16px;
  border-radius: 14px;
  background: rgba(255,255,255,0.94);
  color: #1a1648;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  box-shadow: 0 14px 32px rgba(8,10,40,0.4);
}
.bubble-tail {
  position: absolute;
  left: -8px;
  top: 18px;
  width: 14px; height: 14px;
  background: rgba(255,255,255,0.94);
  transform: rotate(45deg);
  border-radius: 2px;
}
.caret {
  display: inline-block;
  width: 2px; height: 1em;
  background: #1a1648;
  vertical-align: middle;
  margin-left: 2px;
  animation: blink 0.9s steps(2) infinite;
}
@keyframes blink {
  0%, 50% { opacity: 1; }
  50.01%, 100% { opacity: 0; }
}

.stage-controls {
  display: flex;
  gap: 10px;
  margin-top: 18px;
}
.ctl-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.04);
  color: #d6deff;
  font: inherit;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;
}
.ctl-btn:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.24);
}
.ctl-mic.active {
  background: linear-gradient(135deg, #2c4dff, #b837ff);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 0 0 4px rgba(124, 99, 255, 0.18);
}

.stage-meta {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.meta-tile {
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
}
.meta-label {
  display: block;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(214, 222, 255, 0.55);
  font-weight: 700;
}
.meta-value {
  display: block;
  margin-top: 4px;
  font-size: 14px;
  color: #fff;
  font-weight: 600;
}

.scroll-hint {
  position: absolute;
  left: 50%;
  bottom: 28px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: rgba(214, 222, 255, 0.5);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 700;
}
.hint-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(180deg, rgba(255,255,255,0.5), transparent);
  animation: hint 2s ease-in-out infinite;
}
@keyframes hint {
  0% { transform: translateY(-10px); opacity: 0.2; }
  50% { opacity: 1; }
  100% { transform: translateY(10px); opacity: 0.2; }
}

@media (max-width: 1100px) {
  .hero-grid-layout { grid-template-columns: 1fr; gap: 36px; }
}

@media (max-width: 700px) {
  .hero-headline { font-size: 44px; }
  .hero-sub { font-size: 16px; }
  .speech-bubble { max-width: 80%; right: 12px; }
  .stage-meta { grid-template-columns: 1fr 1fr; }
  .scroll-hint { display: none; }
}
</style>
