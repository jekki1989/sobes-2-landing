<template>
  <SectionScaffold id="cost" variant="cost" @enter="emit('enter', 'cost')">
    <template #bg>
      <div class="cost-bg"></div>
    </template>

    <div class="cost-layout">
      <div class="head reveal">
        <span class="kicker">Сколько стоит</span>
        <h2>Один слайдер показывает текущие потери и цену StageOne</h2>
        <p>
          Перетащите объём кандидатов в месяц. Сравнение считает часы интервьюера,
          прямую стоимость и цену автоматизированного первого этапа.
        </p>
      </div>

      <div class="cost-panel reveal">
        <div class="volume-control">
          <div class="slider-copy">
            <span>Кандидатов в месяц</span>
            <strong>{{ candidates }}</strong>
          </div>
          <input
            v-model.number="candidates"
            class="cost-slider"
            type="range"
            min="20"
            max="1000"
            step="20"
            :style="{ '--p': sliderPercent + '%' }"
          />
          <div class="slider-ticks">
            <span>20</span>
            <span>250</span>
            <span>500</span>
            <span>1000</span>
          </div>
        </div>

        <div class="cost-results">
          <article class="result-column current">
            <span class="result-kicker">Сейчас</span>
            <h3>{{ format(currentCost) }} ₽</h3>
            <dl>
              <div>
                <dt>Часы сеньоров</dt>
                <dd>{{ Math.round(seniorHours) }} ч / месяц</dd>
              </div>
              <div>
                <dt>Средний слот</dt>
                <dd>{{ duration }} минут</dd>
              </div>
              <div>
                <dt>Потеря кандидатов</dt>
                <dd>{{ lostCandidates }} человек</dd>
              </div>
            </dl>
          </article>

          <article class="result-column stageone">
            <span class="result-kicker">StageOne</span>
            <h3>{{ format(stageoneCost) }} ₽</h3>
            <dl>
              <div>
                <dt>Возврат времени</dt>
                <dd>{{ Math.round(seniorHours) }} ч</dd>
              </div>
              <div>
                <dt>Время до интервью</dt>
                <dd>5 минут</dd>
              </div>
              <div>
                <dt>Экономия</dt>
                <dd>{{ format(savings) }} ₽ / месяц</dd>
              </div>
            </dl>
          </article>
        </div>

        <div class="split-bar" aria-label="Сравнение текущей стоимости и StageOne">
          <div class="split-row">
            <span>Текущий процесс</span>
            <strong>{{ format(currentCost) }} ₽</strong>
          </div>
          <div class="split-track">
            <span class="split-current"></span>
            <span class="split-stage" :style="{ width: stagePercent + '%' }"></span>
          </div>
          <div class="split-row">
            <span>StageOne</span>
            <strong>{{ format(stageoneCost) }} ₽</strong>
          </div>
        </div>
      </div>
    </div>
  </SectionScaffold>
</template>

<script setup>
import { computed, ref } from 'vue'
import SectionScaffold from './shared/SectionScaffold.vue'

const emit = defineEmits(['enter'])

const candidates = ref(120)
const duration = 45
const interviewerRate = 2400
const stageoneBase = 4990
const stageonePerInterview = 90

const sliderPercent = computed(() => ((candidates.value - 20) / 980) * 100)
const seniorHours = computed(() => candidates.value * (duration / 60))
const currentCost = computed(() => Math.round(seniorHours.value * interviewerRate))
const stageoneCost = computed(() => Math.round(stageoneBase + candidates.value * stageonePerInterview))
const savings = computed(() => Math.max(0, currentCost.value - stageoneCost.value))
const stagePercent = computed(() => Math.max(4, Math.min(100, (stageoneCost.value / currentCost.value) * 100)))
const lostCandidates = computed(() => Math.round(candidates.value * 0.18))

function format(value) {
  return value.toLocaleString('ru-RU')
}
</script>

<style scoped>
.cost-bg {
  position: absolute;
  inset: 0;
  background: transparent;
}

.cost-layout {
  display: grid;
  gap: 42px;
}

.head {
  max-width: 820px;
}

.head p {
  margin: 14px 0 0;
  max-width: 680px;
  font-size: 17px;
  line-height: 1.6;
}

.cost-panel {
  display: grid;
  gap: 28px;
  padding: 32px;
  border: 1px solid var(--so-line);
  border-radius: 8px;
  background: var(--so-surface);
}

.volume-control {
  display: grid;
  gap: 14px;
}

.slider-copy {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 18px;
  color: var(--so-mute);
  font-size: 14px;
}

.slider-copy strong {
  color: var(--so-ink);
  font-size: clamp(38px, 5vw, 64px);
  line-height: 1;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.cost-slider {
  width: 100%;
  height: 6px;
  accent-color: var(--so-brand);
  cursor: pointer;
}

.slider-ticks {
  display: flex;
  justify-content: space-between;
  color: var(--so-mute);
  font-size: 12px;
  font-weight: 700;
}

.cost-results {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-top: 1px solid var(--so-line);
  border-bottom: 1px solid var(--so-line);
}

.result-column {
  padding: 28px 28px 30px 0;
}

.result-column + .result-column {
  padding-right: 0;
  padding-left: 28px;
  border-left: 1px solid var(--so-line);
}

.result-kicker {
  color: var(--so-mute);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.result-column h3 {
  margin: 10px 0 24px;
  font-size: clamp(34px, 5vw, 56px);
  line-height: 1;
  font-weight: 800;
}

.stageone h3,
.stageone .result-kicker {
  color: var(--so-brand);
}

dl {
  display: grid;
  gap: 14px;
  margin: 0;
}

dl div {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: baseline;
}

dt {
  color: var(--so-mute);
  font-size: 14px;
}

dd {
  margin: 0;
  color: var(--so-ink);
  font-size: 15px;
  font-weight: 800;
  text-align: right;
}

.split-bar {
  display: grid;
  gap: 10px;
}

.split-row {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  color: var(--so-mute);
  font-size: 13px;
}

.split-row strong {
  color: var(--so-ink);
}

.split-track {
  position: relative;
  height: 18px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--so-surface-2);
  border: 1px solid var(--so-line);
}

.split-current,
.split-stage {
  position: absolute;
  inset: 0;
}

.split-stage {
  right: auto;
  background: var(--so-brand);
  transition: width 0.35s ease;
}

@media (max-width: 900px) {
  .cost-panel {
    padding: 24px;
  }

  .cost-results {
    grid-template-columns: 1fr;
  }

  .result-column,
  .result-column + .result-column {
    padding: 24px 0;
    border-left: 0;
  }

  .result-column + .result-column {
    border-top: 1px solid var(--so-line);
  }
}

@media (max-width: 560px) {
  dl div,
  .slider-copy {
    align-items: flex-start;
    flex-direction: column;
  }

  dd {
    text-align: left;
  }
}
</style>
