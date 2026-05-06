<template>
  <div class="page landing-page">
    <ScrollProgress :sections="sectionsForProgress" :active-id="activeSection" />

    <header class="landing-header" :class="{ scrolled: isScrolled }">
      <div class="container landing-header-inner">
        <router-link to="/" class="landing-brand" aria-label="StageOne home">
          <span class="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2.8 35 11.4v17.2L20 37.2 5 28.6V11.4L20 2.8Z" fill="currentColor" opacity="0.16" />
              <path d="M20 7.7 30.7 13.8v12.4L20 32.3 9.3 26.2V13.8L20 7.7Z" fill="currentColor" />
              <path d="M20 13.2 25.6 16.5v7L20 26.8l-5.6-3.3v-7L20 13.2Z" fill="var(--so-surface)" opacity="0.95" />
            </svg>
          </span>
          <span class="brand-name">StageOne</span>
        </router-link>

        <nav class="header-actions" aria-label="Основная навигация">
          <router-link to="/login" class="header-link">Войти</router-link>
          <router-link to="/register" class="header-cta">Регистрация</router-link>
        </nav>
      </div>
    </header>

    <main class="landing-main">
      <section id="hero" class="hero hero--motion">
        <div class="container hero__inner">
          <div class="hero__badge">
            <span class="hero__badge-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 2h8v3a4 4 0 0 1-8 0V2Z" fill="currentColor" />
                <path d="M2 3h2v2a1 1 0 0 1-2 0V3ZM12 3h2v2a1 1 0 0 1-2 0V3Z" stroke="currentColor" stroke-width="1" fill="none" />
                <path d="M6 11h4v2H6z" fill="currentColor" />
                <path d="M5 13h6v1H5z" fill="currentColor" />
              </svg>
            </span>
            <span class="hero__badge-text">
              <span class="hero__badge-kicker">PRODUCT HUNT</span>
              <span class="hero__badge-line">#1 Product of the Day</span>
            </span>
          </div>

          <h1 class="hero__h1 hero__h1--motion">
            <span class="hero__line">ИИ-сотрудник, который</span>
            <span class="hero__line hero__line--type">
              <span class="hero__sizer" aria-hidden="true">отсеет неподходящих кандидатов</span>
              <span class="hero__type-frame">
                <span class="hero__type-text">{{ typedPhrase || '\u00A0' }}</span>
                <span class="hero__handles" aria-hidden="true">
                  <i class="hh hh-tl" /><i class="hh hh-tr" />
                  <i class="hh hh-bl" /><i class="hh hh-br" />
                  <i class="hh hh-t" /><i class="hh hh-b" />
                  <i class="hh hh-l" /><i class="hh hh-r" />
                </span>
              </span>
            </span>
            <span class="hero__line">за вас</span>
          </h1>

          <p class="hero__sub hero__sub--motion">
            StageOne — это как команда рекрутёров проводит собеседования
            и квалифицирует кандидатов вместе. Дизайн, отбор, отчёт —
            всё в одном месте.
          </p>

          <div class="hero__ctas hero__ctas--single">
            <router-link class="btn btn--primary btn--pill" to="/register">Зарегистрироваться</router-link>
          </div>
        </div>
      </section>

      <section v-show="!hideRhythmStrip" class="rhythm-strip" aria-label="Показатель StageOne">
        <div class="rhythm-strip__inner">
          <span>1000+ интервью в месяц</span>
        </div>
      </section>
      <ModulePipeline @enter="setActive" />
      <ModuleModes @enter="setActive" />
      <ModuleAudience />
      <ModulePain @enter="setActive" />
      <ModuleSecurity />
      <ModulePricing @enter="setActive" />
      <ModuleFAQ @enter="setActive" />
    </main>

    <footer class="landing-footer" aria-label="Подвал сайта">
      <div class="container landing-footer-inner">
        <div class="landing-footer-grid">
          <div class="landing-footer-col landing-footer-col--brand">
            <router-link to="/" class="landing-footer-brand" aria-label="StageOne home">
              <span class="landing-footer-mark" aria-hidden="true">
                <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="footer-brand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#79e1ff" />
                      <stop offset="50%" stop-color="#6c88ff" />
                      <stop offset="100%" stop-color="#4f46e5" />
                    </linearGradient>
                  </defs>
                  <path d="M20 2.8 35 11.4v17.2L20 37.2 5 28.6V11.4L20 2.8Z" fill="url(#footer-brand-gradient)" opacity="0.35" />
                  <path d="M20 7.7 30.7 13.8v12.4L20 32.3 9.3 26.2V13.8L20 7.7Z" fill="url(#footer-brand-gradient)" />
                  <path d="M20 13.2 25.6 16.5v7L20 26.8l-5.6-3.3v-7L20 13.2Z" fill="var(--so-surface)" opacity="0.95" />
                </svg>
              </span>
              <strong>StageOne</strong>
            </router-link>
            <p>AI-платформа для технических интервью. Скрининг, видеоаватар, отчёты — в одном месте.</p>
            <a class="landing-footer-mail" href="mailto:hello@stageone.ai">hello@stageone.ai</a>
          </div>

          <nav class="landing-footer-col" aria-label="Продукт">
            <span class="landing-footer-col__title">Продукт</span>
            <ul>
              <li><a href="#demo">Live Demo</a></li>
              <li><a href="#pipeline">Pipeline</a></li>
              <li><a href="#modes">Avatar &amp; Modes</a></li>
              <li><a href="#cost">Стоимость</a></li>
              <li><a href="#pricing">Тарифы</a></li>
            </ul>
          </nav>

          <nav class="landing-footer-col" aria-label="Компания">
            <span class="landing-footer-col__title">Компания</span>
            <ul>
              <li><a href="#audience">Для кого</a></li>
              <li><a href="#security">Безопасность</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><router-link to="/register">Регистрация</router-link></li>
              <li><router-link to="/login">Войти</router-link></li>
            </ul>
          </nav>

          <nav class="landing-footer-col" aria-label="Юридическое">
            <span class="landing-footer-col__title">Юридическое</span>
            <ul>
              <li><a href="#">Политика конфиденциальности</a></li>
              <li><a href="#">Условия использования</a></li>
              <li><a href="#">Обработка данных (152-ФЗ)</a></li>
              <li><a href="#">Cookies</a></li>
            </ul>
          </nav>
        </div>

        <div class="landing-footer-bottom">
          <span class="landing-footer-copy">© 2026 StageOne. Все права защищены.</span>
          <span class="landing-footer-status">
            <i class="landing-footer-dot" aria-hidden="true"></i>
            Все системы работают штатно
          </span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import ModulePain from '../components/landing/ModulePain.vue'
import ModulePipeline from '../components/landing/ModulePipeline.vue'
import ModuleModes from '../components/landing/ModuleModes.vue'
import ModuleAudience from '../components/landing/ModuleAudience.vue'
import ModuleSecurity from '../components/landing/ModuleSecurity.vue'
import ModulePricing from '../components/landing/ModulePricing.vue'
import ModuleFAQ from '../components/landing/ModuleFAQ.vue'
import ScrollProgress from '../components/landing/shared/ScrollProgress.vue'

const sectionsForProgress = [
  { id: 'hero', label: 'Главная' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'modes', label: 'Avatar & Modes' },
  { id: 'cost', label: 'Стоимость' },
  { id: 'pricing', label: 'Тарифы' },
  { id: 'faq', label: 'FAQ' },
]

const activeSection = ref('hero')
const isScrolled = ref(false)
const hideRhythmStrip = true

function setActive(id) {
  activeSection.value = id
}

function onScroll() {
  isScrolled.value = window.scrollY > 16
  if (window.scrollY < 120) {
    activeSection.value = 'hero'
  }
}

const phrases = [
  'проведет собеседование',
  'задаст вопросы кандидатам',
  'оценит каждого кандидата',
  'отсеет неподходящих кандидатов',
  'найдёт идеального кандидата',
]

const typedPhrase = ref('')
let phraseIndex = 0
let typingMode = 'typing'
let typingTimer = 0

function runTypewriter() {
  const full = phrases[phraseIndex]

  if (typingMode === 'typing') {
    if (typedPhrase.value.length < full.length) {
      typedPhrase.value = full.slice(0, typedPhrase.value.length + 1)
      typingTimer = window.setTimeout(runTypewriter, 55)
      return
    }
    typingMode = 'hold'
    typingTimer = window.setTimeout(runTypewriter, 1400)
    return
  }

  if (typingMode === 'hold') {
    typingMode = 'deleting'
    typingTimer = window.setTimeout(runTypewriter, 200)
    return
  }

  if (typedPhrase.value.length > 0) {
    typedPhrase.value = full.slice(0, typedPhrase.value.length - 1)
    typingTimer = window.setTimeout(runTypewriter, 28)
    return
  }

  phraseIndex = (phraseIndex + 1) % phrases.length
  typingMode = 'typing'
  typingTimer = window.setTimeout(runTypewriter, 120)
}

onMounted(() => {
  runTypewriter()
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  window.clearTimeout(typingTimer)
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  background: transparent;
  color: var(--so-ink);
  font-family: 'Manrope', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
}

.container {
  width: min(1400px, calc(100% - 80px));
  margin-inline: auto;
}

.landing-main {
  position: relative;
  z-index: 2;
}

.landing-footer {
  margin-top: 0;
  padding: 0 0 40px;
  background: linear-gradient(180deg, var(--so-surface) 0%, color-mix(in srgb, var(--so-brand) 3%, var(--so-surface)) 100%);
}

.landing-footer-inner {
  border-top: 1px solid var(--so-line);
  padding-top: clamp(48px, 5vw, 72px);
}

.landing-footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 56px 40px;
  align-items: start;
}

.landing-footer-col {
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;
}

.landing-footer-col--brand {
  gap: 18px;
  max-width: 380px;
}

.landing-footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: var(--so-ink);
}

.landing-footer-brand:focus {
  outline: none;
}

.landing-footer-mark {
  width: 30px;
  height: 30px;
  display: inline-flex;
}

.landing-footer-mark svg {
  width: 100%;
  height: 100%;
}

.landing-footer-brand strong {
  color: var(--so-ink);
  font-size: 24px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.01em;
}

.landing-footer-col--brand p {
  margin: 0;
  color: var(--so-mute);
  font-size: 15px;
  line-height: 1.55;
}

.landing-footer-mail {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid var(--so-line);
  background: var(--so-surface);
  color: var(--so-brand);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
}

.landing-footer-mail:hover {
  border-color: color-mix(in srgb, var(--so-brand) 35%, var(--so-line));
  background: color-mix(in srgb, var(--so-brand) 4%, var(--so-surface));
  color: color-mix(in srgb, var(--so-brand) 86%, var(--so-ink));
}

.landing-footer-col__title {
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--so-ink);
}

.landing-footer-col ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.landing-footer-col li {
  margin: 0;
}

.landing-footer-col a {
  color: var(--so-mute);
  font-size: 14px;
  line-height: 1.4;
  text-decoration: none;
  transition: color 0.18s ease;
}

.landing-footer-col a:hover {
  color: var(--so-brand);
}

.landing-footer-bottom {
  margin-top: clamp(40px, 4vw, 56px);
  padding-top: 20px;
  border-top: 1px solid var(--so-line);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.landing-footer-copy {
  color: var(--so-mute);
  font-size: 13px;
  line-height: 1.3;
}

.landing-footer-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--so-mute);
  font-size: 13px;
  line-height: 1.3;
}

.landing-footer-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #1ea674;
  box-shadow: 0 0 0 4px rgba(30, 166, 116, 0.14);
}

.landing-header {
  position: sticky;
  top: 0;
  z-index: 40;
  border-bottom: 1px solid transparent;
  background: color-mix(in srgb, var(--so-surface) 82%, transparent);
  backdrop-filter: saturate(160%) blur(10px);
  transition: border-color 0.25s ease, background 0.25s ease;
}

.landing-header.scrolled {
  border-bottom-color: var(--so-line);
  background: color-mix(in srgb, var(--so-surface) 92%, transparent);
}

.landing-header-inner {
  min-height: 86px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.landing-brand {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  color: var(--so-brand);
}

.landing-brand:focus {
  outline: none;
}

@media (min-width: 1101px) {
  .landing-brand {
    margin-left: 28px;
  }
}

.brand-mark {
  width: 36px;
  height: 36px;
  display: inline-flex;
}

.brand-mark svg {
  width: 100%;
  height: 100%;
}

.brand-name {
  font-family: 'Manrope', sans-serif;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: 0;
  color: var(--so-ink);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 18px;
}

.header-link {
  text-decoration: none;
  color: var(--so-mute);
  font-weight: 600;
  font-size: 15px;
}

.header-link:hover {
  color: var(--so-brand);
}

.header-cta {
  min-height: var(--so-control-h);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0 18px;
  background: var(--so-brand);
  border: 1px solid var(--so-brand);
  box-shadow: var(--so-shadow-sm);
  color: var(--so-surface);
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s var(--so-ease);
}

.header-cta:hover {
  background: var(--so-brand-hover);
  border-color: var(--so-brand-hover);
  transform: translateY(-1px);
}

.hero {
  position: relative;
  overflow: hidden;
  padding: clamp(28px, 5vw, 64px) 0 clamp(24px, 4vw, 48px);
  background: transparent;
}

.hero::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: min(1400px, calc(100% - 80px));
  border-top: 1px solid rgba(13, 16, 32, 0.05);
  pointer-events: none;
}

.hero--motion .hero__inner {
  max-width: 880px;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
  text-align: center;
}

.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: var(--so-alert-bg);
  border: 1px solid color-mix(in srgb, var(--so-alert) 22%, var(--so-alert-bg));
  color: var(--so-alert);
  border-radius: 14px;
  padding: 10px 18px;
  font-weight: 700;
}

.hero__badge-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}

.hero__badge-text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
  text-align: center;
  align-items: center;
  gap: 2px;
}

.hero__badge-kicker {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.75;
}

.hero__badge-line {
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: none;
}

.hero__h1 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.08em;
  margin: 0;
}

.hero__h1--motion {
  font-size: clamp(40px, 7.2vw, 88px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: var(--so-brand);
}

.hero__line {
  display: block;
  line-height: 1.1;
}

.hero__line--type {
  min-height: 1.1em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  white-space: nowrap;
}

.hero__line--type .hero__sizer {
  visibility: hidden;
  pointer-events: none;
  white-space: nowrap;
  display: inline-block;
}

.hero__line--type .hero__type-frame {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  white-space: nowrap;
}

.hero__type-frame {
  --hh-color: color-mix(in srgb, var(--so-mute) 45%, var(--so-surface));
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.06em 0.22em 0.22em;
  line-height: 1;
  color: var(--so-mute);
  background-image:
    linear-gradient(90deg, var(--hh-color) 50%, transparent 50%),
    linear-gradient(90deg, var(--hh-color) 50%, transparent 50%),
    linear-gradient(0deg, var(--hh-color) 50%, transparent 50%),
    linear-gradient(0deg, var(--hh-color) 50%, transparent 50%);
  background-size: 18px 1.5px, 18px 1.5px, 1.5px 18px, 1.5px 18px;
  background-position: 0 0, 0 100%, 0 0, 100% 0;
  background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
}

.hero__type-text {
  display: inline-block;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
}

.hero__handles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hh {
  position: absolute;
  width: 10px;
  height: 10px;
  background: var(--hh-color);
  border-radius: 999px;
}

.hh-tl {
  top: -5px;
  left: -5px;
}

.hh-tr {
  top: -5px;
  right: -5px;
}

.hh-bl {
  bottom: -5px;
  left: -5px;
}

.hh-br {
  bottom: -5px;
  right: -5px;
}

.hh-t {
  top: -5px;
  left: 50%;
  transform: translateX(-50%);
}

.hh-b {
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
}

.hh-l {
  left: -5px;
  top: 50%;
  transform: translateY(-50%);
}

.hh-r {
  right: -5px;
  top: 50%;
  transform: translateY(-50%);
}

.hero__sub--motion {
  color: var(--so-mute);
  font-size: clamp(15px, 1.4vw, 18px);
  max-width: 680px;
  margin: 6px auto 0;
  text-wrap: balance;
}

.hero__ctas--single {
  justify-content: center;
  margin-top: 6px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: var(--so-control-h-lg);
  padding: 0 32px;
  border-radius: 999px;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s var(--so-ease), box-shadow 0.2s ease;
}

.btn--pill {
  background: var(--so-brand);
  color: var(--so-surface);
  border: 1px solid var(--so-brand);
  box-shadow: var(--so-shadow-md);
}

.btn--pill:hover {
  background: var(--so-brand-hover);
  border-color: var(--so-brand-hover);
  transform: translateY(-1px);
  box-shadow: var(--so-shadow-lg);
}

.rhythm-strip {
  min-height: 104px;
  display: flex;
  align-items: center;
  background: transparent;
}

.rhythm-strip__inner {
  width: min(1400px, calc(100% - 80px));
  margin: 0 auto;
  padding: 24px 0;
  border-top: 1px solid var(--so-line);
  border-bottom: 1px solid var(--so-line);
}

.rhythm-strip span {
  display: block;
  color: var(--so-brand);
  font-size: clamp(24px, 3.8vw, 44px);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
}

@media (max-width: 1024px) {
  .landing-footer-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 40px 32px;
  }

  .landing-footer-col--brand {
    grid-column: 1 / -1;
    max-width: 560px;
  }
}

@media (max-width: 760px) {
  .container {
    width: min(1320px, calc(100% - 32px));
  }

  .landing-header-inner {
    min-height: 78px;
  }

  .brand-mark {
    width: 30px;
    height: 30px;
  }

  .brand-name {
    font-size: 26px;
  }

  .header-actions {
    gap: 10px;
  }

  .header-link,
  .header-cta {
    font-size: 14px;
  }

  .header-cta {
    min-height: 40px;
    padding: 0 14px;
  }

  .hero {
    padding: 32px 0 40px;
  }

  .hero::after {
    width: min(1320px, calc(100% - 32px));
  }

  .hero__h1--motion {
    font-size: clamp(34px, 11vw, 46px);
  }

  .hero__line--type {
    white-space: normal;
  }

  .landing-footer {
    padding: 0 0 28px;
  }

  .landing-footer-inner {
    padding-top: 40px;
  }

  .landing-footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 36px 24px;
  }

  .landing-footer-col--brand {
    grid-column: 1 / -1;
    max-width: none;
  }

  .landing-footer-mark {
    width: 26px;
    height: 26px;
  }

  .landing-footer-brand strong {
    font-size: 22px;
  }

  .landing-footer-col--brand p {
    font-size: 14px;
  }

  .landing-footer-bottom {
    margin-top: 32px;
    padding-top: 16px;
  }
}
</style>
