<template>
  <SectionScaffold id="security" variant="security">
    <template #bg>
      <div class="sec-bg"></div>
    </template>

    <div class="sec-layout">
      <div class="head reveal">
        <span class="kicker">Trust & Security</span>
        <h2>Безопасность по умолчанию</h2>
        <p>Никаких чёрных коробок. Каждое действие записывается, каждое подключение шифруется.</p>
      </div>

      <div class="orbit reveal">
        <div class="orbit-stage" :class="{ paused: hovered }">
          <div class="orbit-rings">
            <span class="ring r1"></span>
            <span class="ring r2"></span>
            <span class="ring r3"></span>
          </div>

          <div class="orbit-core">
            <div class="shield">
              <svg viewBox="0 0 64 64" fill="none">
                <defs>
                  <linearGradient id="shield-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#79e1ff"/>
                    <stop offset="50%" stop-color="#7c63ff"/>
                    <stop offset="100%" stop-color="#b837ff"/>
                  </linearGradient>
                </defs>
                <path d="M32 4 8 14v18c0 14 10 26 24 28 14-2 24-14 24-28V14L32 4Z"
                      fill="url(#shield-grad)" opacity="0.15"/>
                <path d="M32 12 14 20v12c0 11 8 19 18 22 10-3 18-11 18-22V20L32 12Z"
                      fill="url(#shield-grad)"/>
                <path d="m22 32 7 7 14-14" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span class="core-label">Shield Layer</span>
          </div>

          <div
            v-for="(b, i) in badges"
            :key="b.id"
            :class="['orbit-badge', { active: active === b.id }]"
            :style="badgeStyle(i)"
            @mouseenter="onHover(b.id)"
            @mouseleave="onLeave"
            @click="active = b.id"
          >
            <div class="badge-icon" v-html="b.icon"></div>
            <span class="badge-name">{{ b.short }}</span>
          </div>
        </div>

        <transition name="fade-up">
          <div v-if="activeBadge" :key="activeBadge.id" class="badge-detail">
            <span class="bd-tag">{{ activeBadge.tag }}</span>
            <h3>{{ activeBadge.title }}</h3>
            <p>{{ activeBadge.text }}</p>
            <ul>
              <li v-for="b in activeBadge.bullets" :key="b">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>
                {{ b }}
              </li>
            </ul>
          </div>
        </transition>
      </div>

      <div class="compliance reveal">
        <span>Совместимо</span>
        <div class="compliance-row">
          <div v-for="(c, i) in compliance" :key="c" class="comp-tile" :style="{ animationDelay: `${i * 0.1}s` }">
            {{ c }}
          </div>
        </div>
      </div>
    </div>
  </SectionScaffold>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import SectionScaffold from './shared/SectionScaffold.vue'

const badges = [
  {
    id: 'verify',
    short: 'Email verify',
    tag: 'Authentication',
    title: 'Email-верификация HR-аккаунтов',
    text: 'После регистрации backend отправляет 6-значный код. До его подтверждения вход заблокирован.',
    bullets: ['SMTP с TLS 1.3', 'TTL кода 10 минут', 'Rate limiting на резенд'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6" stroke-linecap="round"/></svg>',
  },
  {
    id: 'oauth',
    short: 'Google OAuth',
    tag: 'Identity',
    title: 'Federated identity через Google',
    text: 'Backend верифицирует ID token напрямую через Google Identity Services. Пароли Google не хранятся.',
    bullets: ['ID token signature check', 'Whitelisting client IDs', 'Без хранения паролей'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" stroke-linecap="round"/></svg>',
  },
  {
    id: 'audit',
    short: 'Audit log',
    tag: 'Compliance',
    title: 'Полный аудит-лог действий',
    text: 'Каждое создание интервью, доступ к сессии, изменение прав записывается с user_id, IP и timestamp.',
    bullets: ['Immutable log', 'Доступ для super-admin', 'Экспорт CSV / API'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z"/><path d="M14 3v6h6M9 13h6M9 17h6M9 9h2" stroke-linecap="round"/></svg>',
  },
  {
    id: 'rbac',
    short: 'RBAC',
    tag: 'Access control',
    title: 'Ролевая модель',
    text: 'Три уровня доступа: HR, Candidate, Super Admin. Принцип наименьших привилегий.',
    bullets: ['JWT-based авторизация', 'Гранулярные права на интервью', 'Поддержка SSO в Enterprise'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a8 8 0 0 1 16 0v1" stroke-linecap="round"/><path d="m17 14 2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  {
    id: 'storage',
    short: 'Data residency',
    tag: 'Storage',
    title: '152-ФЗ совместимое хранение',
    text: 'Опциональный регион хранения для РФ-клиентов. PII шифруется at rest.',
    bullets: ['РФ / EU / US регионы', 'AES-256 at rest', 'TTL для транскриптов'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5M3 12a9 3 0 0 0 18 0"/></svg>',
  },
  {
    id: 'transport',
    short: 'TLS 1.3',
    tag: 'Transport',
    title: 'Шифрование транспорта',
    text: 'TLS 1.3 для HTTP, WSS для real-time WebSocket интервью. HSTS + certificate pinning.',
    bullets: ['TLS 1.3 минимум', 'WSS для интервью', 'HSTS preload'],
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  },
]

const active = ref('verify')
const hovered = ref(false)
const activeBadge = computed(() => badges.find((b) => b.id === active.value))

function onHover(id) {
  active.value = id
  hovered.value = true
}
function onLeave() { hovered.value = false }

function badgeStyle(i) {
  const angle = (i / badges.length) * 360
  return {
    '--angle': angle + 'deg',
  }
}

onMounted(() => {
  let idx = 0
  setInterval(() => {
    if (hovered.value) return
    idx = (idx + 1) % badges.length
    active.value = badges[idx].id
  }, 4000)
})

const compliance = ['GDPR-ready', '152-ФЗ', 'SOC 2 (in progress)', 'OWASP Top 10', 'TLS 1.3']
</script>

<style scoped>
.sec-bg {
  position: absolute; inset: 0;
  background:
    radial-gradient(50% 50% at 50% 50%, rgba(124,99,255,0.18), transparent 65%),
    linear-gradient(180deg, #0e1230 0%, #131734 100%);
}

.sec-layout { display: grid; gap: 36px; }
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

.head { max-width: 760px; }
.kicker {
  display: inline-block; font-size: 12px; font-weight: 800;
  letter-spacing: 0.18em; text-transform: uppercase; color: #79e1ff;
  padding: 6px 12px; background: rgba(121,225,255,0.12);
  border-radius: 999px; border: 1px solid rgba(121,225,255,0.3);
}
.head h2 { margin-top: 18px; font-size: clamp(34px, 4vw, 56px); line-height: 1.05; letter-spacing: -0.03em; color: #fff; }
.head p { margin-top: 12px; color: rgba(214,222,255,0.66); font-size: 17px; max-width: 580px; }

.orbit {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 32px;
  align-items: center;
}

.orbit-stage {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  max-width: 520px;
  margin: 0 auto;
}

.orbit-rings { position: absolute; inset: 0; }
.ring {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  border: 1px dashed rgba(124,99,255,0.2);
  animation: rotate 60s linear infinite;
}
.ring.r2 { inset: 12%; animation-duration: 50s; animation-direction: reverse; border-color: rgba(184,55,255,0.16); }
.ring.r3 { inset: 24%; animation-duration: 40s; border-color: rgba(121,225,255,0.18); }
@keyframes rotate {
  to { transform: rotate(360deg); }
}

.orbit-core {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 5;
}
.shield {
  width: 100px;
  height: 100px;
  filter: drop-shadow(0 12px 32px rgba(124,99,255,0.5));
}
.core-label {
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(8,10,30,0.7);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #79e1ff;
}

.orbit-badge {
  position: absolute;
  top: 50%; left: 50%;
  width: 88px;
  margin: -44px 0 0 -44px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  z-index: 4;
  transform: rotate(var(--angle)) translateY(-180px) rotate(calc(-1 * var(--angle)));
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  animation: orbital 50s linear infinite;
  animation-delay: calc(var(--angle) / 360 * -50s);
}
.orbit-stage.paused .orbit-badge { animation-play-state: paused; }
.orbit-stage.paused .ring { animation-play-state: paused; }

@keyframes orbital {
  from { transform: rotate(var(--angle)) translateY(-180px) rotate(calc(-1 * var(--angle))); }
  to { transform: rotate(calc(var(--angle) + 360deg)) translateY(-180px) rotate(calc(-1 * (var(--angle) + 360deg))); }
}

.badge-icon {
  width: 50px; height: 50px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(124,99,255,0.3), rgba(184,55,255,0.2));
  border: 1px solid rgba(124,99,255,0.4);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transition: 0.3s;
  backdrop-filter: blur(10px);
}
.badge-icon svg { width: 22px; height: 22px; }
.orbit-badge.active .badge-icon {
  background: linear-gradient(135deg, #2c4dff, #b837ff);
  border-color: transparent;
  box-shadow: 0 0 0 6px rgba(124,99,255,0.18), 0 12px 28px -8px rgba(124,99,255,0.6);
  transform: scale(1.1);
}
.badge-name {
  font-size: 11px;
  font-weight: 700;
  color: rgba(214,222,255,0.7);
  letter-spacing: 0.05em;
  text-align: center;
  padding: 3px 8px;
  border-radius: 8px;
  background: rgba(8,10,30,0.6);
  white-space: nowrap;
}
.orbit-badge.active .badge-name { color: #fff; background: rgba(124,99,255,0.4); }

.badge-detail {
  padding: 28px;
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
  border: 1px solid rgba(124,99,255,0.3);
}

.fade-up-enter-from { opacity: 0; transform: translateY(12px); }
.fade-up-enter-active { transition: 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
.fade-up-leave-to { opacity: 0; transform: translateY(-8px); }
.fade-up-leave-active { transition: 0.25s; position: absolute; }

.bd-tag {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 999px;
  background: rgba(124,99,255,0.16);
  color: #b9a8ff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.badge-detail h3 {
  margin-top: 14px;
  font-size: clamp(22px, 2.4vw, 28px);
  color: #fff;
  letter-spacing: -0.02em;
}
.badge-detail p {
  margin-top: 12px;
  color: rgba(214,222,255,0.7);
  font-size: 15px;
  line-height: 1.55;
}
.badge-detail ul {
  margin-top: 18px;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.badge-detail li {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #e7ecff;
  font-size: 14px;
}
.badge-detail li svg {
  color: #4ade80;
  background: rgba(74,222,128,0.16);
  padding: 4px;
  border-radius: 999px;
}

.compliance {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}
.compliance > span {
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(214,222,255,0.4);
  font-weight: 800;
}
.compliance-row { display: flex; gap: 12px; flex-wrap: wrap; }
.comp-tile {
  padding: 10px 16px;
  border-radius: 12px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  color: rgba(214,222,255,0.78);
  font-size: 13px;
  font-weight: 700;
  font-family: 'Space Grotesk';
  animation: float-comp 6s ease-in-out infinite;
}
@keyframes float-comp {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

@media (max-width: 1100px) {
  .orbit { grid-template-columns: 1fr; }
  .orbit-stage { max-width: 380px; }
  .orbit-badge { transform: rotate(var(--angle)) translateY(-140px) rotate(calc(-1 * var(--angle))); }
  @keyframes orbital {
    from { transform: rotate(var(--angle)) translateY(-140px) rotate(calc(-1 * var(--angle))); }
    to { transform: rotate(calc(var(--angle) + 360deg)) translateY(-140px) rotate(calc(-1 * (var(--angle) + 360deg))); }
  }
}
@media (max-width: 700px) {
  .orbit-stage { max-width: 320px; }
  .orbit-badge { width: 64px; margin: -32px 0 0 -32px; transform: rotate(var(--angle)) translateY(-110px) rotate(calc(-1 * var(--angle))); }
  .badge-icon { width: 38px; height: 38px; }
  .badge-icon svg { width: 18px; height: 18px; }
  .badge-name { font-size: 9px; padding: 2px 6px; }
  @keyframes orbital {
    from { transform: rotate(var(--angle)) translateY(-110px) rotate(calc(-1 * var(--angle))); }
    to { transform: rotate(calc(var(--angle) + 360deg)) translateY(-110px) rotate(calc(-1 * (var(--angle) + 360deg))); }
  }
}
</style>
