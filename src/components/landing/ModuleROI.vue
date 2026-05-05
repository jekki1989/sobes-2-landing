<template>
  <SectionScaffold id="roi" variant="roi">
    <template #bg>
      <div class="roi-bg"></div>
    </template>

    <div class="roi-layout">
      <div class="head reveal">
        <span class="kicker">ROI Calculator</span>
        <h2>Считайте экономию в реальном времени</h2>
        <p>Сдвиньте слайдеры — посмотрите, сколько вернёте обратно в продукт уже в первый месяц.</p>
      </div>

      <div class="roi-grid reveal">
        <div class="controls">
          <div class="control-card">
            <label>
              <span>Кандидатов в месяц</span>
              <strong>{{ candidates }}</strong>
            </label>
            <input
              type="range" min="10" max="1000" step="10"
              v-model.number="candidates"
              :style="{ '--p': pct(candidates, 10, 1000) + '%' }"
            />
            <div class="ticks"><span>10</span><span>250</span><span>500</span><span>1000</span></div>
          </div>

          <div class="control-card">
            <label>
              <span>Длительность интервью (мин)</span>
              <strong>{{ duration }}</strong>
            </label>
            <input
              type="range" min="20" max="90" step="5"
              v-model.number="duration"
              :style="{ '--p': pct(duration, 20, 90) + '%' }"
            />
            <div class="ticks"><span>20</span><span>45</span><span>60</span><span>90</span></div>
          </div>

          <div class="control-card">
            <span class="card-label">Уровень интервьюера</span>
            <div class="level-row">
              <button
                v-for="l in levels" :key="l.id"
                :class="['level-btn', { active: level === l.id }]"
                @click="level = l.id"
              >
                {{ l.label }}
                <em>{{ l.rate }} ₽/ч</em>
              </button>
            </div>
          </div>

          <div class="control-card">
            <span class="card-label">Регион</span>
            <div class="region-row">
              <button
                v-for="r in regions" :key="r.id"
                :class="['region-btn', { active: region === r.id }]"
                @click="region = r.id"
              >
                <span class="flag">{{ r.flag }}</span>
                {{ r.label }}
                <em>×{{ r.mult }}</em>
              </button>
            </div>
          </div>
        </div>

        <div class="result-side">
          <div class="big-card">
            <span class="big-label">Экономия в месяц</span>
            <div class="big-value">
              <AnimatedCounter
                :value="savings"
                suffix=" ₽"
                :trigger="true"
                :duration="900"
                :key="savings"
              />
            </div>
            <span class="big-foot">Возвращаете в найм или продукт</span>
          </div>

          <div class="split-bar">
            <div class="sb-row">
              <span>Текущая стоимость</span>
              <strong>{{ format(currentCost) }} ₽</strong>
            </div>
            <div class="sb-track">
              <div class="sb-current" :style="{ width: '100%' }">текущий процесс</div>
              <div class="sb-stage" :style="{ width: stagePercent + '%' }">StageOne</div>
            </div>
            <div class="sb-row">
              <span>Со StageOne</span>
              <strong class="good">{{ format(stageoneCost) }} ₽</strong>
            </div>
          </div>

          <div class="meta-row">
            <div class="meta">
              <span>Возврат сеньорских часов</span>
              <strong>{{ Math.round(seniorHours) }} ч</strong>
            </div>
            <div class="meta">
              <span>Время до интервью</span>
              <strong class="good">5 мин</strong>
            </div>
            <div class="meta">
              <span>Скорость воронки</span>
              <strong class="good">×{{ funnelMult }}</strong>
            </div>
          </div>

          <div class="chart">
            <div class="chart-head">
              <span>Накопленная экономия</span>
              <strong>{{ format(annualSaving) }} ₽ / год</strong>
            </div>
            <svg class="chart-svg" viewBox="0 0 400 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chart-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#4ade80" stop-opacity="0.5"/>
                  <stop offset="100%" stop-color="#4ade80" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <path :d="areaPath" fill="url(#chart-grad)"/>
              <path :d="linePath" fill="none" stroke="#4ade80" stroke-width="2" stroke-linecap="round"/>
              <g v-for="(p, i) in chartPoints" :key="i">
                <circle :cx="p.x" :cy="p.y" r="3" fill="#4ade80" />
              </g>
            </svg>
            <div class="chart-axis">
              <span v-for="m in months" :key="m">{{ m }}</span>
            </div>
          </div>

          <form class="email-form" @submit.prevent="submit">
            <input v-model="email" type="email" placeholder="ваш@email.com" required />
            <button type="submit" :disabled="submitted">
              {{ submitted ? '✓ Отправлено' : 'Получить расчёт на email' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </SectionScaffold>
</template>

<script setup>
import { ref, computed } from 'vue'
import SectionScaffold from './shared/SectionScaffold.vue'
import AnimatedCounter from './shared/AnimatedCounter.vue'

const candidates = ref(120)
const duration = ref(45)
const level = ref('senior')
const region = ref('ru')
const email = ref('')
const submitted = ref(false)

const levels = [
  { id: 'middle', label: 'Middle', rate: 1500 },
  { id: 'senior', label: 'Senior', rate: 2400 },
  { id: 'lead',   label: 'Lead',   rate: 3500 },
]
const regions = [
  { id: 'ru', label: 'РФ',  flag: '🇷🇺', mult: 1 },
  { id: 'cis', label: 'СНГ', flag: '🌍', mult: 0.8 },
  { id: 'eu', label: 'EU',  flag: '🇪🇺', mult: 3.6 },
  { id: 'us', label: 'US',  flag: '🇺🇸', mult: 5.2 },
]

const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

const ratePerHour = computed(() => {
  const lvl = levels.find((l) => l.id === level.value).rate
  const reg = regions.find((r) => r.id === region.value).mult
  return lvl * reg
})

const seniorHours = computed(() => candidates.value * (duration.value / 60))
const currentCost = computed(() => Math.round(seniorHours.value * ratePerHour.value))
const stageoneCost = computed(() => Math.round(candidates.value * 90 + 4990))
const savings = computed(() => Math.max(0, currentCost.value - stageoneCost.value))
const annualSaving = computed(() => savings.value * 12)
const stagePercent = computed(() => Math.min(100, (stageoneCost.value / currentCost.value) * 100))
const funnelMult = computed(() => {
  const ratio = currentCost.value / Math.max(1, stageoneCost.value)
  return Math.max(1.4, Math.min(8, ratio)).toFixed(1)
})

const chartPoints = computed(() => {
  const total = annualSaving.value
  const points = []
  for (let i = 0; i < 12; i++) {
    const x = (i / 11) * 380 + 10
    const cumulative = ((i + 1) / 12) * total
    const max = total
    const y = max > 0 ? 90 - (cumulative / max) * 80 : 90
    points.push({ x, y })
  }
  return points
})

const linePath = computed(() => {
  return chartPoints.value.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
})
const areaPath = computed(() => {
  return linePath.value + ` L390,90 L10,90 Z`
})

function pct(v, min, max) { return ((v - min) / (max - min)) * 100 }
function format(n) { return n.toLocaleString('ru-RU') }

function submit() {
  if (!email.value.trim()) return
  submitted.value = true
  setTimeout(() => { submitted.value = false; email.value = '' }, 2400)
}
</script>

<style scoped>
.roi-bg {
  position: absolute; inset: 0;
  background:
    radial-gradient(50% 50% at 80% 20%, rgba(74,222,128,0.18), transparent 65%),
    radial-gradient(40% 50% at 20% 80%, rgba(124,99,255,0.14), transparent 65%),
    linear-gradient(180deg, #0c1130 0%, #131734 100%);
}
.roi-layout { display: grid; gap: 40px; }
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

.roi-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
}

.controls { display: grid; gap: 14px; }

.control-card {
  padding: 22px;
  border-radius: 18px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
}
.card-label,
.control-card label > span {
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(214,222,255,0.55);
  font-weight: 800;
}
.control-card label {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}
.control-card label strong {
  font-family: 'Space Grotesk';
  font-size: 28px;
  color: #fff;
  font-weight: 700;
}

.control-card input[type='range'] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  margin-top: 14px;
  border-radius: 999px;
  background: linear-gradient(90deg, #4ade80 0%, #79e1ff var(--p), rgba(255,255,255,0.06) var(--p));
  outline: none;
  cursor: pointer;
}
.control-card input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 22px; height: 22px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 4px 14px rgba(74,222,128,0.4), 0 0 0 6px rgba(74,222,128,0.18);
  border: none;
  cursor: grab;
}

.ticks {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 11px;
  color: rgba(214,222,255,0.4);
  font-weight: 700;
}

.level-row, .region-row {
  display: grid;
  margin-top: 12px;
  gap: 6px;
}
.level-row { grid-template-columns: repeat(3, 1fr); }
.region-row { grid-template-columns: repeat(4, 1fr); }
.level-btn, .region-btn {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.02);
  color: #d6deff;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
  transition: 0.2s;
}
.level-btn em, .region-btn em {
  font-style: normal;
  font-weight: 600;
  font-size: 11px;
  color: rgba(214,222,255,0.5);
}
.level-btn:hover, .region-btn:hover { background: rgba(255,255,255,0.06); }
.level-btn.active, .region-btn.active {
  background: linear-gradient(135deg, rgba(74,222,128,0.22), rgba(124,99,255,0.18));
  border-color: rgba(74,222,128,0.4);
  color: #fff;
}
.region-btn.active em, .level-btn.active em { color: #4ade80; }
.flag { font-size: 16px; }

.result-side { display: grid; gap: 16px; }

.big-card {
  padding: 28px;
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(74,222,128,0.2), rgba(124,99,255,0.12));
  border: 1px solid rgba(74,222,128,0.3);
  position: relative;
  overflow: hidden;
}
.big-card::before {
  content: '';
  position: absolute;
  top: -50%; right: -10%;
  width: 60%;
  height: 200%;
  background: radial-gradient(circle, rgba(74,222,128,0.18), transparent 70%);
  pointer-events: none;
}
.big-label {
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(214,222,255,0.7);
  font-weight: 800;
}
.big-value {
  margin-top: 8px;
  font-family: 'Space Grotesk';
  font-size: clamp(40px, 5vw, 68px);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  background: linear-gradient(120deg, #fff, #4ade80);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.big-foot {
  display: block;
  margin-top: 8px;
  color: rgba(214,222,255,0.7);
  font-size: 13px;
}

.split-bar {
  padding: 18px;
  border-radius: 16px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
}
.sb-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 13px;
  color: rgba(214,222,255,0.7);
}
.sb-row strong { color: #ff8a3d; font-family: 'Space Grotesk'; font-size: 16px; }
.sb-row strong.good { color: #4ade80; }
.sb-track {
  position: relative;
  height: 18px;
  background: linear-gradient(90deg, #ff5b8a, #ff8a3d);
  border-radius: 999px;
  margin: 8px 0;
  overflow: hidden;
}
.sb-current { position: absolute; inset: 0; display: flex; align-items: center; justify-content: flex-end; padding-right: 10px; font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.6); text-transform: uppercase; }
.sb-stage {
  position: absolute;
  top: 0; left: 0; bottom: 0;
  background: linear-gradient(90deg, #4ade80, #22c55e);
  border-radius: 999px;
  transition: width 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  display: flex;
  align-items: center;
  padding-left: 10px;
  font-size: 10px;
  font-weight: 800;
  color: #051b13;
  text-transform: uppercase;
}

.meta-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.meta {
  padding: 14px;
  border-radius: 14px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
}
.meta span { display: block; font-size: 11px; color: rgba(214,222,255,0.55); letter-spacing: 0.05em; text-transform: uppercase; font-weight: 800; }
.meta strong { display: block; margin-top: 6px; font-family: 'Space Grotesk'; font-size: 22px; color: #fff; }
.meta strong.good { color: #4ade80; }

.chart {
  padding: 18px;
  border-radius: 16px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
}
.chart-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
}
.chart-head span { font-size: 12px; color: rgba(214,222,255,0.55); font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }
.chart-head strong { color: #4ade80; font-family: 'Space Grotesk'; font-size: 16px; }
.chart-svg { width: 100%; height: 100px; display: block; }
.chart-axis {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 9px;
  color: rgba(214,222,255,0.4);
  font-weight: 700;
}

.email-form {
  display: flex;
  gap: 8px;
  padding: 6px;
  border-radius: 14px;
  background: rgba(8,10,30,0.6);
  border: 1px solid rgba(255,255,255,0.08);
}
.email-form input {
  flex: 1;
  padding: 12px 16px;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font: inherit;
  font-size: 14px;
}
.email-form input::placeholder { color: rgba(214,222,255,0.4); }
.email-form button {
  padding: 12px 20px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #2c4dff, #b837ff);
  color: #fff;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}
.email-form button:disabled { opacity: 0.7; }

@media (max-width: 1100px) {
  .roi-grid { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .meta-row { grid-template-columns: 1fr; }
  .level-row, .region-row { grid-template-columns: 1fr 1fr; }
}
</style>
