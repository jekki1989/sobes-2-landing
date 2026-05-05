<template>
  <SectionScaffold id="compare" variant="compare">
    <template #bg>
      <div class="cmp-bg"></div>
    </template>

    <div class="cmp-layout">
      <div class="head reveal">
        <span class="kicker">Before / After</span>
        <h2>Сравните рутину и StageOne</h2>
        <p>Перетащите бегунок — посмотрите, как меняется процесс найма.</p>
      </div>

      <div
        ref="slider"
        class="slider reveal"
        @mousedown="startDrag"
        @touchstart="startDrag"
      >
        <div class="side before">
          <div class="side-content">
            <span class="side-tag bad">Без StageOne</span>
            <h3>Хаос календарей и Excel</h3>

            <div class="vis chaos">
              <div class="cal-tile" v-for="(c, i) in chaosCalendar" :key="i" :class="c.cls">{{ c.txt }}</div>
              <div class="excel">
                <div class="row" v-for="r in 4" :key="r">
                  <span></span><span></span><span :class="`bad-cell-${r}`"></span><span></span>
                </div>
              </div>
              <div class="error-toast">⚠ Слот занят</div>
            </div>

            <p class="side-foot bad">3–7 дней · 6+ часов сеньоров · разнобой оценок</p>
          </div>
        </div>

        <div class="side after" :style="{ clipPath: `inset(0 0 0 ${pos}%)` }">
          <div class="side-content">
            <span class="side-tag good">Со StageOne</span>
            <h3>Один процесс. Один отчёт.</h3>

            <div class="vis order">
              <div class="dash">
                <div class="dash-head">
                  <span class="dash-dot g"></span>
                  <span class="dash-dot y"></span>
                  <span class="dash-dot r"></span>
                  <span>Dashboard</span>
                </div>
                <div class="dash-row" v-for="(r, i) in orderRows" :key="i">
                  <span class="dr-name">{{ r.name }}</span>
                  <span class="dr-bar"><span :style="{ width: r.score + '%' }"></span></span>
                  <span class="dr-score">{{ r.score / 10 }}</span>
                </div>
              </div>
            </div>

            <p class="side-foot good">5 минут · автоматически · единый формат</p>
          </div>
        </div>

        <div class="divider" :style="{ left: pos + '%' }">
          <div class="divider-handle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="m9 8-4 4 4 4M15 8l4 4-4 4"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="table reveal">
        <div class="table-row table-head">
          <span></span>
          <span class="bad">До</span>
          <span class="good">После</span>
        </div>
        <div class="table-row" v-for="(row, i) in rows" :key="i">
          <span class="row-label">{{ row.label }}</span>
          <span class="cell bad">{{ row.before }}</span>
          <span class="cell good">{{ row.after }}</span>
        </div>
      </div>
    </div>
  </SectionScaffold>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import SectionScaffold from './shared/SectionScaffold.vue'

const slider = ref(null)
const pos = ref(50)
let dragging = false

function startDrag(e) {
  dragging = true
  e.preventDefault()
  move(e)
}
function move(e) {
  if (!dragging || !slider.value) return
  const r = slider.value.getBoundingClientRect()
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left
  pos.value = Math.max(0, Math.min(100, (x / r.width) * 100))
}
function end() { dragging = false }

onMounted(() => {
  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', end)
  window.addEventListener('touchmove', move)
  window.addEventListener('touchend', end)
})
onBeforeUnmount(() => {
  window.removeEventListener('mousemove', move)
  window.removeEventListener('mouseup', end)
  window.removeEventListener('touchmove', move)
  window.removeEventListener('touchend', end)
})

const chaosCalendar = [
  { txt: '10:00', cls: 'busy' }, { txt: '11:00', cls: 'free' }, { txt: '12:00', cls: 'busy' },
  { txt: '13:00', cls: 'busy' }, { txt: '14:00', cls: 'conflict' }, { txt: '15:00', cls: 'free' },
  { txt: '16:00', cls: 'busy' }, { txt: '17:00', cls: 'free' }, { txt: '18:00', cls: 'busy' },
]

const orderRows = [
  { name: 'Дмитрий К.', score: 84 },
  { name: 'Мария О.',   score: 72 },
  { name: 'Артём В.',   score: 91 },
  { name: 'Анна С.',    score: 65 },
]

const rows = [
  { label: 'Время до интервью',    before: '3–7 дней',           after: '5 минут' },
  { label: 'Стоимость скрининга',  before: '~9 800 ₽',           after: '~120 ₽' },
  { label: 'Стандартизация',       before: 'Зависит от настроения', after: 'Единый формат' },
  { label: 'Доступность 24/7',     before: 'Только в рабочие часы', after: '24/7 без слотов' },
  { label: 'Фидбек кандидату',     before: 'Редко и шаблонно',   after: 'Автоматически каждому' },
  { label: 'Масштабируемость',     before: '+1 интервьюер = +1 ставка', after: 'Линейно ссылками' },
  { label: 'Bias',                 before: 'Зависит от человека', after: 'AI калибровка' },
  { label: 'Аудит и compliance',   before: 'Нет',                after: 'Полный лог + транскрипт' },
]
</script>

<style scoped>
.cmp-bg {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, #131734 0%, #0e1230 100%);
}
.cmp-layout { display: grid; gap: 32px; }
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
.head p { margin-top: 12px; color: rgba(214,222,255,0.66); font-size: 17px; }

.slider {
  position: relative;
  height: 460px;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.08);
  cursor: ew-resize;
  user-select: none;
}

.side {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
}

.before {
  background: linear-gradient(135deg, #3a1418 0%, #1f0e1f 100%);
}
.after {
  background: linear-gradient(135deg, #0d2519 0%, #0c1c30 100%);
}

.side-content { width: 100%; max-width: 540px; text-align: center; }

.side-tag {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.side-tag.bad { background: rgba(255,91,138,0.16); color: #ff5b8a; }
.side-tag.good { background: rgba(74,222,128,0.16); color: #4ade80; }

.side h3 {
  margin-top: 14px;
  font-size: clamp(22px, 2.6vw, 30px);
  color: #fff;
  letter-spacing: -0.02em;
}

.vis {
  margin: 24px auto 18px;
  width: 100%;
  height: 240px;
  position: relative;
}

.chaos {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  align-content: center;
}
.cal-tile {
  padding: 18px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  font-family: 'Space Grotesk';
  text-align: center;
  border: 1px solid rgba(255,255,255,0.06);
  color: rgba(214,222,255,0.6);
}
.cal-tile.busy { background: rgba(255,91,138,0.18); color: #ff5b8a; border-color: rgba(255,91,138,0.3); }
.cal-tile.conflict { background: rgba(255,138,61,0.22); color: #ff8a3d; border-color: rgba(255,138,61,0.4); animation: shake 0.5s ease-in-out infinite; }
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

.excel { display: none; }

.error-toast {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 12px;
  border-radius: 8px;
  background: rgba(255,91,138,0.2);
  color: #ff5b8a;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid rgba(255,91,138,0.4);
  animation: float-toast 2.4s ease-in-out infinite;
}
@keyframes float-toast {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-4px); }
}

.order .dash {
  text-align: left;
  border-radius: 14px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dash-head {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  font-size: 11px;
  color: rgba(214,222,255,0.5);
  font-weight: 700;
}
.dash-dot {
  width: 8px; height: 8px; border-radius: 999px;
}
.dash-dot.r { background: #ff5b5b; }
.dash-dot.y { background: #ffaf3d; }
.dash-dot.g { background: #4ade80; }

.dash-row {
  display: grid;
  grid-template-columns: 100px 1fr 36px;
  gap: 10px;
  align-items: center;
  font-size: 12px;
  color: rgba(214,222,255,0.7);
}
.dr-name { font-weight: 600; }
.dr-bar {
  height: 6px;
  background: rgba(255,255,255,0.06);
  border-radius: 999px;
  overflow: hidden;
}
.dr-bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #4ade80, #79e1ff);
  border-radius: 999px;
  animation: barfill 0.8s ease forwards;
  transform-origin: 0;
}
@keyframes barfill { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.dr-score {
  font-family: 'Space Grotesk';
  color: #4ade80;
  font-weight: 800;
  font-size: 14px;
}

.side-foot {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.side-foot.bad { color: #ff8aaa; }
.side-foot.good { color: #4ade80; }

.divider {
  position: absolute;
  top: 0; bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, transparent, #fff, transparent);
  transform: translateX(-50%);
  pointer-events: none;
  box-shadow: 0 0 14px rgba(255,255,255,0.5);
}
.divider-handle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 56px; height: 56px;
  border-radius: 999px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1a1648;
  cursor: grab;
  box-shadow: 0 12px 32px rgba(0,0,0,0.4);
  pointer-events: auto;
  transition: transform 0.2s;
}
.divider-handle:hover { transform: translate(-50%, -50%) scale(1.1); }

.table {
  border-radius: 18px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  overflow: hidden;
}
.table-row {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr;
  gap: 12px;
  padding: 14px 22px;
  align-items: center;
  font-size: 14px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.table-row:last-child { border-bottom: none; }
.table-head {
  background: rgba(255,255,255,0.04);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 800;
}
.row-label { color: rgba(214,222,255,0.7); font-weight: 600; }
.cell {
  padding: 6px 12px;
  border-radius: 10px;
  font-weight: 600;
}
.cell.bad { background: rgba(255,91,138,0.1); color: #ff8aaa; }
.cell.good { background: rgba(74,222,128,0.12); color: #4ade80; }
.table-head .bad { color: #ff8aaa; }
.table-head .good { color: #4ade80; }

@media (max-width: 700px) {
  .slider { height: 380px; }
  .table-row { grid-template-columns: 1fr; gap: 4px; padding: 14px; }
  .table-head { display: none; }
  .row-label { font-weight: 700; color: #fff; }
}
</style>
