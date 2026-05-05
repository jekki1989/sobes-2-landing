<template>
  <div class="page landing-page">
    <ScrollProgress />
    <CursorGlow />

    <header class="landing-header" :class="{ scrolled: isScrolled }">
      <div class="container landing-header-inner">
        <router-link to="/" class="landing-brand" aria-label="StageOne home">
          <span class="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="landing-brand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#79e1ff" />
                  <stop offset="50%" stop-color="#6c88ff" />
                  <stop offset="100%" stop-color="#4f46e5" />
                </linearGradient>
              </defs>
              <path d="M20 2.8 35 11.4v17.2L20 37.2 5 28.6V11.4L20 2.8Z" fill="url(#landing-brand-gradient)" opacity="0.35" />
              <path d="M20 7.7 30.7 13.8v12.4L20 32.3 9.3 26.2V13.8L20 7.7Z" fill="url(#landing-brand-gradient)" />
              <path d="M20 13.2 25.6 16.5v7L20 26.8l-5.6-3.3v-7L20 13.2Z" fill="#ffffff" opacity="0.9" />
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

    <SideRail :sections="sectionsForRail" :active-id="activeSection" @navigate="onNavigate" />

    <main class="landing-main">
      <section id="hero" class="hero hero--motion">
        <div class="container hero__inner">
          <div class="hero__badge">
            <span class="hero__badge-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 2h8v3a4 4 0 0 1-8 0V2Z" fill="#e85a6b" />
                <path d="M2 3h2v2a1 1 0 0 1-2 0V3ZM12 3h2v2a1 1 0 0 1-2 0V3Z" stroke="#e85a6b" stroke-width="1" fill="none" />
                <path d="M6 11h4v2H6z" fill="#e85a6b" />
                <path d="M5 13h6v1H5z" fill="#e85a6b" />
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

      <ModulePain @enter="setActive" />
      <ModuleLiveDemo @enter="setActive" />
      <ModulePipeline @enter="setActive" />
      <ModuleModes @enter="setActive" />
      <ModuleAvatarLab @enter="setActive" />
      <ModuleAudience @enter="setActive" />
      <ModuleROI @enter="setActive" />
      <ModuleCompare @enter="setActive" />
      <ModuleSecurity @enter="setActive" />
      <ModulePricing @enter="setActive" />
      <ModuleFAQ @enter="setActive" />
    </main>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import ModulePain from '../components/landing/ModulePain.vue'
import ModuleLiveDemo from '../components/landing/ModuleLiveDemo.vue'
import ModulePipeline from '../components/landing/ModulePipeline.vue'
import ModuleModes from '../components/landing/ModuleModes.vue'
import ModuleAvatarLab from '../components/landing/ModuleAvatarLab.vue'
import ModuleAudience from '../components/landing/ModuleAudience.vue'
import ModuleROI from '../components/landing/ModuleROI.vue'
import ModuleCompare from '../components/landing/ModuleCompare.vue'
import ModuleSecurity from '../components/landing/ModuleSecurity.vue'
import ModulePricing from '../components/landing/ModulePricing.vue'
import ModuleFAQ from '../components/landing/ModuleFAQ.vue'
import ScrollProgress from '../components/landing/shared/ScrollProgress.vue'
import SideRail from '../components/landing/shared/SideRail.vue'
import CursorGlow from '../components/landing/shared/CursorGlow.vue'

const sectionsForRail = [
  { id: 'hero', label: 'Главная' },
  { id: 'pain', label: 'Боль' },
  { id: 'demo', label: 'Live Demo' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'modes', label: 'Режимы' },
  { id: 'avatar-lab', label: 'Avatar Lab' },
  { id: 'audience', label: 'Кому' },
  { id: 'roi', label: 'ROI' },
  { id: 'compare', label: 'До / После' },
  { id: 'security', label: 'Безопасность' },
  { id: 'pricing', label: 'Тарифы' },
  { id: 'faq', label: 'FAQ' },
]

const activeSection = ref('hero')
const isScrolled = ref(false)

function setActive(id) {
  activeSection.value = id
}

function onNavigate(id) {
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
  background: #ffffff;
  color: #0d1020;
  font-family: 'Manrope', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
}

.container {
  width: min(1340px, calc(100% - 96px));
}

.landing-main {
  position: relative;
  z-index: 2;
}

.landing-header {
  position: sticky;
  top: 0;
  z-index: 40;
  border-bottom: 1px solid transparent;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: saturate(160%) blur(10px);
  transition: border-color 0.25s ease, background 0.25s ease;
}

.landing-header.scrolled {
  border-bottom-color: #e6e8f1;
  background: rgba(255, 255, 255, 0.92);
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
  color: #0d1020;
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
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 18px;
}

.header-link {
  text-decoration: none;
  color: #2b2f44;
  font-weight: 600;
  font-size: 15px;
}

.header-link:hover {
  color: #2a3fe0;
}

.header-cta {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0 18px;
  background: #2a3fe0;
  box-shadow: 0 10px 24px rgba(42, 63, 224, 0.28);
  color: #ffffff;
  font-weight: 700;
  text-decoration: none;
}

.header-cta:hover {
  background: #1f30b5;
}

.hero {
  position: relative;
  overflow: hidden;
  padding: clamp(40px, 8vw, 96px) 0 clamp(56px, 8vw, 120px);
  background:
    radial-gradient(1200px 600px at 20% -10%, #e6ecff 0%, rgba(230, 236, 255, 0) 60%),
    radial-gradient(900px 500px at 100% 30%, #f1e9ff 0%, rgba(241, 233, 255, 0) 60%),
    linear-gradient(180deg, #f7f8ff 0%, #ffffff 80%);
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
  background: #fff5f5;
  border: 1px solid #ffd9dd;
  color: #e85a6b;
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
  color: #2a3fe0;
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
  position: relative;
  display: inline-block;
  border: 1.5px dashed #b9c0d4;
  border-radius: 6px;
  padding: 0 0.12em;
  color: #b8bccd;
}

.hero__type-text {
  font-weight: 800;
  letter-spacing: -0.03em;
}

.hero__handles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hh {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #fff;
  border: 1.5px solid #6b78a8;
  border-radius: 2px;
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
  color: #5a5f78;
  font-size: clamp(15px, 1.4vw, 18px);
  max-width: 640px;
  margin: 6px auto 0;
}

.hero__ctas--single {
  justify-content: center;
  margin-top: 6px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  padding: 0 32px;
  border-radius: 999px;
  font-weight: 700;
  text-decoration: none;
}

.btn--pill {
  background: #2a3fe0;
  color: #fff;
  box-shadow: 0 10px 24px rgba(42, 63, 224, 0.28);
}

.btn--pill:hover {
  background: #1f30b5;
}

/* Unified palette for all dynamic sections below hero */
.landing-page :deep(.cursor-glow) {
  display: none !important;
}

.landing-page :deep(.scroll-progress) {
  background: rgba(42, 63, 224, 0.08) !important;
}

.landing-page :deep(.progress-bar) {
  background: linear-gradient(90deg, #2a3fe0, #6c88ff) !important;
}

.landing-page :deep(.side-rail ul) {
  background: rgba(255, 255, 255, 0.88) !important;
  border: 1px solid #e6e8f1 !important;
}

.landing-page :deep(.rail-dot .dot) {
  background: #b7bfd8 !important;
}

.landing-page :deep(.rail-dot.active .dot) {
  background: #2a3fe0 !important;
  box-shadow: 0 0 0 4px rgba(42, 63, 224, 0.18) !important;
}

.landing-page :deep(.rail-dot .label) {
  background: #ffffff !important;
  color: #2b2f44 !important;
  border: 1px solid #e6e8f1 !important;
}

.landing-page :deep(.landing-section) {
  --so-blue: #2a3fe0;
  --so-blue-press: #1f30b5;
  --so-blue-soft: #eef1ff;
  --so-ink: #0d1020;
  --so-ink-2: #2b2f44;
  --so-mute: #5a5f78;
  --so-line: #e6e8f1;
  --so-badge: #e85a6b;
  --so-badge-bg: #fff5f5;
  --so-badge-line: #ffd9dd;
  color: var(--so-ink) !important;
}

.landing-page :deep(.pain-bg),
.landing-page :deep(.demo-bg),
.landing-page :deep(.pipe-bg),
.landing-page :deep(.modes-bg),
.landing-page :deep(.lab-bg),
.landing-page :deep(.aud-bg),
.landing-page :deep(.roi-bg),
.landing-page :deep(.cmp-bg),
.landing-page :deep(.sec-bg),
.landing-page :deep(.pr-bg),
.landing-page :deep(.faq-bg) {
  background:
    radial-gradient(950px 520px at 18% -12%, #e6ecff 0%, rgba(230, 236, 255, 0) 62%),
    radial-gradient(820px 480px at 100% 10%, #f1f5ff 0%, rgba(241, 245, 255, 0) 64%),
    linear-gradient(180deg, #ffffff 0%, #f7f8ff 100%) !important;
}

.landing-page :deep(.noise),
.landing-page :deep(.big-wordmark) {
  display: none !important;
}

.landing-page :deep(.landing-section h2),
.landing-page :deep(.landing-section h3),
.landing-page :deep(.landing-section h4),
.landing-page :deep(.landing-section strong),
.landing-page :deep(.landing-section .big-value),
.landing-page :deep(.landing-section .metric-value),
.landing-page :deep(.landing-section .stat-value),
.landing-page :deep(.landing-section .plan-price) {
  color: var(--so-ink) !important;
  background: none !important;
  -webkit-text-fill-color: currentColor !important;
}

.landing-page :deep(.landing-section p),
.landing-page :deep(.landing-section li),
.landing-page :deep(.landing-section em),
.landing-page :deep(.landing-section .head p),
.landing-page :deep(.landing-section .stat-label),
.landing-page :deep(.landing-section .stat-source),
.landing-page :deep(.landing-section .chart-head span),
.landing-page :deep(.landing-section .meta-label),
.landing-page :deep(.landing-section .period),
.landing-page :deep(.landing-section .plan-tag),
.landing-page :deep(.landing-section .acc-body),
.landing-page :deep(.landing-section .footer) {
  color: var(--so-mute) !important;
}

.landing-page :deep(.landing-section .kicker),
.landing-page :deep(.landing-section .cta-tag),
.landing-page :deep(.landing-section .panel-tag),
.landing-page :deep(.landing-section .side-tag),
.landing-page :deep(.landing-section .status-pill),
.landing-page :deep(.landing-section .featured-tag),
.landing-page :deep(.landing-section .save-badge),
.landing-page :deep(.landing-section .sandbox-tag) {
  background: var(--so-badge-bg) !important;
  color: var(--so-badge) !important;
  border: 1px solid var(--so-badge-line) !important;
  box-shadow: none !important;
}

.landing-page :deep(.landing-section .stat-card),
.landing-page :deep(.landing-section .calc),
.landing-page :deep(.landing-section .slider-block),
.landing-page :deep(.landing-section .res-line),
.landing-page :deep(.landing-section .window),
.landing-page :deep(.landing-section .preset),
.landing-page :deep(.landing-section .stage-card),
.landing-page :deep(.landing-section .track),
.landing-page :deep(.landing-section .tab),
.landing-page :deep(.landing-section .panel),
.landing-page :deep(.landing-section .metric-card),
.landing-page :deep(.landing-section .logo-placeholder),
.landing-page :deep(.landing-section .mode-card .front),
.landing-page :deep(.landing-section .mode-card .back),
.landing-page :deep(.landing-section .control-card),
.landing-page :deep(.landing-section .big-card),
.landing-page :deep(.landing-section .split-bar),
.landing-page :deep(.landing-section .meta),
.landing-page :deep(.landing-section .chart),
.landing-page :deep(.landing-section .email-form),
.landing-page :deep(.landing-section .slider),
.landing-page :deep(.landing-section .side),
.landing-page :deep(.landing-section .dash),
.landing-page :deep(.landing-section .table),
.landing-page :deep(.landing-section .plan),
.landing-page :deep(.landing-section .addon),
.landing-page :deep(.landing-section .acc-item),
.landing-page :deep(.landing-section .final-cta),
.landing-page :deep(.landing-section .footer),
.landing-page :deep(.landing-section .report),
.landing-page :deep(.landing-section .composer input),
.landing-page :deep(.landing-section .composer button),
.landing-page :deep(.landing-section .window-bar),
.landing-page :deep(.landing-section .chat-head),
.landing-page :deep(.landing-section .chat-scroll) {
  background: #ffffff !important;
  border: 1px solid var(--so-line) !important;
  color: var(--so-ink-2) !important;
  box-shadow: 0 1px 2px rgba(15, 18, 40, 0.04), 0 8px 24px rgba(15, 18, 40, 0.05) !important;
}

.landing-page :deep(.landing-section .before),
.landing-page :deep(.landing-section .after) {
  background: #ffffff !important;
}

.landing-page :deep(.landing-section .cta),
.landing-page :deep(.landing-section .play-btn),
.landing-page :deep(.landing-section .preview-btn),
.landing-page :deep(.landing-section .cta-primary),
.landing-page :deep(.landing-section .report-close),
.landing-page :deep(.landing-section .ms-copy.copied) {
  background: var(--so-blue) !important;
  color: #ffffff !important;
  border: 1px solid var(--so-blue) !important;
  box-shadow: 0 10px 24px rgba(42, 63, 224, 0.24) !important;
}

.landing-page :deep(.landing-section .cta:hover),
.landing-page :deep(.landing-section .play-btn:hover),
.landing-page :deep(.landing-section .preview-btn:hover),
.landing-page :deep(.landing-section .cta-primary:hover) {
  background: var(--so-blue-press) !important;
}

.landing-page :deep(.landing-section button),
.landing-page :deep(.landing-section .mic-btn),
.landing-page :deep(.landing-section .ctl),
.landing-page :deep(.landing-section .acc-btn),
.landing-page :deep(.landing-section .preset),
.landing-page :deep(.landing-section .level-btn),
.landing-page :deep(.landing-section .region-btn),
.landing-page :deep(.landing-section .step-btn),
.landing-page :deep(.landing-section .mode-btn),
.landing-page :deep(.landing-section .tab),
.landing-page :deep(.landing-section .billing-toggle button) {
  background: #eef1ff !important;
  color: #2b2f44 !important;
  border: 1px solid #d8dbea !important;
}

.landing-page :deep(.landing-section button.active),
.landing-page :deep(.landing-section .preset.active),
.landing-page :deep(.landing-section .tab.active),
.landing-page :deep(.landing-section .step-btn.active),
.landing-page :deep(.landing-section .level-btn.active),
.landing-page :deep(.landing-section .region-btn.active),
.landing-page :deep(.landing-section .billing-toggle button.active),
.landing-page :deep(.landing-section .mode-btn.active) {
  background: var(--so-blue-soft) !important;
  color: var(--so-blue) !important;
  border-color: #cbd4ff !important;
  box-shadow: 0 0 0 3px rgba(42, 63, 224, 0.12) !important;
}

.landing-page :deep(.landing-section .stat-icon),
.landing-page :deep(.landing-section .card-icon),
.landing-page :deep(.landing-section .tab-icon),
.landing-page :deep(.landing-section .bullet-icon),
.landing-page :deep(.landing-section .mode-icon),
.landing-page :deep(.landing-section .msg-avatar),
.landing-page :deep(.landing-section [style*='--accent']) {
  background: #eef1ff !important;
  color: var(--so-blue) !important;
  --accent: #2a3fe0 !important;
}

.landing-page :deep(.landing-section .good),
.landing-page :deep(.landing-section .rb-label),
.landing-page :deep(.landing-section .check),
.landing-page :deep(.landing-section .dr-score),
.landing-page :deep(.landing-section .row-label),
.landing-page :deep(.landing-section .pipe-arrow),
.landing-page :deep(.landing-section .meta strong),
.landing-page :deep(.landing-section .chart-head strong),
.landing-page :deep(.landing-section .rec-cell.best i),
.landing-page :deep(.landing-section .rec-cell.good i),
.landing-page :deep(.landing-section .rec-cell.ok i) {
  color: var(--so-blue) !important;
  background: none !important;
}

.landing-page :deep(.landing-section .bad),
.landing-page :deep(.landing-section .error-toast),
.landing-page :deep(.landing-section .rec-cell.bad i) {
  color: var(--so-badge) !important;
  background: none !important;
}

.landing-page :deep(.landing-section input[type='range']) {
  accent-color: var(--so-blue) !important;
}

@media (max-width: 760px) {
  .container {
    width: min(1320px, calc(100% - 22px));
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
    padding: 48px 0 72px;
  }

  .hero__h1--motion {
    font-size: clamp(34px, 11vw, 46px);
  }

  .hero__line--type {
    white-space: normal;
  }
}
</style>
