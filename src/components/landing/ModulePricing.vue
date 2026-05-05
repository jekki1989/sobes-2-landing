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
import { ref, computed } from 'vue'
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
    radial-gradient(50% 50% at 50% 0%, rgba(184,55,255,0.18), transparent 60%),
    radial-gradient(40% 50% at 0% 100%, rgba(121,225,255,0.14), transparent 60%),
    linear-gradient(180deg, #0e1230 0%, #14193a 100%);
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
  letter-spacing: 0.18em; text-transform: uppercase; color: #b837ff;
  padding: 6px 12px; background: rgba(184,55,255,0.12);
  border-radius: 999px; border: 1px solid rgba(184,55,255,0.3);
}
.head h2 { margin-top: 18px; font-size: clamp(34px, 4vw, 56px); line-height: 1.05; letter-spacing: -0.03em; color: #fff; }
.head p { margin-top: 12px; color: rgba(214,222,255,0.66); font-size: 17px; }

.billing-toggle {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border-radius: 14px;
  background: rgba(8,10,30,0.6);
  border: 1px solid rgba(255,255,255,0.08);
  width: fit-content;
}
.billing-toggle button {
  position: relative;
  padding: 10px 22px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: rgba(214,222,255,0.55);
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
  background: linear-gradient(135deg, #2c4dff, #b837ff);
  color: #fff;
  box-shadow: 0 8px 20px -6px rgba(124,99,255,0.5);
}
.save-badge {
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(74,222,128,0.18);
  color: #4ade80;
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
  background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
  border: 1px solid rgba(255,255,255,0.08);
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: transform 0.3s, box-shadow 0.3s;
}
.plan:hover { transform: translateY(-4px); }

.plan.featured {
  background: linear-gradient(180deg, rgba(124,99,255,0.18), rgba(184,55,255,0.08));
  border-color: rgba(124,99,255,0.5);
  box-shadow: 0 28px 60px -20px rgba(124,99,255,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
  transform: scale(1.04);
}
.plan.featured:hover { transform: scale(1.04) translateY(-4px); }

.featured-tag {
  position: absolute;
  top: -14px; left: 50%;
  transform: translateX(-50%);
  padding: 6px 14px;
  border-radius: 999px;
  background: linear-gradient(135deg, #2c4dff, #b837ff);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  box-shadow: 0 12px 28px -8px rgba(124,99,255,0.6);
}

.plan-name {
  font-family: 'Space Grotesk';
  font-size: 22px;
  color: #fff;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.plan-tag {
  margin-top: 4px;
  color: rgba(214,222,255,0.6);
  font-size: 13px;
}

.plan-price {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}
.plan-price strong {
  font-family: 'Space Grotesk';
  font-size: clamp(40px, 4vw, 54px);
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #fff;
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
  background: linear-gradient(120deg, #79e1ff, #b9a8ff, #ff5bd5);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.custom-price { font-size: 36px !important; }
.period { color: rgba(214,222,255,0.5); font-size: 13px; }

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
  background: linear-gradient(135deg, #2c4dff, #b837ff);
  color: #fff;
  box-shadow: 0 14px 30px -8px rgba(124,99,255,0.55);
}
.cta-primary:hover { transform: translateY(-1px); }
.cta-light {
  background: rgba(255,255,255,0.06);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.1);
}
.cta-light:hover { background: rgba(255,255,255,0.12); }

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
  color: #e7ecff;
  font-size: 13px;
}
.plan-features li svg {
  color: #4ade80;
  background: rgba(74,222,128,0.16);
  padding: 3px;
  border-radius: 999px;
  flex-shrink: 0;
}

.plan-compare {
  padding-top: 16px;
  border-top: 1px solid rgba(255,255,255,0.06);
  font-size: 12px;
  color: rgba(214,222,255,0.5);
}

.addons {
  padding: 28px;
  border-radius: 22px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
}
.addons-title {
  display: block;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(214,222,255,0.5);
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
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
}
.addon strong { display: block; color: #fff; font-size: 14px; }
.addon span { display: block; margin-top: 4px; color: rgba(214,222,255,0.6); font-size: 12px; }

@media (max-width: 1100px) {
  .plans { grid-template-columns: 1fr; }
  .plan.featured { transform: none; }
  .plan.featured:hover { transform: translateY(-4px); }
  .addons-row { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 600px) {
  .addons-row { grid-template-columns: 1fr; }
}
</style>
