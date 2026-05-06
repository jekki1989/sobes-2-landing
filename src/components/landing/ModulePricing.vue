<template>
  <SectionScaffold id="pricing" variant="pricing">
    <template #bg>
      <div class="pr-bg"></div>
    </template>

    <div class="pr-layout">
      <div class="head reveal">
        <span class="kicker">Pricing</span>
        <h2>Простые тарифы. Никаких скрытых платежей.</h2>
        <p>Оплачиваете только то, что используете. Можно начать бесплатно.</p>
      </div>

      <div class="billing-toggle reveal">
        <button :class="{ active: !annual }" @click="annual = false">Месяц</button>
        <button :class="{ active: annual }" @click="annual = true">
          Год
          <span class="save-badge">−20%</span>
        </button>
      </div>

      <div class="plans reveal">
        <article
          v-for="p in plans"
          :key="p.id"
          :class="['plan', { featured: p.featured }]"
        >
          <span v-if="p.featured" class="featured-tag">Чаще всего выбирают</span>
          <span class="plan-name">{{ p.name }}</span>
          <p class="plan-tag">{{ p.tagline }}</p>
          <div class="plan-price">
            <strong v-if="p.price !== null">
              <span class="cur">₽</span>
              <transition name="price" mode="out-in">
                <span :key="`${p.id}-${annual}`">{{ formatPrice(p) }}</span>
              </transition>
            </strong>
            <strong v-else class="custom-price">Custom</strong>
            <span class="period" v-if="p.price">/ месяц{{ annual ? ' (при оплате за год)' : '' }}</span>
          </div>

          <div class="plan-cta">
            <router-link
              :to="p.cta.to"
              :class="['cta', p.featured ? 'cta-primary' : 'cta-light']"
            >
              {{ p.cta.text }}
            </router-link>
          </div>

          <ul class="plan-features">
            <li v-for="f in p.features" :key="f">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="m5 12 5 5L20 7"/>
              </svg>
              {{ f }}
            </li>
          </ul>

          <div v-if="p.compare" class="plan-compare">
            <span>≈ {{ p.compare }}</span>
          </div>
        </article>
      </div>

      <div class="addons reveal">
        <span class="addons-title">Add-ons для Pro и Enterprise</span>
        <div class="addons-row">
          <div class="addon" v-for="a in addons" :key="a.title">
            <strong>{{ a.title }}</strong>
            <span>{{ a.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </SectionScaffold>
</template>

<script setup>
import { ref } from 'vue'
import SectionScaffold from './shared/SectionScaffold.vue'

const annual = ref(false)

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Для первой воронки и тестов',
    price: 0,
    annualPrice: 0,
    features: [
      '5 интервью в месяц',
      'Voice + Text режимы',
      '1 голос аватара',
      'Стандартный отчёт',
      'Email-поддержка',
    ],
    cta: { text: 'Начать бесплатно', to: '/register' },
    compare: '0 ₽ навсегда — без карты',
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'Для растущих команд',
    price: 4990,
    annualPrice: 3990,
    featured: true,
    features: [
      '100 интервью в месяц',
      'Все 3 режима (voice, text, video)',
      'Все голоса и аватары',
      'Кастомизация отчёта',
      'ATS-интеграции (Greenhouse, Huntflow)',
      'Приоритетная поддержка',
      'Аудит-лог',
    ],
    cta: { text: 'Попробовать Pro', to: '/register' },
    compare: '~50 ₽ за интервью vs ~9 800 ₽ у живого интервьюера',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Для масштабного найма',
    price: null,
    features: [
      'Безлимитные интервью',
      'Custom аватар + voice cloning',
      'White label · ваш домен',
      'On-premise / VPC deployment',
      'SSO (SAML, OIDC)',
      'SLA 99.9% + dedicated support',
      'Свой LLM / TTS provider',
    ],
    cta: { text: 'Связаться с нами', to: '/register' },
    compare: 'Свой контур, свой бренд',
  },
]

function formatPrice(p) {
  const v = annual.value ? p.annualPrice : p.price
  return v.toLocaleString('ru-RU')
}

const addons = [
  { title: 'Voice cloning',  text: 'Клонирование голоса CEO или брендового спикера' },
  { title: 'Custom avatar',  text: 'Аватар под ваш бренд с lip-sync' },
  { title: 'On-premise',     text: 'Развёртывание в вашем VPC / k8s кластере' },
  { title: 'Свой LLM',       text: 'Подключение Claude / GPT / Llama по вашему ключу' },
]
</script>

<style scoped>
.pr-bg {
  position: absolute; inset: 0;
  background:
    radial-gradient(50% 50% at 50% 0%, color-mix(in srgb, var(--so-brand) 12%, transparent), transparent 60%),
    radial-gradient(40% 50% at 0% 100%, color-mix(in srgb, var(--so-brand) 10%, transparent), transparent 60%),
    linear-gradient(180deg, var(--so-surface) 0%, var(--so-surface) 100%);
}

.pr-layout { display: grid; gap: 36px; }
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

.head { max-width: 760px; }
.kicker {
  display: inline-block; font-size: 12px; font-weight: 800;
  letter-spacing: 0.18em; text-transform: uppercase; color: var(--so-brand);
  padding: 6px 12px; background: color-mix(in srgb, var(--so-brand) 12%, transparent);
  border-radius: 999px; border: 1px solid color-mix(in srgb, var(--so-brand) 12%, transparent);
}
.head h2 { margin-top: 18px; font-size: clamp(34px, 4vw, 56px); line-height: 1.05; letter-spacing: -0.03em; color: var(--so-surface); }
.head p { margin-top: 12px; color: var(--so-mute); font-size: 17px; }

.billing-toggle {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border-radius: 14px;
  background: transparent;
  border: 1px solid var(--so-surface);
  width: fit-content;
}
.billing-toggle button {
  position: relative;
  padding: 10px 22px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: var(--so-mute);
  font: inherit;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: 0.25s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.billing-toggle button.active {
  background: var(--so-brand);
  color: var(--so-surface);
  box-shadow: 0 8px 20px -6px color-mix(in srgb, var(--so-brand) 12%, transparent);
}
.save-badge {
  padding: 2px 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--so-brand) 10%, transparent);
  color: var(--so-brand);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.05em;
}

.plans {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  align-items: stretch;
}

.plan {
  position: relative;
  padding: 32px;
  border-radius: 24px;
  background: linear-gradient(180deg, var(--so-surface), var(--so-surface));
  border: 1px solid var(--so-surface);
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: transform 0.3s, box-shadow 0.3s;
}
.plan:hover { transform: translateY(-4px); }

.plan.featured {
  background: linear-gradient(180deg, color-mix(in srgb, var(--so-brand) 12%, transparent), color-mix(in srgb, var(--so-brand) 12%, transparent));
  border-color: color-mix(in srgb, var(--so-brand) 12%, transparent);
  box-shadow: 0 28px 60px -20px color-mix(in srgb, var(--so-brand) 12%, transparent), inset 0 1px 0 var(--so-surface);
  transform: scale(1.04);
}
.plan.featured:hover { transform: scale(1.04) translateY(-4px); }

.featured-tag {
  position: absolute;
  top: -14px; left: 50%;
  transform: translateX(-50%);
  padding: 6px 14px;
  border-radius: 999px;
  background: var(--so-brand);
  color: var(--so-surface);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  box-shadow: 0 12px 28px -8px color-mix(in srgb, var(--so-brand) 12%, transparent);
}

.plan-name {
  font-family: inherit;
  font-size: 22px;
  color: var(--so-surface);
  font-weight: 800;
  letter-spacing: -0.02em;
}
.plan-tag {
  margin-top: 4px;
  color: var(--so-mute);
  font-size: 13px;
}

.plan-price {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}
.plan-price strong {
  font-family: inherit;
  font-size: clamp(40px, 4vw, 54px);
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--so-surface);
  line-height: 1;
  display: inline-flex;
  align-items: baseline;
}
.plan-price .cur {
  font-size: 0.5em;
  opacity: 0.7;
  margin-right: 2px;
}
.plan.featured .plan-price strong {
  background: linear-gradient(120deg, var(--so-brand), var(--so-brand), var(--so-brand));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.custom-price { font-size: 36px !important; }
.period { color: var(--so-mute); font-size: 13px; }

.price-enter-from { opacity: 0; transform: translateY(8px); }
.price-enter-active { transition: 0.3s; }
.price-leave-to { opacity: 0; transform: translateY(-8px); }
.price-leave-active { transition: 0.2s; position: absolute; }

.plan-cta { display: grid; }
.cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 22px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
  transition: 0.2s;
}
.cta-primary {
  background: var(--so-brand);
  color: var(--so-surface);
  box-shadow: none;
}
.cta-primary:hover { transform: translateY(-1px); }
.cta-light {
  background: var(--so-surface);
  color: var(--so-surface);
  border: 1px solid var(--so-surface);
}
.cta-light:hover { background: var(--so-surface); }

.plan-features {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}
.plan-features li {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--so-ink);
  font-size: 13px;
}
.plan-features li svg {
  color: var(--so-brand);
  background: color-mix(in srgb, var(--so-brand) 10%, transparent);
  padding: 3px;
  border-radius: 999px;
  flex-shrink: 0;
}

.plan-compare {
  padding-top: 16px;
  border-top: 1px solid var(--so-surface);
  font-size: 12px;
  color: var(--so-mute);
}

.addons {
  padding: 28px;
  border-radius: 22px;
  background: var(--so-surface);
  border: 1px solid var(--so-surface);
}
.addons-title {
  display: block;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--so-mute);
  font-weight: 800;
  margin-bottom: 18px;
}
.addons-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}
.addon {
  padding: 14px 16px;
  border-radius: 12px;
  background: var(--so-surface);
  border: 1px solid var(--so-surface);
}
.addon strong { display: block; color: var(--so-surface); font-size: 14px; }
.addon span { display: block; margin-top: 4px; color: var(--so-mute); font-size: 12px; }

@media (max-width: 1100px) {
  .plans { grid-template-columns: 1fr; }
  .plan.featured { transform: none; }
  .plan.featured:hover { transform: translateY(-4px); }
  .addons-row { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 600px) {
  .addons-row { grid-template-columns: 1fr; }
}

/* Palette pass */
.pr-bg {
  background: transparent;
}

.head h2 {
  color: var(--so-ink);
  font-size: clamp(36px, 4.5vw, 56px);
}

.head p,
.plan-tag,
.period,
.plan-compare,
.addons-title,
.addon span {
  color: var(--so-mute);
}

.kicker {
  color: var(--so-mute);
  padding: 0;
  background: transparent;
  border: 0;
  border-radius: 0;
  letter-spacing: 0.12em;
}

.billing-toggle,
.plan,
.addons,
.addon {
  background: var(--so-surface);
  border-color: var(--so-line);
  box-shadow: none;
}

.billing-toggle,
.plan,
.addons {
  border-radius: 8px;
}

.billing-toggle button {
  background: var(--so-surface);
  color: var(--so-mute);
}

.billing-toggle button.active {
  background: var(--so-surface);
  color: var(--so-brand);
  box-shadow: none;
  border: 1px solid var(--so-brand);
}

.save-badge,
.featured-tag {
  background: var(--so-surface);
  color: var(--so-brand);
  border: 1px solid var(--so-line);
  box-shadow: none;
}

.plan:hover,
.plan.featured,
.plan.featured:hover {
  transform: none;
}

.plan.featured {
  background: var(--so-surface);
  border-color: var(--so-brand);
}

.plan-name,
.plan-price strong,
.addon strong,
.plan-features li,
.plan.featured .plan-price strong {
  color: var(--so-ink);
  background: none;
}

.plan-features li svg {
  color: var(--so-brand);
  background: var(--so-surface);
}

.cta-primary {
  background: var(--so-brand);
  color: var(--so-surface);
  box-shadow: none;
}

.cta-light {
  background: var(--so-surface);
  color: var(--so-ink);
  border-color: var(--so-line);
}

.cta-light:hover,
.cta-primary:hover {
  transform: none;
  border-color: var(--so-brand);
}
</style>
