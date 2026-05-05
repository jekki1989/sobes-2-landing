<template>
  <SectionScaffold id="pain" variant="pain" @enter="onEnter">
    <template #bg>
      <div class="pain-bg"></div>
      <div class="noise"></div>
    </template>

    <div class="pain-layout">
      <div class="head reveal">
        <span class="kicker">Стоимость текущего процесса</span>
        <h2>Сколько уходит на первый этап интервью прямо сейчас</h2>
        <p>
          Сложите часы сеньоров, выпавших кандидатов и недели ожидания.
          Получится сумма, которую можно тратить на продукт, а не на скрининг.
        </p>
      </div>

      <div class="stats">
        <article
          v-for="(s, idx) in stats"
          :key="s.id"
          class="stat-card reveal"
          :style="{ transitionDelay: `${idx * 80}ms` }"
        >
          <div class="stat-icon" :style="{ background: s.tint }">
            <span v-html="s.icon"></span>
          </div>
          <div class="stat-value">
            <AnimatedCounter
              :value="s.value"
              :decimals="s.decimals || 0"
              :suffix="s.suffix"
              :prefix="s.prefix"
              :trigger="triggered"
            />
          </div>
          <p class="stat-label">{{ s.label }}</p>
          <span class="stat-source">{{ s.source }}</span>
        </article>
      </div>

      <div class="calc reveal">
        <div class="calc-head">
          <h3>Посчитайте свою боль</h3>
          <p>Сдвиньте слайдер, чтобы увидеть, сколько ваша воронка стоит сегодня.</p>
        </div>

        <div class="calc-body">
          <div class="slider-block">
            <div class="slider-row">
              <span>Вакансий в месяц</span>
              <strong>{{ vacancies }}</strong>
            </div>
            <input
              type="range"
              min="1"
              max="200"
              v-model.number="vacancies"
              class="slider"
              :style="{ '--p': vacanciesPercent + '%' }"
            />
            <div class="slider-ticks">
              <span>1</span><span>50</span><span>100</span><span>200</span>
            </div>
          </div>

          <div class="result">
            <div class="res-line">
              <span>Часов в месяц на скрининг:</span>
              <strong class="bad">≈ {{ totalHours }} ч</strong>
            </div>
            <div class="res-line">
              <span>Прямые потери (₽):</span>
              <strong class="bad">≈ {{ formattedCost }} ₽</strong>
            </div>
            <div class="res-line subtle">
              <span>Кандидатов «сорвалось» с воронки:</span>
              <strong>≈ {{ lostCandidates }}</strong>
            </div>
            <button class="cta" @click="goToROI">
              Посчитать экономию со StageOne
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </SectionScaffold>
</template>

<script setup>
import { ref, computed } from 'vue'
import SectionScaffold from './shared/SectionScaffold.vue'
import AnimatedCounter from './shared/AnimatedCounter.vue'

const triggered = ref(false)
function onEnter() { triggered.value = true }

const stats = [
  {
    id: 'hrs',
    label: 'Часов сеньорского времени тратится в неделю на скрининг',
    value: 32,
    suffix: ' ч',
    tint: 'linear-gradient(135deg, #ff5b8a, #ff8a3d)',
    source: 'на 1 активную вакансию',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2" stroke-linecap="round"/></svg>',
  },
  {
    id: 'cost',
    label: 'Стоимость одного скрининг-интервью',
    value: 9800,
    prefix: '',
    suffix: ' ₽',
    tint: 'linear-gradient(135deg, #ffaf3d, #ff5b8a)',
    source: '1 ч сеньора + переключение контекста',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6" stroke-linecap="round"/></svg>',
  },
  {
    id: 'drop',
    label: 'Кандидатов «отваливается» в очереди ожидания',
    value: 38,
    suffix: '%',
    tint: 'linear-gradient(135deg, #b837ff, #ff5b8a)',
    source: 'из-за слотов через 3–7 дней',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 17l6-6 4 4 8-8m0 0v6m0-6h-6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  {
    id: 'days',
    label: 'Дней между откликом и первым интервью',
    value: 5.2,
    decimals: 1,
    suffix: ' дн',
    tint: 'linear-gradient(135deg, #4c46f5, #b837ff)',
    source: 'медиана по рынку',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4" stroke-linecap="round"/></svg>',
  },
]

const vacancies = ref(20)
const vacanciesPercent = computed(() => ((vacancies.value - 1) / 199) * 100)
const totalHours = computed(() => Math.round(vacancies.value * 8 * 4))
const totalCost = computed(() => totalHours.value * 2400)
const lostCandidates = computed(() => Math.round(vacancies.value * 4 * 0.38))
const formattedCost = computed(() => totalCost.value.toLocaleString('ru-RU'))

function goToROI() {
  document.getElementById('roi')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.pain-bg {
  position: absolute; inset: 0;
  background:
    radial-gradient(60% 60% at 0% 100%, rgba(255,91,138,0.18), transparent 60%),
    radial-gradient(40% 40% at 100% 0%, rgba(255,175,61,0.14), transparent 60%),
    linear-gradient(180deg, #07091e 0%, #14102e 100%);
}

.noise {
  position: absolute; inset: 0;
  background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 4px 4px;
  opacity: 0.4;
  mix-blend-mode: overlay;
}

.pain-layout {
  display: grid;
  gap: 56px;
}

.head {
  max-width: 760px;
  text-align: left;
}
.kicker {
  display: inline-block;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #ff8a3d;
  padding: 6px 12px;
  background: rgba(255, 138, 61, 0.12);
  border-radius: 999px;
  border: 1px solid rgba(255, 138, 61, 0.3);
}
.head h2 {
  margin-top: 18px;
  font-size: clamp(36px, 4.4vw, 64px);
  line-height: 1.04;
  letter-spacing: -0.03em;
  color: #fff;
}
.head p {
  margin-top: 16px;
  color: rgba(214, 222, 255, 0.66);
  font-size: 18px;
  line-height: 1.55;
  max-width: 620px;
}

.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.stat-card {
  position: relative;
  padding: 26px;
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(10px);
  overflow: hidden;
}
.stat-card::after {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, rgba(255,91,138,0.4), transparent 60%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}
.stat-card:hover::after { opacity: 1; }

.stat-icon {
  width: 48px; height: 48px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-bottom: 22px;
}
.stat-icon svg { width: 22px; height: 22px; }

.stat-value {
  font-size: clamp(40px, 4vw, 56px);
  font-weight: 700;
  letter-spacing: -0.04em;
  color: #fff;
  line-height: 1;
  font-family: 'Space Grotesk', sans-serif;
  background: linear-gradient(120deg, #fff 0%, #ff8a3d 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.stat-label {
  margin-top: 12px;
  color: rgba(214, 222, 255, 0.78);
  font-size: 14px;
  line-height: 1.4;
}
.stat-source {
  display: block;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(255,255,255,0.06);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(214, 222, 255, 0.4);
  font-weight: 700;
}

.calc {
  border-radius: 28px;
  padding: 32px;
  background: linear-gradient(135deg, rgba(76,70,245,0.18), rgba(255,91,138,0.1));
  border: 1px solid rgba(255,255,255,0.08);
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 36px;
  align-items: center;
}

.calc-head h3 {
  font-size: clamp(26px, 3vw, 36px);
  color: #fff;
  letter-spacing: -0.02em;
}
.calc-head p {
  margin-top: 10px;
  color: rgba(214, 222, 255, 0.7);
}

.calc-body {
  display: contents;
}

.slider-block {
  padding: 22px;
  border-radius: 18px;
  background: rgba(8,10,30,0.5);
  border: 1px solid rgba(255,255,255,0.08);
}

.slider-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  color: rgba(214, 222, 255, 0.7);
  font-size: 14px;
}
.slider-row strong {
  font-size: 32px;
  color: #fff;
  font-weight: 700;
  font-family: 'Space Grotesk', sans-serif;
}

.slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  margin-top: 16px;
  border-radius: 999px;
  background: linear-gradient(90deg, #ff5b8a 0%, #b837ff var(--p), rgba(255,255,255,0.08) var(--p));
  outline: none;
  cursor: pointer;
}
.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 22px; height: 22px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 4px 14px rgba(255, 91, 138, 0.5), 0 0 0 6px rgba(255,91,138,0.18);
  cursor: grab;
  border: none;
}
.slider::-moz-range-thumb {
  width: 22px; height: 22px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 4px 14px rgba(255, 91, 138, 0.5);
  cursor: grab;
  border: none;
}
.slider-ticks {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 11px;
  color: rgba(214,222,255,0.4);
  font-weight: 700;
}

.result {
  display: grid;
  gap: 14px;
}
.res-line {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 14px 18px;
  border-radius: 14px;
  background: rgba(255,255,255,0.04);
  color: rgba(214,222,255,0.78);
  font-size: 14px;
}
.res-line strong {
  font-size: 22px;
  color: #fff;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
}
.res-line .bad {
  background: linear-gradient(120deg, #ff5b8a, #ff8a3d);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.res-line.subtle { background: transparent; padding: 0 4px; }

.cta {
  margin-top: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 22px;
  border-radius: 14px;
  background: linear-gradient(135deg, #2c4dff, #b837ff);
  color: #fff;
  font: inherit;
  font-size: 15px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  box-shadow: 0 14px 30px -8px rgba(124, 99, 255, 0.55);
  transition: transform 0.2s;
}
.cta:hover { transform: translateY(-2px); }

@media (max-width: 1100px) {
  .stats { grid-template-columns: 1fr 1fr; }
  .calc { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .stats { grid-template-columns: 1fr; }
  .calc { padding: 22px; }
}
</style>
