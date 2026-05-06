<template>
  <SectionScaffold id="faq" variant="faq">
    <template #bg>
      <div class="faq-bg"></div>
      <div class="big-wordmark" aria-hidden="true">StageOne</div>
    </template>

    <div class="faq-layout">
      <div class="faq-col reveal">
        <span class="kicker">FAQ</span>
        <h2>Частые вопросы</h2>
        <div class="accordion">
          <div
            v-for="(q, i) in faqs"
            :key="i"
            :class="['acc-item', { open: openIdx === i }]"
            @click="onOpenItemAreaClick(i, $event)"
          >
            <button class="acc-btn" @click="toggleFaq(i)">
              <span class="acc-num">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="acc-q">{{ q.q }}</span>
              <span class="acc-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <path d="M5 12h14M12 5v14"/>
                </svg>
              </span>
            </button>
            <Transition
              :css="false"
              @before-enter="onBeforeEnter"
              @enter="onEnter"
              @after-enter="onAfterEnter"
              @before-leave="onBeforeLeave"
              @leave="onLeave"
              @after-leave="onAfterLeave"
            >
              <div v-if="openIdx === i" class="acc-body">
                <p>{{ q.a }}</p>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <div class="cta-col reveal">
        <div class="final-cta">
          <span class="cta-tag">
            <span class="dot"></span>
            Готовы к старту?
          </span>
          <h2 class="cta-headline">
            Освободите календарь сеньоров — пусть AI ведёт первый этап
          </h2>
          <p>5 минут на регистрацию. 5 интервью бесплатно. Без банковской карты.</p>

          <div class="cta-actions">
            <MagneticButton variant="primary" large to="/register">
              Создать первое интервью
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </MagneticButton>
            <MagneticButton variant="ghost" large to="/login">
              Уже есть аккаунт →
            </MagneticButton>
          </div>

          <div class="trust-row">
            <span><span class="check">✓</span> Без карты</span>
            <span><span class="check">✓</span> 5 интервью бесплатно</span>
            <span><span class="check">✓</span> Отмена в один клик</span>
          </div>
        </div>
      </div>
    </div>
  </SectionScaffold>
</template>

<script setup>
import { ref } from 'vue'
import SectionScaffold from './shared/SectionScaffold.vue'
import MagneticButton from './shared/MagneticButton.vue'

const openIdx = ref(0)

function toggleFaq(i) {
  openIdx.value = openIdx.value === i ? -1 : i
}

function onOpenItemAreaClick(i, event) {
  if (openIdx.value !== i) return
  if (event.target.closest('.acc-btn')) return
  openIdx.value = -1
}

function onBeforeEnter(el) {
  el.style.height = '0px'
  el.style.opacity = '0'
  el.style.overflow = 'hidden'
}

function onEnter(el, done) {
  const targetHeight = `${el.scrollHeight}px`
  el.style.transition = 'height 280ms cubic-bezier(0.22, 1, 0.36, 1), opacity 160ms ease'
  requestAnimationFrame(() => {
    el.style.height = targetHeight
    el.style.opacity = '1'
  })
  window.setTimeout(done, 280)
}

function onAfterEnter(el) {
  el.style.height = 'auto'
  el.style.opacity = '1'
  el.style.transition = ''
}

function onBeforeLeave(el) {
  el.style.height = `${el.scrollHeight}px`
  el.style.opacity = '1'
  el.style.overflow = 'hidden'
}

function onLeave(el, done) {
  // Force reflow so the browser starts leave animation from exact current height.
  void el.offsetHeight
  el.style.transition = 'height 240ms cubic-bezier(0.4, 0, 1, 1), opacity 110ms ease'
  requestAnimationFrame(() => {
    el.style.height = '0px'
    el.style.opacity = '0'
  })
  window.setTimeout(done, 240)
}

function onAfterLeave(el) {
  el.style.height = '0px'
  el.style.opacity = '0'
  el.style.transition = ''
}

const faqs = [
  { q: 'Заменяет ли AI живого интервьюера?', a: 'AI заменяет первый этап скрининга — самые повторяющиеся 70% работы. Финальное собеседование и оффер всегда остаются за человеком.' },
  { q: 'На каких языках работает аватар?', a: 'Русский, английский — нативно. Через ElevenLabs и Yandex SpeechKit поддерживаем 27+ языков. Можно подключить custom voice clone.' },
  { q: 'Можно ли использовать свой LLM или voice provider?', a: 'Да. В Enterprise-плане подключается ваш OpenAI-compatible endpoint, Anthropic ключ или локальный inference. Для голоса — ElevenLabs, Yandex или OpenAI TTS.' },
  { q: 'Что с защитой персональных данных кандидатов?', a: 'PII шифруется AES-256 at rest. Транспорт — TLS 1.3 / WSS. Опция хранения в РФ-контуре для соответствия 152-ФЗ. Полный аудит-лог.' },
  { q: 'Сколько длится интеграция?', a: 'Self-service для Starter и Pro — за 5 минут. Enterprise (SSO, on-premise, кастомный аватар) — обычно 2–4 недели с нашей стороны.' },
  { q: 'Можно ли кастомизировать аватар?', a: 'Да. В Pro доступны 4 готовых аватара. В Enterprise — voice cloning под голос CEO и кастомный аватар с lip-sync через Fal или SIMLI.' },
  { q: 'Поддерживаются ли видео-интервью?', a: 'Да, через SIMLI (real-time) или Fal lip-sync (предзаписанный). 720p / 24–30fps. Автозапись + транскрипт.' },
  { q: 'Что, если кандидат списывает?', a: 'AI отслеживает паттерны: нетипичные паузы, копирование текста, переключение фокуса окна. В roadmap — proctoring через камеру и анализ голосовой активности.' },
  { q: 'Как происходит оплата?', a: 'Карта или счёт от юрлица. Можно оплатить за месяц или за год (−20%). Лимиты обнуляются ежемесячно, неиспользованные интервью не переносятся.' },
]
</script>

<style scoped>
.faq-bg {
  position: absolute; inset: 0;
  background:
    radial-gradient(60% 60% at 50% 0%, color-mix(in srgb, var(--so-brand) 12%, transparent), transparent 60%),
    linear-gradient(180deg, var(--so-surface) 0%, var(--so-surface) 100%);
}
.big-wordmark {
  position: absolute;
  bottom: -2vw;
  left: 50%;
  transform: translateX(-50%);
  font-family: inherit;
  font-weight: 800;
  font-size: clamp(120px, 22vw, 320px);
  letter-spacing: -0.06em;
  background: linear-gradient(180deg, color-mix(in srgb, var(--so-brand) 12%, transparent), color-mix(in srgb, var(--so-brand) 12%, transparent));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  pointer-events: none;
  white-space: nowrap;
  line-height: 0.85;
}

.faq-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 56px;
  align-items: start;
}

.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

.kicker {
  display: inline-block; font-size: 12px; font-weight: 800;
  letter-spacing: 0.18em; text-transform: uppercase; color: var(--so-brand);
  padding: 6px 12px; background: color-mix(in srgb, var(--so-brand) 12%, transparent);
  border-radius: 999px; border: 1px solid color-mix(in srgb, var(--so-brand) 12%, transparent);
}

.faq-col h2 {
  margin: 18px 0 0;
  font-size: clamp(34px, 4vw, 56px);
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: var(--so-surface);
}

.accordion {
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.acc-item {
  border-radius: 14px;
  background: var(--so-surface);
  border: 1px solid var(--so-line);
  overflow: visible;
  background-clip: padding-box;
  transition: 0.3s;
}
.acc-item.open {
  background: var(--so-surface);
  border-color: var(--so-brand);
  cursor: pointer;
}

.acc-item.open .acc-body,
.acc-item.open .acc-body * {
  cursor: pointer;
}

.acc-btn {
  width: 100%;
  display: grid;
  grid-template-columns: 36px 1fr 28px;
  gap: 14px;
  align-items: center;
  padding: 12px 18px;
  border: none;
  background: transparent;
  color: var(--so-surface);
  font: inherit;
  text-align: left;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  outline: none;
  box-shadow: none;
  border-radius: inherit;
  -webkit-tap-highlight-color: transparent;
}
.acc-btn:focus,
.acc-btn:focus-visible {
  outline: none;
  box-shadow: none;
}
.acc-btn::-moz-focus-inner {
  border: 0;
}
.acc-num {
  font-family: inherit;
  font-weight: 800;
  color: var(--so-brand);
  font-size: 14px;
}
.acc-q { font-weight: 600; font-size: 15px; line-height: 1.4; }
.acc-icon {
  width: 28px; height: 28px;
  border-radius: 999px;
  background: var(--so-surface);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--so-brand);
  transition: transform 0.3s;
}
.acc-item.open .acc-icon {
  transform: rotate(45deg);
  background: var(--so-brand);
  color: var(--so-surface);
}

.acc-body {
  overflow: hidden;
  will-change: height, opacity;
}
.acc-body > p {
  margin: 0;
  padding: 12px 18px 12px 68px;
  color: var(--so-mute);
  font-size: 14px;
  line-height: 1.6;
}

.cta-col {
  display: flex;
  flex-direction: column;
  gap: 28px;
  /* Align right column top edge with the first FAQ row, not with the H2 */
  margin-top: calc(18px + (clamp(36px, 4.5vw, 56px) * 1.05) + 28px);
}

.final-cta {
  padding: 36px;
  border-radius: 28px;
  background:
    radial-gradient(80% 80% at 100% 0%, color-mix(in srgb, var(--so-brand) 12%, transparent), transparent 70%),
    radial-gradient(60% 60% at 0% 100%, color-mix(in srgb, var(--so-brand) 10%, transparent), transparent 70%),
    linear-gradient(180deg, color-mix(in srgb, var(--so-brand) 12%, transparent), color-mix(in srgb, var(--so-brand) 12%, transparent));
  border: 1px solid color-mix(in srgb, var(--so-brand) 12%, transparent);
  box-shadow: 0 32px 80px -20px color-mix(in srgb, var(--so-brand) 12%, transparent);
  position: relative;
  overflow: hidden;
}

.cta-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--so-brand) 10%, transparent);
  color: var(--so-brand);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.cta-tag .dot {
  width: 8px; height: 8px;
  border-radius: 999px;
  background: var(--so-brand);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--so-brand) 10%, transparent);
  animation: pulse 1.6s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 4px color-mix(in srgb, var(--so-brand) 10%, transparent); }
  50% { box-shadow: 0 0 0 10px color-mix(in srgb, var(--so-brand) 10%, transparent); }
}

.cta-headline {
  margin-top: 18px;
  font-size: clamp(28px, 3.4vw, 44px);
  color: var(--so-surface);
  letter-spacing: -0.03em;
  line-height: 1.05;
}
.final-cta p {
  margin-top: 14px;
  color: var(--so-mute);
  font-size: 16px;
}
.cta-actions {
  margin-top: 28px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.trust-row {
  margin-top: 22px;
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--so-mute);
  font-weight: 600;
}
.check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px; height: 18px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--so-brand) 10%, transparent);
  color: var(--so-brand);
  font-weight: 800;
  margin-right: 6px;
}

@media (max-width: 1100px) {
  .faq-layout { grid-template-columns: 1fr; }
  .cta-col { margin-top: 0; }
}

/* Palette pass */
.faq-bg,
.big-wordmark {
  display: none;
}

.faq-col h2,
.cta-headline {
  color: var(--so-ink);
  font-size: clamp(36px, 4.5vw, 56px);
}

.kicker,
.final-cta p,
.trust-row {
  color: var(--so-mute);
}

.kicker {
  padding: 0;
  background: transparent;
  border: 0;
  border-radius: 0;
  letter-spacing: 0.12em;
}

.acc-item,
.final-cta {
  background: var(--so-surface);
  border-color: var(--so-line);
  border-radius: 8px;
  box-shadow: none;
}

.acc-item.open {
  background: var(--so-surface);
  border-color: var(--so-brand);
}

.acc-btn,
.acc-q {
  color: var(--so-ink);
}

.acc-num,
.acc-icon,
.check {
  color: var(--so-brand);
}

.acc-icon,
.check,
.cta-tag {
  background: var(--so-surface);
  border: 1px solid var(--so-line);
}

.acc-item.open .acc-icon {
  background: var(--so-brand);
  color: var(--so-surface);
}

.cta-tag {
  color: var(--so-brand);
}

.cta-tag .dot {
  background: var(--so-brand);
  box-shadow: none;
}

</style>
