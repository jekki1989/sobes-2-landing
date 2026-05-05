<template>
  <SectionScaffold id="modes" variant="modes">
    <template #bg>
      <div class="modes-bg"></div>
    </template>

    <div class="modes-layout">
      <div class="head reveal">
        <span class="kicker">3 в одном</span>
        <h2>Один продукт — три формата интервью</h2>
        <p>Выбирайте формат под роль и кандидата. AI одинаково корректно проводит сессию в любом из них.</p>
      </div>

      <div class="cards reveal">
        <article
          v-for="(m, i) in modes"
          :key="m.id"
          class="mode-card"
          :class="{ flipped: flipped === m.id }"
          :style="{ '--accent': m.accent, transitionDelay: `${i * 60}ms` }"
          @mouseenter="flipped = m.id"
          @mouseleave="flipped = ''"
          @click="toggleFlip(m.id)"
        >
          <div class="card-inner">
            <div class="card-face front">
              <div class="card-icon" v-html="m.icon"></div>
              <h3>{{ m.title }}</h3>
              <p>{{ m.desc }}</p>
              <ul class="card-meta">
                <li v-for="t in m.tags" :key="t">{{ t }}</li>
              </ul>
              <div class="flip-hint">
                <span>Технические детали</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
            <div class="card-face back">
              <div class="back-head">
                <span>{{ m.title }}</span>
                <strong>Внутри</strong>
              </div>
              <ul class="tech-list">
                <li v-for="t in m.tech" :key="t.label">
                  <span class="tech-label">{{ t.label }}</span>
                  <span class="tech-val">{{ t.val }}</span>
                </li>
              </ul>
              <button class="preview-btn" @click.stop="play(m)">
                <svg v-if="playingMode !== m.id" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3v18l16-9z"/></svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
                </svg>
                {{ playingMode === m.id ? 'Стоп' : 'Превью режима' }}
              </button>
            </div>
          </div>
        </article>
      </div>

      <div class="recommend reveal">
        <h4>Какой режим под какую роль?</h4>
        <div class="rec-table">
          <div class="rec-row rec-head">
            <span>Роль</span><span>Voice</span><span>Text</span><span>Video</span>
          </div>
          <div v-for="r in recommendations" :key="r.role" class="rec-row">
            <span>{{ r.role }}</span>
            <span :class="['rec-cell', r.voice]"><i></i></span>
            <span :class="['rec-cell', r.text]"><i></i></span>
            <span :class="['rec-cell', r.video]"><i></i></span>
          </div>
        </div>
      </div>
    </div>
  </SectionScaffold>
</template>

<script setup>
import { ref } from 'vue'
import SectionScaffold from './shared/SectionScaffold.vue'

const flipped = ref('')
const playingMode = ref('')

function toggleFlip(id) {
  flipped.value = flipped.value === id ? '' : id
}

function play(m) {
  if (playingMode.value === m.id) {
    playingMode.value = ''
    return
  }
  playingMode.value = m.id
  setTimeout(() => { playingMode.value = '' }, 4000)
}

const modes = [
  {
    id: 'voice',
    title: 'Voice',
    desc: 'AI задаёт вопросы голосом, кандидат отвечает голосом. Самый быстрый и тёплый формат.',
    accent: '#79e1ff',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke-linecap="round"/></svg>',
    tags: ['Realtime STT', '<200ms latency', 'ElevenLabs / Yandex'],
    tech: [
      { label: 'TTS', val: 'ElevenLabs Flash 2.5' },
      { label: 'STT', val: 'Web Speech API + Whisper fallback' },
      { label: 'Интонации', val: 'friendly · professional · neutral' },
      { label: 'Языки', val: 'RU · EN · 27+' },
    ],
  },
  {
    id: 'text',
    title: 'Text',
    desc: 'Чат-формат. Подходит для асинхронных интервью и ролей, где формулировки точнее, чем речь.',
    accent: '#7c63ff',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 0 1-13 8L3 21l1-5a9 9 0 1 1 17-4Z" stroke-linejoin="round"/></svg>',
    tags: ['Async-friendly', 'История чата', 'Markdown в ответах'],
    tech: [
      { label: 'LLM', val: 'Claude Sonnet 4.5 / GPT-4o' },
      { label: 'Streaming', val: 'WS · token-by-token' },
      { label: 'Контекст', val: 'до 200k токенов' },
      { label: 'Code blocks', val: 'syntax highlight + run sandbox' },
    ],
  },
  {
    id: 'video',
    title: 'Video',
    desc: 'Полноценный видео-аватар с lip-sync. Для топ-ролей, где важно «человеческое впечатление».',
    accent: '#b837ff',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="6" width="14" height="12" rx="2"/><path d="m17 10 4-2v8l-4-2z" stroke-linejoin="round"/></svg>',
    tags: ['SIMLI realtime', 'Fal lip-sync', 'Custom avatars'],
    tech: [
      { label: 'Аватар', val: 'SIMLI / Fal lipsync / Media Lab' },
      { label: 'FPS', val: '24–30 fps · 720p' },
      { label: 'Кастом', val: 'свой аватар, голос, бренд' },
      { label: 'Запись', val: 'MP4 + транскрипт + waveform' },
    ],
  },
]

const recommendations = [
  { role: 'Frontend Junior',  voice: 'good', text: 'best', video: 'ok' },
  { role: 'Backend Senior',   voice: 'best', text: 'good', video: 'good' },
  { role: 'QA / Manual',      voice: 'good', text: 'best', video: 'ok' },
  { role: 'Engineering Lead', voice: 'good', text: 'good', video: 'best' },
  { role: 'Data Scientist',   voice: 'good', text: 'best', video: 'good' },
  { role: 'C-level / EM',     voice: 'ok',   text: 'good', video: 'best' },
]
</script>

<style scoped>
.modes-bg {
  position: absolute; inset: 0;
  background:
    radial-gradient(40% 40% at 90% 10%, rgba(184,55,255,0.18), transparent 65%),
    radial-gradient(40% 50% at 10% 90%, rgba(121,225,255,0.14), transparent 65%),
    linear-gradient(180deg, #0a0d28 0%, #14193a 100%);
}

.modes-layout { display: grid; gap: 56px; }

.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

.head { max-width: 760px; }
.kicker {
  display: inline-block; font-size: 12px; font-weight: 800;
  letter-spacing: 0.18em; text-transform: uppercase; color: #b837ff;
  padding: 6px 12px; background: rgba(184,55,255,0.12);
  border-radius: 999px; border: 1px solid rgba(184,55,255,0.3);
}
.head h2 { margin-top: 18px; font-size: clamp(34px, 4vw, 56px); line-height: 1.05; letter-spacing: -0.03em; color: #fff; }
.head p { margin-top: 12px; color: rgba(214,222,255,0.66); font-size: 17px; max-width: 580px; }

.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  perspective: 1400px;
}

.mode-card {
  position: relative;
  height: 380px;
  border-radius: 24px;
  cursor: pointer;
  transform-style: preserve-3d;
}

.card-inner {
  position: relative;
  width: 100%; height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}
.mode-card.flipped .card-inner { transform: rotateY(180deg); }

.card-face {
  position: absolute;
  inset: 0;
  border-radius: 24px;
  padding: 28px;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
}

.front {
  background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
  border: 1px solid rgba(255,255,255,0.08);
}
.front::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, var(--accent), transparent 60%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  opacity: 0.5;
}

.card-icon {
  width: 52px; height: 52px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--accent) 16%, transparent);
  color: var(--accent);
  margin-bottom: 22px;
}
.card-icon svg { width: 24px; height: 24px; }

.front h3 {
  font-size: 28px;
  color: #fff;
  letter-spacing: -0.02em;
}
.front p {
  margin-top: 12px;
  color: rgba(214,222,255,0.7);
  font-size: 14px;
  line-height: 1.5;
}
.card-meta {
  margin-top: auto;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.card-meta li {
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  font-size: 11px;
  font-weight: 700;
  color: rgba(214,222,255,0.7);
}

.flip-hint {
  margin-top: 18px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--accent);
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.back {
  background: linear-gradient(180deg, color-mix(in srgb, var(--accent) 12%, #14193a) 0%, #0d1130 100%);
  border: 1px solid color-mix(in srgb, var(--accent) 40%, transparent);
  transform: rotateY(180deg);
  box-shadow: 0 18px 40px -12px color-mix(in srgb, var(--accent) 50%, transparent);
}
.back-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 16px;
}
.back-head span { color: var(--accent); font-weight: 800; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; }
.back-head strong { color: rgba(255,255,255,0.4); font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; }

.tech-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}
.tech-list li {
  display: flex;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(255,255,255,0.04);
}
.tech-label { font-size: 12px; color: rgba(214,222,255,0.6); }
.tech-val { font-size: 13px; color: #fff; font-weight: 600; text-align: right; }

.preview-btn {
  margin-top: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  border: none;
  border-radius: 12px;
  background: var(--accent);
  color: #0a0d28;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: filter 0.2s;
}
.preview-btn:hover { filter: brightness(1.1); }

.recommend {
  padding: 28px;
  border-radius: 22px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
}
.recommend h4 {
  font-size: 20px;
  color: #fff;
  margin-bottom: 18px;
}
.rec-table { display: grid; gap: 4px; }
.rec-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  align-items: center;
  font-size: 14px;
  color: rgba(214,222,255,0.78);
}
.rec-row:nth-child(even) { background: rgba(255,255,255,0.02); }
.rec-head { color: rgba(214,222,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 800; }
.rec-cell { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; }
.rec-cell i {
  width: 14px; height: 14px; border-radius: 999px;
  background: rgba(255,255,255,0.1);
}
.rec-cell.best i { background: linear-gradient(135deg, #4ade80, #22c55e); box-shadow: 0 0 0 4px rgba(74,222,128,0.16); }
.rec-cell.good i { background: linear-gradient(135deg, #79e1ff, #4c46f5); }
.rec-cell.ok i { background: rgba(255,255,255,0.2); }
.rec-cell.best { color: #4ade80; }
.rec-cell.best::after { content: 'Best'; }
.rec-cell.good::after { content: 'Good'; }
.rec-cell.ok::after { content: 'OK'; color: rgba(214,222,255,0.4); }

@media (max-width: 1100px) {
  .cards { grid-template-columns: 1fr; }
  .mode-card { height: 340px; }
}
</style>
