<template>
  <SectionScaffold id="avatar-lab" variant="lab">
    <template #bg>
      <div class="lab-bg"></div>
    </template>

    <div class="lab-layout">
      <div class="head reveal">
        <span class="kicker">Avatar Lab</span>
        <h2>Выберите лицо вашего бренда</h2>
        <p>10+ голосов, разные стили общения, кастомные аватары под Enterprise. Один аватар может вести сотни интервью параллельно.</p>
      </div>

      <div class="lab-grid reveal">
        <div class="preview">
          <div class="preview-frame" :style="{ '--accent': active.color }">
            <div class="preview-orb">
              <div class="orb-shell"></div>
              <div class="orb-glow"></div>
              <div class="orb-face">
                <div class="initials">{{ active.initials }}</div>
                <div class="lipsync" :class="{ talking: previewing }">
                  <span v-for="n in 14" :key="n" :style="{ animationDelay: `${n * 0.04}s` }"></span>
                </div>
              </div>
            </div>
            <div class="preview-info">
              <div class="pi-row">
                <span class="pi-label">Аватар</span>
                <strong>{{ active.name }}</strong>
              </div>
              <div class="pi-row">
                <span class="pi-label">Стиль</span>
                <strong>{{ active.style }}</strong>
              </div>
              <div class="pi-row">
                <span class="pi-label">Голос</span>
                <strong>{{ active.voice }}</strong>
              </div>
              <div class="pi-row">
                <span class="pi-label">Языки</span>
                <strong>{{ active.languages.join(' · ') }}</strong>
              </div>
            </div>
          </div>

          <div class="preview-controls">
            <button class="play" @click="togglePlay">
              <svg v-if="!previewing" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3v18l16-9z"/></svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
              {{ previewing ? 'Стоп' : 'Услышать голос' }}
            </button>

            <div class="slider-control">
              <label>Скорость <strong>{{ speed.toFixed(2) }}x</strong></label>
              <input
                type="range"
                min="0.8"
                max="1.2"
                step="0.05"
                v-model.number="speed"
                :style="{ '--p': ((speed - 0.8) / 0.4) * 100 + '%' }"
              />
            </div>

            <div class="slider-control">
              <label>Стиль <strong>{{ styleLabels[Math.round(styleVal)] }}</strong></label>
              <input
                type="range"
                min="0"
                max="2"
                step="1"
                v-model.number="styleVal"
                :style="{ '--p': (styleVal / 2) * 100 + '%' }"
              />
            </div>
          </div>
        </div>

        <div class="gallery">
          <article
            v-for="a in avatars"
            :key="a.id"
            :class="['avatar-tile', { active: a.id === activeId, locked: a.locked }]"
            :style="{ '--accent': a.color }"
            @click="selectAvatar(a)"
          >
            <div class="tile-orb">
              <span class="initials">{{ a.initials }}</span>
              <span v-if="a.locked" class="lock">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="5" y="11" width="14" height="9" rx="2"/>
                  <path d="M8 11V8a4 4 0 0 1 8 0v3"/>
                </svg>
              </span>
            </div>
            <div class="tile-info">
              <strong>{{ a.name }}</strong>
              <span>{{ a.style }}</span>
            </div>
            <span v-if="a.id === activeId" class="active-dot"></span>
            <span v-if="a.locked" class="badge-pro">Enterprise</span>
          </article>
        </div>
      </div>
    </div>
  </SectionScaffold>
</template>

<script setup>
import { ref, computed } from 'vue'
import SectionScaffold from './shared/SectionScaffold.vue'

const avatars = [
  { id: 'irina', name: 'Ирина', initials: 'ИР', color: '#79e1ff', style: 'Профессиональный', voice: 'ElevenLabs · Marina', languages: ['RU', 'EN'] },
  { id: 'svetlana', name: 'Светлана', initials: 'СВ', color: '#7c63ff', style: 'Дружелюбный', voice: 'ElevenLabs · Lena', languages: ['RU', 'EN'] },
  { id: 'alex', name: 'Алекс', initials: 'АЛ', color: '#4ade80', style: 'Нейтральный', voice: 'Yandex · Alex', languages: ['RU', 'EN', 'KZ'] },
  { id: 'maya', name: 'Майя', initials: 'МА', color: '#ff8a3d', style: 'Тёплый', voice: 'ElevenLabs · Maya', languages: ['EN', 'ES'] },
  { id: 'ken', name: 'Кен', initials: 'KN', color: '#36c8ff', style: 'Корпоративный', voice: 'OpenAI · Onyx', languages: ['EN'], locked: true },
  { id: 'aria', name: 'Ария', initials: 'AR', color: '#ff5b8a', style: 'Энергичный', voice: 'ElevenLabs · Aria', languages: ['EN', 'DE'], locked: true },
  { id: 'custom', name: 'Свой бренд', initials: '+', color: '#b837ff', style: 'Кастом', voice: 'Voice cloning', languages: ['Любой'], locked: true },
]

const activeId = ref('irina')
const active = computed(() => avatars.find((a) => a.id === activeId.value))
const speed = ref(1.0)
const styleVal = ref(1)
const styleLabels = ['Formal', 'Neutral', 'Friendly']
const previewing = ref(false)

let pTimer = 0
function selectAvatar(a) {
  if (a.locked) {
    activeId.value = 'custom'
    setTimeout(() => { activeId.value = a.id }, 400)
    return
  }
  activeId.value = a.id
  previewing.value = false
  clearTimeout(pTimer)
}

function togglePlay() {
  previewing.value = !previewing.value
  if (previewing.value) {
    clearTimeout(pTimer)
    pTimer = setTimeout(() => { previewing.value = false }, 4500)
  }
}
</script>

<style scoped>
.lab-bg {
  position: absolute; inset: 0;
  background:
    radial-gradient(50% 50% at 30% 50%, rgba(124,99,255,0.18), transparent 65%),
    radial-gradient(40% 50% at 80% 90%, rgba(255,91,138,0.14), transparent 65%),
    linear-gradient(180deg, #0e1230 0%, #1a1648 100%);
}

.lab-layout { display: grid; gap: 48px; }
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

.head { max-width: 760px; }
.kicker {
  display: inline-block; font-size: 12px; font-weight: 800;
  letter-spacing: 0.18em; text-transform: uppercase; color: #ff8a3d;
  padding: 6px 12px; background: rgba(255,138,61,0.12);
  border-radius: 999px; border: 1px solid rgba(255,138,61,0.3);
}
.head h2 { margin-top: 18px; font-size: clamp(34px, 4vw, 56px); line-height: 1.05; letter-spacing: -0.03em; color: #fff; }
.head p { margin-top: 12px; color: rgba(214,222,255,0.66); font-size: 17px; max-width: 580px; }

.lab-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 28px;
  align-items: start;
}

.preview {
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
  border: 1px solid rgba(255,255,255,0.08);
  padding: 28px;
}
.preview-frame {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 28px;
  align-items: center;
}
.preview-orb {
  position: relative;
  width: 220px;
  height: 220px;
}
.orb-shell {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: radial-gradient(circle at 50% 30%, color-mix(in srgb, var(--accent) 80%, white) 0%, var(--accent) 50%, #0d1130 100%);
  box-shadow: 0 30px 60px -10px color-mix(in srgb, var(--accent) 50%, transparent);
}
.orb-glow {
  position: absolute;
  inset: -16px;
  border-radius: 999px;
  background: radial-gradient(circle, color-mix(in srgb, var(--accent) 50%, transparent), transparent 70%);
  filter: blur(20px);
  animation: glowpulse 4s ease-in-out infinite;
}
@keyframes glowpulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.08); opacity: 1; }
}
.orb-face {
  position: absolute;
  inset: 30px;
  border-radius: 999px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  color: #fff;
  background: linear-gradient(180deg, transparent 50%, rgba(8,10,30,0.4) 100%);
}
.initials {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 52px;
  font-weight: 800;
  letter-spacing: -0.04em;
}
.lipsync {
  display: flex;
  align-items: center;
  gap: 3px;
  height: 24px;
  opacity: 0.4;
  transition: opacity 0.3s;
}
.lipsync.talking { opacity: 1; }
.lipsync span {
  display: block;
  width: 3px; height: 10%;
  border-radius: 2px;
  background: #fff;
}
.lipsync.talking span { animation: bar 0.7s ease-in-out infinite; }
@keyframes bar {
  0%, 100% { height: 15%; }
  50% { height: 90%; }
}

.preview-info { display: flex; flex-direction: column; gap: 12px; }
.pi-row {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 12px;
  background: rgba(255,255,255,0.04);
  align-items: baseline;
}
.pi-label {
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(214,222,255,0.5);
  font-weight: 800;
}
.pi-row strong { color: #fff; font-size: 14px; font-weight: 600; }

.preview-controls { margin-top: 22px; display: flex; gap: 14px; flex-wrap: wrap; align-items: center; }

.play {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 22px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #2c4dff, #b837ff);
  color: #fff;
  font: inherit;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 14px 30px -8px rgba(124,99,255,0.55);
}

.slider-control {
  flex: 1;
  min-width: 180px;
  padding: 10px 14px;
  border-radius: 12px;
  background: rgba(255,255,255,0.04);
}
.slider-control label {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  font-size: 12px;
  color: rgba(214,222,255,0.6);
  font-weight: 700;
  letter-spacing: 0.05em;
}
.slider-control strong {
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  font-family: 'Space Grotesk';
}
.slider-control input[type='range'] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  margin-top: 8px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--accent, #79e1ff) 0%, var(--accent, #79e1ff) var(--p), rgba(255,255,255,0.08) var(--p));
  outline: none;
  cursor: pointer;
}
.slider-control input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px; height: 16px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.4);
  border: none;
}

.gallery {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.avatar-tile {
  position: relative;
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 14px;
  align-items: center;
  padding: 14px 16px;
  border-radius: 16px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  cursor: pointer;
  transition: 0.25s;
}
.avatar-tile:hover {
  background: rgba(255,255,255,0.08);
  transform: translateY(-2px);
}
.avatar-tile.active {
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  border-color: color-mix(in srgb, var(--accent) 50%, transparent);
  box-shadow: 0 8px 24px -8px color-mix(in srgb, var(--accent) 50%, transparent);
}
.avatar-tile.locked { opacity: 0.78; }

.tile-orb {
  position: relative;
  width: 56px; height: 56px;
  border-radius: 999px;
  background: radial-gradient(circle at 50% 30%, color-mix(in srgb, var(--accent) 80%, white) 0%, var(--accent) 50%, #0d1130 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-family: 'Space Grotesk';
  font-weight: 800;
  font-size: 16px;
  letter-spacing: -0.02em;
}
.tile-orb .initials { font-size: 16px; }
.lock {
  position: absolute;
  bottom: -4px; right: -4px;
  width: 22px; height: 22px;
  border-radius: 999px;
  background: #0a0d28;
  border: 1px solid rgba(255,255,255,0.16);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.tile-info { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.tile-info strong { color: #fff; font-size: 14px; }
.tile-info span { color: rgba(214,222,255,0.55); font-size: 12px; }

.active-dot {
  position: absolute;
  top: 14px; right: 14px;
  width: 8px; height: 8px;
  border-radius: 999px;
  background: #4ade80;
  box-shadow: 0 0 0 4px rgba(74,222,128,0.18);
}

.badge-pro {
  position: absolute;
  bottom: 12px; right: 12px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 999px;
  background: linear-gradient(135deg, #b837ff, #ff5b8a);
  color: #fff;
}

@media (max-width: 1100px) {
  .lab-grid { grid-template-columns: 1fr; }
  .preview-frame { grid-template-columns: 180px 1fr; }
}
@media (max-width: 700px) {
  .preview-frame { grid-template-columns: 1fr; text-align: center; }
  .preview-orb { margin: 0 auto; width: 180px; height: 180px; }
  .gallery { grid-template-columns: 1fr; }
}
</style>
