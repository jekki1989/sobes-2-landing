<template>
  <SectionScaffold id="modes" variant="modes" @enter="emit('enter', 'modes')">
    <template #bg>
      <div class="modes-bg"></div>
    </template>

    <div class="modes-layout">
      <div class="head reveal">
        <span class="kicker">Avatar & Modes</span>
        <h2>Один аватар ведёт voice, text и video-интервью</h2>
        <p>
          Настройте лицо бренда и формат интервью в одном месте. Режим меняется под роль,
          а тон коммуникации остаётся единым.
        </p>
      </div>

      <div class="modes-shell reveal">
        <div class="avatar-preview">
          <div class="avatar-orb" :class="{ talking: previewing }">
            <div class="avatar-initials">{{ activeAvatar.initials }}</div>
            <div class="lipsync" aria-hidden="true">
              <span v-for="n in 14" :key="n" :style="{ animationDelay: `${n * 0.04}s` }"></span>
            </div>
          </div>

          <div class="avatar-meta">
            <span>Аватар</span>
            <h3>{{ activeAvatar.name }}</h3>
            <p>{{ activeAvatar.style }} стиль, {{ activeAvatar.voice }}. Языки: {{ activeAvatar.languages.join(' · ') }}.</p>
          </div>

          <button class="preview-action" type="button" @click="togglePreview">
            <svg v-if="!previewing" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 3v18l16-9z" />
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
            {{ previewing ? 'Стоп' : 'Услышать голос' }}
          </button>
        </div>

        <div class="mode-controls">
          <div class="mode-switch" role="tablist" aria-label="Режим интервью">
            <button
              v-for="mode in modes"
              :key="mode.id"
              :class="['mode-btn', { active: mode.id === activeModeId }]"
              type="button"
              @click="activeModeId = mode.id"
            >
              <span v-html="mode.icon"></span>
              {{ mode.title }}
            </button>
          </div>

          <div class="mode-detail">
            <span class="detail-label">{{ activeMode.title }}</span>
            <h3>{{ activeMode.headline }}</h3>
            <p>{{ activeMode.desc }}</p>
            <ul>
              <li v-for="item in activeMode.points" :key="item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path d="m5 12 5 5L20 7" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                {{ item }}
              </li>
            </ul>
          </div>

          <div class="avatar-list" aria-label="Выбор аватара">
            <button
              v-for="avatar in avatars"
              :key="avatar.id"
              :class="['avatar-tile', { active: avatar.id === activeAvatarId, locked: avatar.locked }]"
              type="button"
              @click="selectAvatar(avatar)"
            >
              <span class="tile-initials">{{ avatar.initials }}</span>
              <span>
                <strong>{{ avatar.name }}</strong>
                <em>{{ avatar.style }}</em>
              </span>
              <small v-if="avatar.locked">Enterprise</small>
            </button>
          </div>
        </div>
      </div>
    </div>
  </SectionScaffold>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import SectionScaffold from './shared/SectionScaffold.vue'

const emit = defineEmits(['enter'])

const modes = [
  {
    id: 'voice',
    title: 'Voice',
    headline: 'Голосовой скрининг без ожидания свободного слота',
    desc: 'AI задаёт вопросы голосом, слушает ответы и уточняет детали по сценарию.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke-linecap="round"/></svg>',
    points: ['Realtime STT', 'Latency до 200 ms', 'Голос ElevenLabs или Yandex'],
  },
  {
    id: 'text',
    title: 'Text',
    headline: 'Асинхронный чат для ролей, где важна точность',
    desc: 'Кандидат отвечает в своём темпе, а рекрутёр получает такой же структурированный отчёт.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 0 1-13 8L3 21l1-5a9 9 0 1 1 17-4Z" stroke-linejoin="round"/></svg>',
    points: ['История чата', 'Code blocks', 'Единый скоринг'],
  },
  {
    id: 'video',
    title: 'Video',
    headline: 'Видео-аватар для ролей, где важен личный контакт',
    desc: 'Lip-sync и брендированный образ создают ощущение живой первой встречи.',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="6" width="14" height="12" rx="2"/><path d="m17 10 4-2v8l-4-2z" stroke-linejoin="round"/></svg>',
    points: ['SIMLI realtime', '720p запись', 'Custom avatar для Enterprise'],
  },
]

const avatars = [
  { id: 'irina', name: 'Ирина', initials: 'ИР', style: 'Профессиональный', voice: 'Marina', languages: ['RU', 'EN'] },
  { id: 'svetlana', name: 'Светлана', initials: 'СВ', style: 'Дружелюбный', voice: 'Lena', languages: ['RU', 'EN'] },
  { id: 'alex', name: 'Алекс', initials: 'АЛ', style: 'Нейтральный', voice: 'Alex', languages: ['RU', 'EN', 'KZ'] },
  { id: 'custom', name: 'Свой бренд', initials: '+', style: 'Кастом', voice: 'Voice cloning', languages: ['Любой'], locked: true },
]

const activeModeId = ref('voice')
const activeAvatarId = ref('irina')
const previewing = ref(false)
let previewTimer = 0

const activeMode = computed(() => modes.find((mode) => mode.id === activeModeId.value))
const activeAvatar = computed(() => avatars.find((avatar) => avatar.id === activeAvatarId.value))

function selectAvatar(avatar) {
  activeAvatarId.value = avatar.id
  previewing.value = false
  window.clearTimeout(previewTimer)
}

function togglePreview() {
  previewing.value = !previewing.value
  window.clearTimeout(previewTimer)
  if (previewing.value) {
    previewTimer = window.setTimeout(() => {
      previewing.value = false
    }, 4200)
  }
}

onBeforeUnmount(() => {
  window.clearTimeout(previewTimer)
})
</script>

<style scoped>
.modes-bg {
  position: absolute;
  inset: 0;
  background: transparent;
}

.modes-layout {
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

.modes-shell {
  display: grid;
  grid-template-columns: minmax(320px, 0.9fr) minmax(0, 1.1fr);
  gap: 28px;
  align-items: stretch;
  border: 1px solid var(--so-line);
  border-radius: 8px;
  background: var(--so-surface);
  padding: 32px;
}

.avatar-preview {
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 22px;
  padding-right: 28px;
  border-right: 1px solid var(--so-line);
  text-align: center;
}

.avatar-orb {
  position: relative;
  width: min(280px, 68vw);
  aspect-ratio: 1;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: var(--so-brand);
  background: var(--so-surface-2);
  border: 1px solid var(--so-line);
}

.avatar-orb::after {
  content: '';
  position: absolute;
  inset: 18px;
  border-radius: inherit;
  border: 1px solid var(--so-line);
}

.avatar-initials {
  color: var(--so-ink);
  font-size: clamp(54px, 9vw, 88px);
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0;
}

.lipsync {
  position: absolute;
  bottom: 58px;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 26px;
  color: var(--so-brand);
  opacity: 0.35;
}

.lipsync span {
  display: block;
  width: 3px;
  height: 22%;
  border-radius: 999px;
  background: currentColor;
}

.avatar-orb.talking .lipsync {
  opacity: 1;
}

.avatar-orb.talking .lipsync span {
  animation: voicebar 0.72s ease-in-out infinite;
}

@keyframes voicebar {
  0%,
  100% {
    height: 18%;
  }
  50% {
    height: 92%;
  }
}

.avatar-meta span,
.detail-label {
  color: var(--so-mute);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.avatar-meta h3 {
  margin: 8px 0 8px;
}

.avatar-meta p {
  margin: 0;
  max-width: 360px;
  line-height: 1.55;
}

.preview-action,
.mode-btn,
.avatar-tile {
  border: 1px solid var(--so-line);
  background: var(--so-surface);
  color: var(--so-ink);
  cursor: pointer;
}

.preview-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 48px;
  border-radius: 999px;
  padding: 0 20px;
  color: var(--so-surface);
  background: var(--so-brand);
  border-color: var(--so-brand);
  font-weight: 800;
}

.mode-controls {
  display: grid;
  gap: 22px;
}

.mode-switch {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.mode-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  border-radius: 999px;
  font-weight: 800;
}

.mode-btn svg {
  width: 18px;
  height: 18px;
}

.mode-btn.active {
  color: var(--so-brand);
  border-color: var(--so-brand);
}

.mode-detail {
  display: grid;
  gap: 12px;
  padding: 28px 0;
  border-top: 1px solid var(--so-line);
  border-bottom: 1px solid var(--so-line);
}

.mode-detail h3,
.mode-detail p {
  margin: 0;
}

.mode-detail p {
  max-width: 620px;
  line-height: 1.55;
}

.mode-detail ul {
  display: grid;
  gap: 10px;
  margin: 6px 0 0;
  padding: 0;
  list-style: none;
}

.mode-detail li {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--so-ink);
  font-size: 14px;
}

.mode-detail li svg {
  color: var(--so-brand);
  flex-shrink: 0;
}

.avatar-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.avatar-tile {
  position: relative;
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 12px;
  align-items: center;
  min-height: 74px;
  border-radius: 8px;
  padding: 12px;
  text-align: left;
}

.avatar-tile.active {
  border-color: var(--so-brand);
}

.avatar-tile.locked {
  color: var(--so-mute);
}

.tile-initials {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--so-surface-2);
  color: var(--so-brand);
  font-weight: 800;
}

.avatar-tile strong,
.avatar-tile em {
  display: block;
}

.avatar-tile strong {
  color: var(--so-ink);
  font-size: 14px;
}

.avatar-tile em {
  margin-top: 2px;
  color: var(--so-mute);
  font-style: normal;
  font-size: 12px;
}

.avatar-tile small {
  position: absolute;
  right: 10px;
  bottom: 8px;
  color: var(--so-mute);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (max-width: 1050px) {
  .modes-shell {
    grid-template-columns: 1fr;
  }

  .avatar-preview {
    padding-right: 0;
    padding-bottom: 28px;
    border-right: 0;
    border-bottom: 1px solid var(--so-line);
  }
}

@media (max-width: 640px) {
  .modes-shell {
    padding: 22px;
  }

  .mode-switch,
  .avatar-list {
    grid-template-columns: 1fr;
  }
}
</style>
