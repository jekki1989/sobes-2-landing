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
          >
            <button class="acc-btn" @click="openIdx = openIdx === i ? -1 : i">
              <span class="acc-num">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="acc-q">{{ q.q }}</span>
              <span class="acc-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <path d="M5 12h14M12 5v14"/>
                </svg>
              </span>
            </button>
            <div class="acc-body">
              <p>{{ q.a }}</p>
            </div>
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

        <footer class="footer">
          <div class="footer-grid">
            <div class="footer-brand">
              <div class="brand-mark">
                <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="footer-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#79e1ff" />
                      <stop offset="50%" stop-color="#7c63ff" />
                      <stop offset="100%" stop-color="#b837ff" />
                    </linearGradient>
                  </defs>
                  <path d="M20 2.8 35 11.4v17.2L20 37.2 5 28.6V11.4L20 2.8Z" fill="url(#footer-grad)" opacity="0.35" />
                  <path d="M20 7.7 30.7 13.8v12.4L20 32.3 9.3 26.2V13.8L20 7.7Z" fill="url(#footer-grad)" />
                  <path d="M20 13.2 25.6 16.5v7L20 26.8l-5.6-3.3v-7L20 13.2Z" fill="#ffffff" opacity="0.9" />
                </svg>
              </div>
              <strong>StageOne</strong>
              <p>AI-платформа для технических интервью. Скрининг, видеоаватар, отчёты.</p>
            </div>
            <div class="footer-col">
              <span>Продукт</span>
              <a href="#hero">Возможности</a>
              <a href="#demo">Live demo</a>
              <a href="#modes">Режимы</a>
              <a href="#pricing">Тарифы</a>
            </div>
            <div class="footer-col">
              <span>Компания</span>
              <a href="#audience">Кому подойдёт</a>
              <a href="#security">Безопасность</a>
              <a href="#roi">ROI калькулятор</a>
            </div>
            <div class="footer-col">
              <span>Контакты</span>
              <a href="mailto:hello@stageone.ai">hello@stageone.ai</a>
              <a href="/login">Войти</a>
              <a href="/register">Регистрация</a>
            </div>
          </div>
          <div class="footer-base">
            <span>© 2026 StageOne</span>
            <span>Сделано ❤ командой найма для команд найма</span>
          </div>
        </footer>
      </div>
    </div>
  </SectionScaffold>
</template>

<script setup>
import { ref } from 'vue'
import SectionScaffold from './shared/SectionScaffold.vue'
import MagneticButton from './shared/MagneticButton.vue'

const openIdx = ref(0)
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
    radial-gradient(60% 60% at 50% 0%, rgba(124,99,255,0.18), transparent 60%),
    linear-gradient(180deg, #0d1130 0%, #07091e 100%);
}
.big-wordmark {
  position: absolute;
  bottom: -2vw;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Space Grotesk';
  font-weight: 800;
  font-size: clamp(120px, 22vw, 320px);
  letter-spacing: -0.06em;
  background: linear-gradient(180deg, rgba(124,99,255,0.16), rgba(124,99,255,0));
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
  letter-spacing: 0.18em; text-transform: uppercase; color: #b9a8ff;
  padding: 6px 12px; background: rgba(124,99,255,0.12);
  border-radius: 999px; border: 1px solid rgba(124,99,255,0.3);
}

.faq-col h2 {
  margin-top: 18px;
  font-size: clamp(34px, 4vw, 56px);
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: #fff;
}

.accordion {
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.acc-item {
  border-radius: 14px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  overflow: hidden;
  transition: 0.3s;
}
.acc-item.open {
  background: rgba(255,255,255,0.06);
  border-color: rgba(124,99,255,0.4);
}

.acc-btn {
  width: 100%;
  display: grid;
  grid-template-columns: 36px 1fr 28px;
  gap: 14px;
  align-items: center;
  padding: 16px 18px;
  border: none;
  background: transparent;
  color: #fff;
  font: inherit;
  text-align: left;
  cursor: pointer;
}
.acc-num {
  font-family: 'Space Grotesk';
  font-weight: 800;
  color: #b9a8ff;
  font-size: 14px;
}
.acc-q { font-weight: 600; font-size: 15px; line-height: 1.4; }
.acc-icon {
  width: 28px; height: 28px;
  border-radius: 999px;
  background: rgba(255,255,255,0.06);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #b9a8ff;
  transition: transform 0.3s;
}
.acc-item.open .acc-icon {
  transform: rotate(45deg);
  background: linear-gradient(135deg, #2c4dff, #b837ff);
  color: #fff;
}

.acc-body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.acc-item.open .acc-body { grid-template-rows: 1fr; }
.acc-body > p {
  overflow: hidden;
  padding: 0 18px;
}
.acc-item.open .acc-body > p {
  padding: 0 18px 18px 68px;
  color: rgba(214,222,255,0.7);
  font-size: 14px;
  line-height: 1.6;
}

.cta-col { display: flex; flex-direction: column; gap: 28px; }

.final-cta {
  padding: 36px;
  border-radius: 28px;
  background:
    radial-gradient(80% 80% at 100% 0%, rgba(184,55,255,0.32), transparent 70%),
    radial-gradient(60% 60% at 0% 100%, rgba(121,225,255,0.22), transparent 70%),
    linear-gradient(180deg, rgba(124,99,255,0.18), rgba(184,55,255,0.06));
  border: 1px solid rgba(124,99,255,0.4);
  box-shadow: 0 32px 80px -20px rgba(124,99,255,0.5);
  position: relative;
  overflow: hidden;
}

.cta-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(74,222,128,0.16);
  color: #4ade80;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.cta-tag .dot {
  width: 8px; height: 8px;
  border-radius: 999px;
  background: #4ade80;
  box-shadow: 0 0 0 4px rgba(74,222,128,0.18);
  animation: pulse 1.6s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 4px rgba(74,222,128,0.18); }
  50% { box-shadow: 0 0 0 10px rgba(74,222,128,0); }
}

.cta-headline {
  margin-top: 18px;
  font-size: clamp(28px, 3.4vw, 44px);
  color: #fff;
  letter-spacing: -0.03em;
  line-height: 1.05;
}
.final-cta p {
  margin-top: 14px;
  color: rgba(214,222,255,0.78);
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
  color: rgba(214,222,255,0.6);
  font-weight: 600;
}
.check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px; height: 18px;
  border-radius: 999px;
  background: rgba(74,222,128,0.16);
  color: #4ade80;
  font-weight: 800;
  margin-right: 6px;
}

.footer {
  padding: 28px;
  border-radius: 22px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1fr;
  gap: 24px;
  padding-bottom: 22px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.footer-brand .brand-mark {
  width: 36px; height: 36px;
  margin-bottom: 12px;
}
.footer-brand .brand-mark svg { width: 100%; height: 100%; }
.footer-brand strong {
  font-family: 'Space Grotesk';
  font-size: 18px;
  color: #fff;
}
.footer-brand p {
  margin-top: 8px;
  font-size: 12px;
  color: rgba(214,222,255,0.55);
  line-height: 1.5;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.footer-col span {
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(214,222,255,0.4);
  font-weight: 800;
  margin-bottom: 4px;
}
.footer-col a {
  color: rgba(214,222,255,0.78);
  text-decoration: none;
  font-size: 13px;
  transition: 0.2s;
}
.footer-col a:hover { color: #fff; }

.footer-base {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 18px;
  font-size: 12px;
  color: rgba(214,222,255,0.4);
}

@media (max-width: 1100px) {
  .faq-layout { grid-template-columns: 1fr; }
}
@media (max-width: 700px) {
  .footer-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 480px) {
  .footer-grid { grid-template-columns: 1fr; }
}
</style>
