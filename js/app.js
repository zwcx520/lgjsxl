/* =========================================================
 *  FORGE 健身训练系统 - 主应用逻辑
 *  localStorage 数据持久化
 * ========================================================= */

/* ============== 数据状态 ============== */
const STORE_KEY = 'forge_fitness_data';
const SESSION_KEY = 'forge_active_session';

let state = {
  profile: { name:'FORGE', gender:'male', age:25, height:175, weight:70, goal:'bulk', level:'beginner' },
  workouts: [],          // {id, date, name, planId, duration, exercises:[{id, name, sets:[{weight,reps,done}]}]}
  measurements: [],      // {date, weight, bodyfat, chest, waist, arm, thigh}
  prs: { bench:0, squat:0, deadlift:0, opress:0, row:0 },  // 个人记录
  achievements: [],      // 已解锁成就id
  streak: 0,
  lastWorkoutDate: null,
  totalWorkouts: 0,
  trainedParts: 0,
  customParts: [],       // 自定义部位 [{key, name, icon, color}]
  customExercises: [],   // 自定义动作 [{id, partKey, name, en, difficulty, muscle, equipment, mechanic, desc, steps:[], tips:[], muscles:[]}]
  customEquipment: [],   // 自定义器材 [{name, icon}]
};

let activeSession = null;   // 当前进行中的训练
let charts = {};              // Chart.js 实例

/* ============== 工具函数 ============== */
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => el.querySelectorAll(s);
const fmtDate = (d) => new Date(d).toLocaleDateString('zh-CN', {month:'2-digit',day:'2-digit',year:'numeric'});
const todayStr = () => new Date().toISOString().split('T')[0];
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,7);

function load(){
  try{
    const saved = localStorage.getItem(STORE_KEY);
    if(saved){
      const data = JSON.parse(saved);
      state = {...state, ...data};
    }
  }catch(e){ console.warn('加载数据失败', e); }
  try{
    const sess = localStorage.getItem(SESSION_KEY);
    if(sess) activeSession = JSON.parse(sess);
  }catch(e){ activeSession = null; }
}

function save(){
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function saveSession(){
  if(activeSession){
    localStorage.setItem(SESSION_KEY, JSON.stringify(activeSession));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

/* ============== Toast 通知 ============== */
function toast(msg, type='success'){
  const c = $('#toast-container');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  const icon = type==='success'?'fa-circle-check':type==='error'?'fa-circle-xmark':'fa-circle-info';
  t.innerHTML = `<i class="fa-solid ${icon}"></i><span class="toast-msg">${msg}</span>`;
  c.appendChild(t);
  setTimeout(()=>{
    t.style.opacity='0';
    t.style.transform='translateX(100%)';
    setTimeout(()=>t.remove(),300);
  }, 2600);
}

/* ============== 模态框 ============== */
function openModal(html){
  $('#modal-content').innerHTML = `<button class="modal-close-fixed" onclick="closeModal()" aria-label="关闭"><i class="fa-solid fa-xmark"></i></button>` + html;
  $('#modal-overlay').classList.add('active');
  // 长描述文字启用跑马灯滚动
  $$('.modal-hero-desc').forEach(el=>{
    const text = el.textContent.trim();
    if(!text) return;
    // 临时单行检测是否溢出
    const prevWS = el.style.whiteSpace;
    el.style.whiteSpace = 'nowrap';
    const overflow = el.scrollWidth > el.clientWidth + 5;
    el.style.whiteSpace = prevWS;
    if(overflow){
      el.classList.add('marquee');
      el.textContent = '';
      const span = document.createElement('span');
      span.className = 'modal-hero-desc-inner';
      span.textContent = text;
      el.appendChild(span);
      const span2 = span.cloneNode(true);
      el.appendChild(span2);
    }
  });
}
function closeModal(){
  $('#modal-overlay').classList.remove('active');
  $('#modal-content').innerHTML='';
}
$('#modal-overlay').addEventListener('click', (e)=>{
  if(e.target.id==='modal-overlay') closeModal();
});

/* ============== 导航 ============== */
function navigate(page){
  $$('.page').forEach(p=>p.classList.remove('active'));
  const target = $('#page-'+page);
  if(target) target.classList.add('active');

  $$('.nav-item').forEach(n=>n.classList.toggle('active', n.dataset.page===page));
  $$('.mobile-nav-item').forEach(n=>n.classList.toggle('active', n.dataset.page===page));

  const titles = {
    dashboard:'仪表盘', plans:'训练计划', library:'动作库', bodymap:'人体部位',
    tracker:'训练追踪', progress:'进度图表', history:'训练历史', nutrition:'营养方案',
    calculator:'计算器', timer:'计时器', profile:'设置', achievements:'成就'
  };
  $('#page-title').textContent = titles[page] || 'FORGE';

  // 渲染对应页面
  const renderers = {
    dashboard: renderDashboard, plans: renderPlans, library: renderLibrary,
    bodymap: ()=>{ if(!window._bodyInited){ selectBodyPart('chest'); window._bodyInited=true; } },
    tracker: renderTracker, progress: renderProgress, history: renderHistory,
    nutrition: renderNutrition, calculator: ()=>{}, timer: ()=>{}, profile: renderProfile,
    achievements: renderAchievements
  };
  if(renderers[page]) renderers[page]();

  // 关闭移动端菜单
  $('#sidebar').classList.remove('open');
  $('#overlay').classList.remove('active');
  window.scrollTo(0,0);
}

$$('.nav-item').forEach(n=>n.addEventListener('click', ()=>navigate(n.dataset.page)));
$('#mobile-menu-btn').addEventListener('click', ()=>{
  $('#sidebar').classList.toggle('open');
  $('#overlay').classList.toggle('active');
});
$('#overlay').addEventListener('click', ()=>{
  $('#sidebar').classList.remove('open');
  $('#overlay').classList.remove('active');
});

/* ============== 仪表盘 ============== */
function renderDashboard(){
  // 统计
  const weekAgo = Date.now() - 7*24*3600*1000;
  const weekWorkouts = state.workouts.filter(w=>new Date(w.date).getTime()>weekAgo);
  const weekDuration = weekWorkouts.reduce((s,w)=>s+(w.duration||0),0);
  const totalVolume = state.workouts.reduce((s,w)=>s+workoutVolume(w),0);

  $('#stat-workouts').innerHTML = `${state.totalWorkouts}<span class="unit">次</span>`;
  $('#stat-streak').innerHTML = `${state.streak}<span class="unit">天</span>`;
  $('#stat-duration').innerHTML = `${weekDuration}<span class="unit">分钟</span>`;
  $('#stat-volume').innerHTML = `${Math.round(totalVolume).toLocaleString()}<span class="unit">kg</span>`;
  $('#footer-streak').textContent = state.streak;

  // 今日日期
  $('#today-day').textContent = new Date().toLocaleDateString('zh-CN',{weekday:'short'});

  // 周训练图表
  renderWeeklyChart(weekWorkouts);

  // 部位分布
  renderPartsChart();

  // 今日推荐
  renderTodayRecommendation();

  // 最近记录
  renderRecentWorkouts();
}

function workoutVolume(w){
  let v = 0;
  (w.exercises||[]).forEach(ex=>{
    (ex.sets||[]).forEach(s=>{
      const weight = parseFloat(s.weight)||0;
      const reps = parseInt(s.reps)||0;
      v += weight*reps;
    });
  });
  return v;
}

function renderWeeklyChart(weekWorkouts){
  const ctx = $('#chart-weekly');
  if(!ctx) return;
  if(charts.weekly) charts.weekly.destroy();

  const days = ['周日','周一','周二','周三','周四','周五','周六'];
  const today = new Date();
  const labels = [];
  const data = [];
  for(let i=6;i>=0;i--){
    const d = new Date(today);
    d.setDate(d.getDate()-i);
    labels.push(days[d.getDay()]);
    const dayStr = d.toISOString().split('T')[0];
    const ws = weekWorkouts.filter(w=>w.date.startsWith(dayStr));
    data.push(ws.reduce((s,w)=>s+(w.duration||0),0));
  }

  charts.weekly = new Chart(ctx, {
    type:'bar',
    data:{ labels, datasets:[{
      label:'训练时长(分钟)',
      data,
      backgroundColor:'rgba(212,175,55,0.6)',
      borderColor:'#d4af37',
      borderWidth:2,
      borderRadius:6,
    }]},
    options: chartOpts()
  });
}

function renderPartsChart(){
  const ctx = $('#chart-parts');
  if(!ctx) return;
  if(charts.parts) charts.parts.destroy();

  const partCount = {};
  state.workouts.forEach(w=>{
    (w.exercises||[]).forEach(ex=>{
      const e = getExerciseById(ex.id);
      if(e){
        partCount[e.partName] = (partCount[e.partName]||0)+1;
      }
    });
  });

  const labels = Object.keys(partCount);
  const data = Object.values(partCount);
  const colors = ['#ef4444','#3b82f6','#f59e0b','#a855f7','#10b981','#06b6d4','#ec4899','#dc2626','#8b5cf6'];

  if(labels.length===0){
    charts.parts = new Chart(ctx, {
      type:'doughnut',
      data:{ labels:['暂无数据'], datasets:[{ data:[1], backgroundColor:['#2a2d34' ]}]},
      options: chartOpts()
    });
    return;
  }

  charts.parts = new Chart(ctx, {
    type:'doughnut',
    data:{ labels, datasets:[{ data, backgroundColor:colors, borderColor:'#1a1c20', borderWidth:2 }]},
    options: chartOpts(true)
  });
}

function chartOpts(doughnut=false){
  return {
    responsive:true,
    maintainAspectRatio:false,
    plugins:{
      legend:{ display:doughnut, position:'bottom', labels:{ color:'#a0a0a0', font:{size:11}, padding:10 }},
      tooltip:{ backgroundColor:'#1a1c20', borderColor:'#d4af37', borderWidth:1 }
    },
    scales: doughnut ? {} : {
      x:{ ticks:{color:'#a0a0a0'}, grid:{color:'#2a2d34'}},
      y:{ ticks:{color:'#a0a0a0'}, grid:{color:'#2a2d34'}, beginAtZero:true}
    }
  };
}

function renderTodayRecommendation(){
  const el = $('#today-recommendation');
  if(state.workouts.length===0){
    el.innerHTML = `<div class="empty-state">
      <i class="fa-solid fa-flag-checkered"></i>
      <p>开始你的第一次训练吧!</p>
      <button class="btn btn-primary mt-2" onclick="navigate('plans')"><i class="fa-solid fa-play"></i> 选择计划</button>
    </div>`;
    return;
  }
  // 根据上次训练推荐
  const last = state.workouts[state.workouts.length-1];
  const lastPlan = TRAINING_PLANS.find(p=>p.id===last.planId);
  let recommend = null;
  if(lastPlan){
    const dayIdx = state.workouts.filter(w=>w.planId===lastPlan.id).length % lastPlan.days.length;
    recommend = lastPlan.days[dayIdx];
  }
  if(recommend){
    el.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <div>
          <div class="card-title">${recommend.name}</div>
          <div class="text-muted">来自计划: ${lastPlan.name}</div>
        </div>
        <button class="btn btn-primary btn-sm" onclick='startPlanDay("${lastPlan.id}", ${state.workouts.filter(w=>w.planId===lastPlan.id).length % lastPlan.days.length})'><i class="fa-solid fa-play"></i> 开始</button>
      </div>
      <div class="text-secondary text-center" style="padding:12px;">${recommend.exercises.length} 个动作 · 预计 ${recommend.exercises.length*15} 分钟</div>
    `;
  } else {
    el.innerHTML = `<div class="empty-state"><p>选择一个训练计划开始训练</p></div>`;
  }
}

function renderRecentWorkouts(){
  const el = $('#recent-workouts');
  const recent = state.workouts.slice(-5).reverse();
  if(recent.length===0){
    el.innerHTML = `<div class="empty-state"><i class="fa-solid fa-clock-rotate-left"></i><p>暂无训练记录</p></div>`;
    return;
  }
  el.innerHTML = recent.map(w=>`
    <div class="flex items-center justify-between" style="padding:10px 0;border-bottom:1px solid var(--border);">
      <div class="flex items-center gap-1">
        <div class="stat-icon" style="position:static;font-size:18px;color:var(--gold);opacity:0.7;"><i class="fa-solid fa-dumbbell"></i></div>
        <div>
          <div style="font-weight:600;font-size:14px;">${w.name||'训练'}</div>
          <div class="text-muted" style="font-size:12px;">${fmtDate(w.date)} · ${w.exercises?.length||0}动作</div>
        </div>
      </div>
      <div class="text-gold" style="font-weight:600;font-size:13px;">${Math.round(workoutVolume(w))}kg</div>
    </div>
  `).join('');
}

/* ============== 训练计划 ============== */
function renderPlans(){
  const grid = $('#plans-grid');
  grid.innerHTML = TRAINING_PLANS.map(p=>`
    <div class="plan-card">
      <div class="plan-name">${p.name}</div>
      <div class="plan-en">${p.en}</div>
      <p class="plan-desc">${p.desc}</p>
      <div class="plan-meta">
        <div class="plan-meta-item"><i class="fa-solid fa-calendar"></i> ${p.daysPerWeek}天/周</div>
        <div class="plan-meta-item"><i class="fa-solid fa-clock"></i> ${p.duration}</div>
        <div class="plan-meta-item"><i class="fa-solid fa-bullseye"></i> ${p.goal}</div>
        <div class="plan-meta-item"><i class="fa-solid fa-signal"></i> ${p.level}</div>
      </div>
      <div class="flex gap-1">
        <button class="btn btn-primary btn-sm" onclick='showPlanDetail("${p.id}")'><i class="fa-solid fa-eye"></i> 查看详情</button>
        <button class="btn btn-secondary btn-sm" onclick='startPlan("${p.id}")'><i class="fa-solid fa-play"></i> 开始计划</button>
      </div>
    </div>
  `).join('');
}

function showPlanDetail(planId){
  const p = TRAINING_PLANS.find(x=>x.id===planId);
  if(!p) return;
  const planIcons = {ppl:'fa-dumbbell', ul:'fa-person-arrows', fb:'fa-person-running', '5x5':'fa-fire', cut:'fa-scissors', hyp:'fa-bullseye'};
  const planColors = {ppl:'#ef4444', ul:'#3b82f6', fb:'#10b981', '5x5':'#f59e0b', cut:'#dc2626', hyp:'#a855f7'};
  const icon = planIcons[p.id] || 'fa-dumbbell';
  const color = planColors[p.id] || '#d4af37';

  const daysHtml = p.days.map((day,i)=>`
    <div class="day-card">
      <div class="day-card-header">
        <div class="day-card-title"><i class="fa-solid fa-circle" style="font-size:10px;color:${color};"></i>${day.name}</div>
        <button class="btn btn-primary btn-sm" onclick='startPlanDay("${p.id}",${i});closeModal();'><i class="fa-solid fa-play"></i> 开始训练</button>
      </div>
      <div class="day-card-exercises">
        ${day.exercises.map(ex=>{
          const e = getExerciseById(ex.id);
          return e ? `<div class="day-ex-chip"><i class="fa-solid fa-circle"></i><span class="ex-name">${e.name}</span><span class="ex-detail">${ex.sets}组×${ex.reps}</span></div>` : '';
        }).join('')}
      </div>
    </div>
  `).join('');

  openModal(`
    <div class="modal-hero">
      <div class="modal-hero-content">
        <div class="modal-hero-icon" style="background:linear-gradient(135deg,${color} 0%,${color}aa 100%);box-shadow:0 8px 30px ${color}50;"><i class="fa-solid ${icon}"></i></div>
        <div class="modal-hero-text">
          <div class="modal-title">${p.name}</div>
          <div class="modal-sub">${p.en}</div>
          <div class="modal-hero-desc">${p.desc}</div>
        </div>
      </div>
    </div>
    <div class="modal-body">
      <div class="modal-split">
        <div class="modal-sidebar">
          <div class="modal-info-panel mb-3">
            <div class="form-group-title"><i class="fa-solid fa-info"></i> 计划信息</div>
            <div class="modal-info-item">
              <div class="modal-info-icon"><i class="fa-solid fa-calendar"></i></div>
              <div><div class="modal-info-label">训练频率</div><div class="modal-info-value">${p.daysPerWeek}天/周</div></div>
            </div>
            <div class="modal-info-item">
              <div class="modal-info-icon"><i class="fa-solid fa-clock"></i></div>
              <div><div class="modal-info-label">周期时长</div><div class="modal-info-value">${p.duration}</div></div>
            </div>
            <div class="modal-info-item">
              <div class="modal-info-icon"><i class="fa-solid fa-bullseye"></i></div>
              <div><div class="modal-info-label">训练目标</div><div class="modal-info-value">${p.goal}</div></div>
            </div>
            <div class="modal-info-item">
              <div class="modal-info-icon"><i class="fa-solid fa-signal"></i></div>
              <div><div class="modal-info-label">难度等级</div><div class="modal-info-value">${p.level}</div></div>
            </div>
            <div class="modal-info-item">
              <div class="modal-info-icon"><i class="fa-solid fa-list-check"></i></div>
              <div><div class="modal-info-label">训练日数</div><div class="modal-info-value">${p.days.length}天</div></div>
            </div>
          </div>
          <button class="btn btn-primary btn-block" onclick='startPlan("${p.id}");closeModal();'><i class="fa-solid fa-play"></i> 从第1天开始</button>
        </div>
        <div class="modal-main">
          <div class="form-group-title"><i class="fa-solid fa-calendar-days"></i> 训练日安排</div>
          ${daysHtml}
        </div>
      </div>
    </div>
  `);
}

function showPlanPicker(){
  const planIcons = {ppl:'fa-dumbbell', ul:'fa-person-arrows', fb:'fa-person-running', '5x5':'fa-fire', cut:'fa-scissors', hyp:'fa-bullseye'};
  const planColors = {ppl:'#ef4444', ul:'#3b82f6', fb:'#10b981', '5x5':'#f59e0b', cut:'#dc2626', hyp:'#a855f7'};
  const plansHtml = TRAINING_PLANS.map(p=>{
    const icon = planIcons[p.id] || 'fa-dumbbell';
    const color = planColors[p.id] || '#d4af37';
    return `
    <div class="modal-card" style="border-top-color:${color};" onclick='startPlan("${p.id}");closeModal();'>
      <div class="modal-card-icon" style="background:${color}15;color:${color};">
        <i class="fa-solid ${icon}"></i>
      </div>
      <div class="modal-card-title">${p.name}</div>
      <div class="modal-card-sub">${p.en}</div>
      <div class="modal-card-desc">${p.desc}</div>
      <div class="modal-card-meta">
        <span class="badge badge-gold"><i class="fa-solid fa-calendar"></i> ${p.daysPerWeek}天/周</span>
        <span class="badge badge-blue"><i class="fa-solid fa-clock"></i> ${p.duration}</span>
        <span class="badge badge-green"><i class="fa-solid fa-bullseye"></i> ${p.goal}</span>
        <span class="badge badge-purple"><i class="fa-solid fa-signal"></i> ${p.level}</span>
      </div>
    </div>`;
  }).join('');
  openModal(`
    <div class="modal-hero">
      <div class="modal-hero-content">
        <div class="modal-hero-icon"><i class="fa-solid fa-clipboard-list"></i></div>
        <div class="modal-hero-text">
          <div class="modal-title">选择训练计划</div>
          <div class="modal-sub">TRAINING PLANS</div>
          <div class="modal-hero-desc">选择适合你的训练方案,每个计划都经过精心设计,覆盖不同训练目标和水平。点击卡片即可开始训练。</div>
        </div>
      </div>
    </div>
    <div class="modal-body">
      <div class="modal-card-grid">${plansHtml}</div>
    </div>
  `);
}

function startPlan(planId){
  const p = TRAINING_PLANS.find(x=>x.id===planId);
  if(!p) return;
  const dayCount = state.workouts.filter(w=>w.planId===planId).length;
  startPlanDay(planId, dayCount % p.days.length);
}

function startPlanDay(planId, dayIdx){
  const p = TRAINING_PLANS.find(x=>x.id===planId);
  if(!p || !p.days[dayIdx]) return;
  const day = p.days[dayIdx];
  activeSession = {
    id: uid(),
    date: todayStr(),
    name: day.name,
    planId: planId,
    dayIdx: dayIdx,
    startTime: Date.now(),
    exercises: day.exercises.map(ex=>{
      const e = getExerciseById(ex.id);
      return {
        id: ex.id,
        name: e?e.name:ex.id,
        targetSets: ex.sets,
        targetReps: ex.reps,
        rest: ex.rest,
        sets: Array.from({length:ex.sets}, ()=>({weight:'', reps:'', done:false}))
      };
    })
  };
  saveSession();
  navigate('tracker');
  toast('训练已开始: '+day.name);
}

/* ============== 动作库 ============== */
let currentPartFilter = 'all';

// 获取所有可选器材(内置去重 + 自定义)
function getAllEquipment(){
  const set = new Set();
  Object.keys(EXERCISE_DB).forEach(k=>EXERCISE_DB[k].exercises.forEach(e=>set.add(e.equipment)));
  (state.customEquipment||[]).forEach(eq=>set.add(eq.name));
  return Array.from(set);
}

function renderLibrary(){
  const search = ($('#ex-search')?.value || '').toLowerCase();
  let parts = getAllPartKeys();

  // 部位筛选按钮
  const filter = $('#part-filter');
  if(filter && !filter.dataset.built){
    filter.dataset.built = '1';
    filter.innerHTML = `<button class="btn btn-ghost btn-sm ${currentPartFilter==='all'?'btn-primary':''}" onclick="setPartFilter('all')">全部</button>` +
      parts.map(k=>{
        const info = getPartInfoByKey(k);
        const isCustom = !EXERCISE_DB[k];
        return `<button class="btn btn-ghost btn-sm ${currentPartFilter===k?'btn-primary':''}" onclick="setPartFilter('${k}')" style="${isCustom?'border-color:var(--gold-dark);color:var(--gold);':''}">
          ${info?info.name:k}${isCustom?' <i class="fa-solid fa-star" style="font-size:9px;"></i>':''}
        </button>`;
      }).join('');
  }

  // 过滤动作
  let exercises = [];
  if(currentPartFilter==='all'){
    parts.forEach(k=>{
      getAllExercisesByPart(k).forEach(e=>{
        const info = getPartInfoByKey(k);
        exercises.push({...e, part:k, partName:info?info.name:k, partColor:info?info.color:'#d4af37', partIcon:info?info.icon:'fa-star', custom:!EXERCISE_DB[k]});
      });
    });
  } else {
    getAllExercisesByPart(currentPartFilter).forEach(e=>{
      const info = getPartInfoByKey(currentPartFilter);
      exercises.push({...e, part:currentPartFilter, partName:info?info.name:currentPartFilter, partColor:info?info.color:'#d4af37', partIcon:info?info.icon:'fa-star', custom:!EXERCISE_DB[currentPartFilter]});
    });
  }

  if(search){
    exercises = exercises.filter(e=> e.name.toLowerCase().includes(search) || (e.en||'').toLowerCase().includes(search) || (e.muscle||'').toLowerCase().includes(search));
  }

  const grid = $('#library-grid');
  if(exercises.length===0){
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;"><i class="fa-solid fa-magnifying-glass"></i><p>未找到匹配动作</p><button class="btn btn-primary mt-2" onclick="showAddExerciseModal()"><i class="fa-solid fa-plus"></i> 添加自定义动作</button></div>`;
    return;
  }

  grid.innerHTML = exercises.map(e=>`
    <div class="exercise-card" onclick='showExerciseDetail("${e.part}","${e.id}")'>
      <div class="ex-header">
        <div>
          <div class="ex-name">${e.name}${e.custom?' <i class="fa-solid fa-star text-gold" style="font-size:10px;" title="自定义"></i>':''}</div>
          <div class="ex-en">${e.en||''}</div>
        </div>
        <span class="badge" style="background:${e.partColor}22;color:${e.partColor};">${e.partName}</span>
      </div>
      <div class="ex-meta">
        <span class="badge badge-gray"><i class="fa-solid fa-gauge"></i> ${e.difficulty}</span>
        <span class="badge badge-gray"><i class="fa-solid fa-dumbbell"></i> ${e.equipment}</span>
        <span class="badge badge-gray">${e.mechanic}</span>
      </div>
      <div class="ex-muscles"><i class="fa-solid fa-circle-nodes"></i> ${(e.muscles||[]).join(' · ')||e.muscle||''}</div>
    </div>
  `).join('');
}

function setPartFilter(part){
  currentPartFilter = part;
  const filter = $('#part-filter');
  filter.dataset.built = '';
  renderLibrary();
}

function showExerciseDetail(part, exId){
  const e = getExerciseById(exId);
  if(!e) return;
  const partInfo = getPartInfoByKey(part) || { name:'自定义', icon:'fa-star', color:'#d4af37' };
  const isCustom = !!e.custom;
  openModal(`
    <div class="modal-hero">
      <div class="modal-hero-content">
        <div class="modal-hero-icon" style="background:linear-gradient(135deg,${partInfo.color} 0%,${partInfo.color}aa 100%);box-shadow:0 8px 30px ${partInfo.color}50;"><i class="fa-solid ${partInfo.icon}"></i></div>
        <div class="modal-hero-text">
          <div class="modal-title">${e.name}${isCustom?' <span class="badge badge-gold" style="font-size:11px;vertical-align:middle;"><i class="fa-solid fa-star"></i> 自定义</span>':''}</div>
          <div class="modal-sub">${e.en||''} · ${partInfo.name}</div>
          <div class="modal-hero-desc">${e.desc||'暂无描述'}</div>
        </div>
      </div>
    </div>
    <div class="modal-body">
      <div class="modal-split">
        <div class="modal-sidebar">
          <div class="modal-info-panel mb-3">
            <div class="form-group-title"><i class="fa-solid fa-dumbbell"></i> 基本信息</div>
            <div class="modal-info-item">
              <div class="modal-info-icon"><i class="fa-solid fa-gauge"></i></div>
              <div><div class="modal-info-label">难度等级</div><div class="modal-info-value">${e.difficulty||'-'}</div></div>
            </div>
            <div class="modal-info-item">
              <div class="modal-info-icon"><i class="fa-solid fa-toolbox"></i></div>
              <div><div class="modal-info-label">所需器械</div><div class="modal-info-value">${e.equipment||'-'}</div></div>
            </div>
            <div class="modal-info-item">
              <div class="modal-info-icon"><i class="fa-solid fa-diagram-project"></i></div>
              <div><div class="modal-info-label">动作类型</div><div class="modal-info-value">${e.mechanic||'-'}</div></div>
            </div>
            <div class="modal-info-item">
              <div class="modal-info-icon"><i class="fa-solid fa-target"></i></div>
              <div><div class="modal-info-label">目标肌群</div><div class="modal-info-value">${e.muscle||'-'}</div></div>
            </div>
          </div>
          <div class="modal-info-panel mb-3">
            <div class="form-group-title"><i class="fa-solid fa-circle-nodes"></i> 目标肌肉</div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;">
              ${(e.muscles||[]).length>0 ? e.muscles.map(m=>`<span class="badge" style="background:${partInfo.color}15;color:${partInfo.color};">${m}</span>`).join('') : '<span class="text-muted">未指定</span>'}
            </div>
          </div>
          <button class="btn btn-primary btn-block mb-2" onclick='addExerciseToSession("${e.id}");closeModal();'><i class="fa-solid fa-plus"></i> 添加到训练</button>
          ${isCustom?`<button class="btn btn-danger btn-block" onclick="deleteCustomExercise("${e.id}")"><i class="fa-solid fa-trash"></i> 删除此动作</button>`:''}
        </div>
        <div class="modal-main">
          ${(e.steps&&e.steps.length>0)?`
          <div class="form-group">
            <div class="form-group-title"><i class="fa-solid fa-list-ol"></i> 动作步骤</div>
            <ol class="modal-step-list">
              ${e.steps.map(s=>`<li class="modal-step-item"><span class="modal-step-text">${s}</span></li>`).join('')}
            </ol>
          </div>`:''}
          ${(e.tips&&e.tips.length>0)?`
          <div class="form-group">
            <div class="form-group-title"><i class="fa-solid fa-lightbulb"></i> 训练要点</div>
            <ul class="modal-tip-list">
              ${e.tips.map(t=>`<li class="modal-tip-item"><i class="fa-solid fa-circle-check"></i><span>${t}</span></li>`).join('')}
            </ul>
          </div>`:''}
          ${(e.mistakes&&e.mistakes.length>0)?`
          <div class="form-group">
            <div class="form-group-title form-group-title-danger"><i class="fa-solid fa-triangle-exclamation"></i> 常见错误</div>
            <ul class="modal-tip-list modal-mistake-list">
              ${e.mistakes.map(t=>`<li class="modal-tip-item modal-mistake-item"><i class="fa-solid fa-circle-xmark"></i><span>${t}</span></li>`).join('')}
            </ul>
          </div>`:''}
          ${(e.breathing)?`
          <div class="form-group">
            <div class="form-group-title form-group-title-info"><i class="fa-solid fa-wind"></i> 呼吸方法</div>
            <div class="modal-text-block modal-breathing-block"><i class="fa-solid fa-quote-left modal-block-icon"></i><span>${e.breathing}</span></div>
          </div>`:''}
          ${(e.tempo)?`
          <div class="form-group">
            <div class="form-group-title form-group-title-gold"><i class="fa-solid fa-stopwatch"></i> 动作节奏与建议</div>
            <div class="modal-text-block modal-tempo-block"><i class="fa-solid fa-gauge-high modal-block-icon"></i><span>${e.tempo}</span></div>
          </div>`:''}
          ${(!e.steps||e.steps.length===0)&&(!e.tips||e.tips.length===0)&&(!e.mistakes||e.mistakes.length===0)&&(!e.breathing)&&(!e.tempo)?'<div class="empty-state"><i class="fa-solid fa-pen"></i><p>暂无详细步骤,可编辑补充</p></div>':''}
        </div>
      </div>
    </div>
  `);
}

/* ============== 自定义动作管理 ============== */
function showAddExerciseModal(){
  const partKeys = getAllPartKeys();
  const equipmentList = getAllEquipment();
  const partOptions = partKeys.map(k=>{
    const info = getPartInfoByKey(k);
    const isCustom = !EXERCISE_DB[k];
    return `<option value="${k}">${info?info.name:k}${isCustom?' (自定义)':''}</option>`;
  }).join('');
  const equipmentOptions = equipmentList.map(eq=>`<option value="${eq}">${eq}</option>`).join('');

  openModal(`
    <div class="modal-hero">
      <div class="modal-hero-content">
        <div class="modal-hero-icon" style="background:linear-gradient(135deg,#d4af37 0%,#a8851f 100%);box-shadow:0 8px 30px rgba(212,175,55,0.3);"><i class="fa-solid fa-plus"></i></div>
        <div class="modal-hero-text">
          <div class="modal-title">添加自定义动作</div>
          <div class="modal-sub">CUSTOM EXERCISE</div>
          <div class="modal-hero-desc">创建属于你自己的训练动作,可指定部位、器材、难度、步骤等。保存后可在动作库和训练追踪中使用。</div>
        </div>
      </div>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <div class="form-group-title"><i class="fa-solid fa-pen"></i> 基本信息</div>
        <div class="grid-2">
          <div><label class="label">动作名称 *</label><input type="text" class="input" id="addex-name" placeholder="如:单臂哑铃划船"></div>
          <div><label class="label">英文名称</label><input type="text" class="input" id="addex-en" placeholder="如:One Arm Row"></div>
          <div>
            <label class="label">训练部位 *</label>
            <select class="select" id="addex-part">
              ${partOptions}
            </select>
          </div>
          <div>
            <label class="label">难度等级</label>
            <select class="select" id="addex-diff">
              <option value="初级">初级</option>
              <option value="中级" selected>中级</option>
              <option value="高级">高级</option>
            </select>
          </div>
          <div>
            <label class="label">训练器材</label>
            <select class="select" id="addex-equip">
              ${equipmentOptions}
              <option value="自定义">+ 新增器材...</option>
            </select>
          </div>
          <div id="addex-equip-new-wrap" style="display:none;">
            <label class="label">新器材名称</label>
            <input type="text" class="input" id="addex-equip-new" placeholder="如:弹力带">
          </div>
          <div>
            <label class="label">动作类型</label>
            <select class="select" id="addex-mech">
              <option value="复合">复合</option>
              <option value="孤立">孤立</option>
              <option value="静态">静态</option>
              <option value="有氧">有氧</option>
            </select>
          </div>
          <div><label class="label">主目标肌群</label><input type="text" class="input" id="addex-muscle" placeholder="如:背阔肌"></div>
        </div>
        <div class="mt-2"><label class="label">动作描述</label><textarea class="textarea" id="addex-desc" placeholder="简要描述这个动作的作用..."></textarea></div>
      </div>
      <div class="form-group">
        <div class="form-group-title"><i class="fa-solid fa-circle-nodes"></i> 目标肌肉(逗号分隔)</div>
        <input type="text" class="input" id="addex-muscles" placeholder="如:背阔肌,肱二头肌,核心">
      </div>
      <div class="form-group">
        <div class="form-group-title"><i class="fa-solid fa-list-ol"></i> 动作步骤(每行一条)</div>
        <textarea class="textarea" id="addex-steps" style="min-height:120px;" placeholder="仰卧凳上,双脚踏实地面&#10;双手握距略宽于肩&#10;控制下放至胸口&#10;发力推起"></textarea>
      </div>
      <div class="form-group">
        <div class="form-group-title"><i class="fa-solid fa-lightbulb"></i> 训练要点(每行一条)</div>
        <textarea class="textarea" id="addex-tips" style="min-height:100px;" placeholder="肩胛骨后缩下沉&#10;避免过度挺腰&#10;控制下放速度"></textarea>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">取消</button>
      <button class="btn btn-primary" onclick="saveCustomExercise()"><i class="fa-solid fa-save"></i> 保存动作</button>
    </div>
  `);
  // 监听器材选择变化
  $('#addex-equip').addEventListener('change', function(){
    $('#addex-equip-new-wrap').style.display = this.value==='自定义' ? 'block' : 'none';
  });
}

function saveCustomExercise(){
  const name = $('#addex-name').value.trim();
  const partKey = $('#addex-part').value;
  if(!name){ toast('请输入动作名称','error'); return; }
  if(!partKey){ toast('请选择训练部位','error'); return; }

  // 处理器材
  let equipment = $('#addex-equip').value;
  if(equipment==='自定义'){
    equipment = $('#addex-equip-new').value.trim();
    if(!equipment){ toast('请输入新器材名称','error'); return; }
    // 保存到自定义器材列表
    if(!state.customEquipment.find(eq=>eq.name===equipment)){
      state.customEquipment.push({ name:equipment, icon:'fa-dumbbell' });
    }
  }

  const id = 'custom_'+Date.now().toString(36);
  const steps = $('#addex-steps').value.split('\n').map(s=>s.trim()).filter(s=>s);
  const tips = $('#addex-tips').value.split('\n').map(s=>s.trim()).filter(s=>s);
  const muscles = $('#addex-muscles').value.split(/[,，]/).map(s=>s.trim()).filter(s=>s);

  state.customExercises.push({
    id, partKey,
    name,
    en: $('#addex-en').value.trim(),
    difficulty: $('#addex-diff').value,
    muscle: $('#addex-muscle').value.trim(),
    equipment,
    mechanic: $('#addex-mech').value,
    desc: $('#addex-desc').value.trim(),
    steps, tips, muscles
  });

  save();
  closeModal();
  // 刷新筛选器
  $('#part-filter').dataset.built = '';
  renderLibrary();
  toast('自定义动作已添加: '+name);
}

function deleteCustomExercise(id){
  if(!confirm('确定删除这个自定义动作?')) return;
  const idx = state.customExercises.findIndex(e=>e.id===id);
  if(idx<0) return;
  const name = state.customExercises[idx].name;
  state.customExercises.splice(idx,1);
  save();
  closeModal();
  $('#part-filter').dataset.built = '';
  renderLibrary();
  toast('已删除: '+name);
}

/* ============== 自定义部位与器材管理 ============== */
function showCustomManager(){
  const customPartsList = (state.customParts||[]).map(p=>`
    <div class="flex items-center justify-between" style="padding:10px 0;border-bottom:1px solid var(--border);">
      <div class="flex items-center gap-1">
        <i class="fa-solid ${p.icon}" style="color:${p.color};font-size:16px;width:24px;text-align:center;"></i>
        <span style="font-weight:600;">${p.name}</span>
        <span class="badge badge-gray">${getAllExercisesByPart(p.key).length}个动作</span>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="deleteCustomPart('${p.key}')"><i class="fa-solid fa-trash"></i></button>
    </div>
  `).join('') || '<div class="empty-state"><p>暂无自定义部位</p></div>';

  const customEquipList = (state.customEquipment||[]).map(eq=>`
    <div class="flex items-center justify-between" style="padding:10px 0;border-bottom:1px solid var(--border);">
      <div class="flex items-center gap-1">
        <i class="fa-solid ${eq.icon}" style="color:var(--gold);font-size:16px;width:24px;text-align:center;"></i>
        <span style="font-weight:600;">${eq.name}</span>
      </div>
      <button class="btn btn-ghost btn-sm" onclick="deleteCustomEquipment('${eq.name}')"><i class="fa-solid fa-trash"></i></button>
    </div>
  `).join('') || '<div class="empty-state"><p>暂无自定义器材</p></div>';

  const customExList = (state.customExercises||[]).map(e=>{
    const partInfo = getPartInfoByKey(e.partKey);
    return `
    <div class="flex items-center justify-between" style="padding:10px 0;border-bottom:1px solid var(--border);">
      <div class="flex items-center gap-1">
        <i class="fa-solid ${partInfo?partInfo.icon:'fa-star'}" style="color:${partInfo?partInfo.color:'#d4af37'};font-size:14px;width:24px;text-align:center;"></i>
        <div>
          <div style="font-weight:600;font-size:14px;">${e.name}</div>
          <div class="text-muted" style="font-size:11px;">${partInfo?partInfo.name:'-'} · ${e.equipment||'-'}</div>
        </div>
      </div>
      <div class="flex gap-1">
        <button class="btn btn-ghost btn-sm" onclick='showExerciseDetail("${e.partKey}","${e.id}")'><i class="fa-solid fa-eye"></i></button>
        <button class="btn btn-ghost btn-sm" onclick="deleteCustomExercise('${e.id}')"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>
  `}).join('') || '<div class="empty-state"><p>暂无自定义动作</p></div>';

  const partIcons = ['fa-star','fa-person','fa-dumbbell','fa-heart-pulse','fa-hand-fist','fa-shoe-prints','fa-person-running','fa-circle-dot'];
  const partColors = ['#d4af37','#ef4444','#3b82f6','#f59e0b','#a855f7','#10b981','#06b6d4','#ec4899'];

  openModal(`
    <div class="modal-hero">
      <div class="modal-hero-content">
        <div class="modal-hero-icon"><i class="fa-solid fa-sliders"></i></div>
        <div class="modal-hero-text">
          <div class="modal-title">自定义管理</div>
          <div class="modal-sub">CUSTOM MANAGER</div>
          <div class="modal-hero-desc">添加自定义训练部位和器材,打造专属训练系统。所有数据保存在本地。</div>
        </div>
      </div>
    </div>
    <div class="modal-body">
      <div class="grid-2" style="gap:20px;">
        <div>
          <div class="form-group">
            <div class="form-group-title"><i class="fa-solid fa-plus"></i> 添加自定义部位</div>
            <div class="mb-2"><label class="label">部位名称</label><input type="text" class="input" id="newpart-name" placeholder="如:前臂"></div>
            <div class="mb-2">
              <label class="label">图标</label>
              <div class="flex gap-1" style="flex-wrap:wrap;" id="newpart-icon-picker">
                ${partIcons.map((ic,i)=>`<button class="btn btn-ghost btn-sm newpart-icon-btn" data-icon="${ic}" data-idx="${i}" onclick="selectNewPartIcon(${i})" style="width:40px;height:40px;padding:0;"><i class="fa-solid ${ic}"></i></button>`).join('')}
              </div>
            </div>
            <div class="mb-2">
              <label class="label">颜色</label>
              <div class="flex gap-1" style="flex-wrap:wrap;" id="newpart-color-picker">
                ${partColors.map((c,i)=>`<button class="btn btn-ghost newpart-color-btn" data-color="${c}" data-idx="${i}" onclick="selectNewPartColor(${i})" style="width:32px;height:32px;padding:0;border-radius:50%;background:${c};border:2px solid transparent;"></button>`).join('')}
              </div>
            </div>
            <button class="btn btn-primary btn-block" onclick="addCustomPart()"><i class="fa-solid fa-plus"></i> 添加部位</button>
          </div>
          <div class="form-group">
            <div class="form-group-title"><i class="fa-solid fa-list"></i> 已有部位 (${(state.customParts||[]).length})</div>
            ${customPartsList}
          </div>
        </div>
        <div>
          <div class="form-group">
            <div class="form-group-title"><i class="fa-solid fa-plus"></i> 添加自定义器材</div>
            <div class="mb-2"><label class="label">器材名称</label><input type="text" class="input" id="newequip-name" placeholder="如:弹力带"></div>
            <button class="btn btn-primary btn-block" onclick="addCustomEquipment()"><i class="fa-solid fa-plus"></i> 添加器材</button>
          </div>
          <div class="form-group">
            <div class="form-group-title"><i class="fa-solid fa-list"></i> 自定义器材 (${(state.customEquipment||[]).length})</div>
            ${customEquipList}
          </div>
          <div class="form-group">
            <div class="form-group-title"><i class="fa-solid fa-list-check"></i> 自定义动作 (${(state.customExercises||[]).length})</div>
            ${customExList}
          </div>
        </div>
      </div>
    </div>
  `);
  // 初始化选择状态
  window._newPartIcon = partIcons[0];
  window._newPartColor = partColors[0];
  selectNewPartIcon(0);
  selectNewPartColor(0);
}

let _newPartIcon = 'fa-star', _newPartColor = '#d4af37';
function selectNewPartIcon(idx){
  const btns = $$('.newpart-icon-btn');
  btns.forEach((b,i)=>{
    b.style.background = i===idx ? 'var(--gold)' : 'var(--bg-elevated)';
    b.style.color = i===idx ? 'var(--bg-darkest)' : 'var(--text-secondary)';
  });
  _newPartIcon = btns[idx]?.dataset.icon || 'fa-star';
}
function selectNewPartColor(idx){
  const btns = $$('.newpart-color-btn');
  btns.forEach((b,i)=>{ b.style.border = i===idx ? '2px solid var(--gold)' : '2px solid transparent'; b.style.transform = i===idx?'scale(1.15)':''; });
  _newPartColor = btns[idx]?.dataset.color || '#d4af37';
}

function addCustomPart(){
  const name = $('#newpart-name').value.trim();
  if(!name){ toast('请输入部位名称','error'); return; }
  const key = 'custom_'+Date.now().toString(36);
  state.customParts.push({ key, name, icon:_newPartIcon, color:_newPartColor });
  save();
  toast('部位已添加: '+name);
  // 刷新当前弹窗
  showCustomManager();
  // 刷新动作库筛选
  $('#part-filter').dataset.built = '';
}

function deleteCustomPart(key){
  const exCount = getAllExercisesByPart(key).length;
  if(exCount>0){
    if(!confirm(`该部位下有 ${exCount} 个动作,删除部位将一并删除这些动作,确定?`)) return;
    state.customExercises = state.customExercises.filter(e=>e.partKey!==key);
  } else {
    if(!confirm('确定删除这个自定义部位?')) return;
  }
  const idx = state.customParts.findIndex(p=>p.key===key);
  if(idx<0) return;
  const name = state.customParts[idx].name;
  state.customParts.splice(idx,1);
  save();
  toast('已删除部位: '+name);
  showCustomManager();
  $('#part-filter').dataset.built = '';
  if(currentPartFilter===key) setPartFilter('all');
}

function addCustomEquipment(){
  const name = $('#newequip-name').value.trim();
  if(!name){ toast('请输入器材名称','error'); return; }
  if(state.customEquipment.find(eq=>eq.name===name)){ toast('该器材已存在','error'); return; }
  state.customEquipment.push({ name, icon:'fa-dumbbell' });
  save();
  toast('器材已添加: '+name);
  showCustomManager();
}

function deleteCustomEquipment(name){
  // 检查是否有动作使用
  const used = [...state.customExercises, ...Object.values(EXERCISE_DB).flatMap(p=>p.exercises)].some(e=>e.equipment===name);
  if(used && !confirm('有动作正在使用此器材(内置动作不影响),确定删除?')) return;
  const idx = state.customEquipment.findIndex(eq=>eq.name===name);
  if(idx<0) return;
  state.customEquipment.splice(idx,1);
  save();
  toast('已删除器材: '+name);
  showCustomManager();
}

/* ============== 人体部位图 ============== */
function selectBodyPart(part){
  $$('.body-part-btn').forEach(b=>b.classList.toggle('active', b.dataset.part===part));
  const p = EXERCISE_DB[part];
  if(!p) return;
  const el = $('#body-part-detail');
  el.innerHTML = `
    <div class="card">
      <div class="card-header">
        <div class="card-title"><i class="fa-solid ${p.icon}" style="color:${p.color};"></i> ${p.name}</div>
        <span class="badge" style="background:${p.color}22;color:${p.color};">${p.exercises.length}个动作</span>
      </div>
      <div class="grid-2" style="gap:10px;">
        ${p.exercises.map(e=>`
          <div class="exercise-card" style="padding:12px;" onclick='showExerciseDetail("${part}","${e.id}")'>
            <div class="ex-name" style="font-size:14px;">${e.name}</div>
            <div class="ex-en" style="font-size:10px;">${e.en}</div>
            <div class="ex-meta" style="margin-top:6px;">
              <span class="badge badge-gray" style="font-size:10px;">${e.difficulty}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* ============== 训练追踪 ============== */
function renderTracker(){
  if(activeSession && activeSession.exercises && activeSession.exercises.length>0){
    $('#session-empty').classList.add('hidden');
    $('#session-active').classList.remove('hidden');
    $('#session-name').value = activeSession.name || '';
    $('#session-date').textContent = fmtDate(activeSession.date) + ' · ' + activeSession.exercises.length + '个动作';
    renderSessionExercises();
  } else {
    $('#session-empty').classList.remove('hidden');
    $('#session-active').classList.add('hidden');
  }
}

function renderSessionExercises(){
  const el = $('#session-exercises');
  if(!activeSession || !activeSession.exercises){
    el.innerHTML = '<div class="empty-state"><p>暂无动作,点击"添加动作"开始</p></div>';
    return;
  }
  el.innerHTML = activeSession.exercises.map((ex,ei)=>`
    <div class="exercise-row">
      <div class="exercise-row-header">
        <div>
          <div class="ex-name">${ex.name}</div>
          <div class="text-muted" style="font-size:12px;">目标: ${ex.targetSets}组 × ${ex.targetReps} · 休息${ex.rest||'60秒'}</div>
        </div>
        <div class="flex gap-1">
          <button class="btn btn-ghost btn-sm" onclick="addSet(${ei})"><i class="fa-solid fa-plus"></i></button>
          <button class="btn btn-ghost btn-sm" onclick="removeExercise(${ei})"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
      ${ex.sets.map((s,si)=>`
        <div class="set-row">
          <div class="set-number">${si+1}</div>
          <input type="number" class="input" placeholder="重量" value="${s.weight}" onchange="updateSet(${ei},${si},'weight',this.value)">
          <input type="number" class="input" placeholder="次数" value="${s.reps}" onchange="updateSet(${ei},${si},'reps',this.value)">
          <button class="btn ${s.done?'btn-primary':'btn-ghost'} btn-sm" onclick="toggleSetDone(${ei},${si})"><i class="fa-solid ${s.done?'fa-check':'fa-circle'}"></i></button>
          <button class="btn btn-ghost btn-sm" onclick="removeSet(${ei},${si})"><i class="fa-solid fa-xmark"></i></button>
        </div>
      `).join('')}
    </div>
  `).join('');
}

function addExerciseToSession(exId){
  if(!activeSession){
    activeSession = {
      id: uid(),
      date: todayStr(),
      name: '自由训练',
      planId: null,
      startTime: Date.now(),
      exercises: []
    };
  }
  let exData;
  if(exId){
    exData = getExerciseById(exId);
  } else {
    // 显示选择器
    showExercisePicker();
    return;
  }
  if(!exData) return;
  activeSession.exercises.push({
    id: exData.id,
    name: exData.name,
    targetSets: 4,
    targetReps: '10-12',
    rest: '60秒',
    sets: [
      {weight:'', reps:'', done:false},
      {weight:'', reps:'', done:false},
      {weight:'', reps:'', done:false}
    ]
  });
  saveSession();
  renderTracker();
  toast('已添加: '+exData.name);
}

function showExercisePicker(){
  let grouped = {};
  Object.keys(EXERCISE_DB).forEach(k=>{
    const p = EXERCISE_DB[k];
    grouped[k] = { name:p.name, icon:p.icon, color:p.color, exercises:p.exercises };
  });
  const groupsHtml = Object.keys(grouped).map(k=>{
    const g = grouped[k];
    const items = g.exercises.map(e=>`
      <div class="picker-item" onclick='addExerciseToSession("${e.id}");closeModal();'>
        <div class="picker-item-name">${e.name}</div>
        <div class="picker-item-sub">${e.en} · ${e.muscle}</div>
      </div>
    `).join('');
    return `
      <div class="picker-group">
        <div class="picker-group-title"><i class="fa-solid ${g.icon}" style="color:${g.color};"></i> ${g.name} <span class="badge badge-gray" style="margin-left:6px;">${g.exercises.length}</span></div>
        <div class="picker-grid">${items}</div>
      </div>
    `;
  }).join('');

  openModal(`
    <div class="modal-hero">
      <div class="modal-hero-content">
        <div class="modal-hero-icon"><i class="fa-solid fa-book-medical"></i></div>
        <div class="modal-hero-text">
          <div class="modal-title">选择动作</div>
          <div class="modal-sub">EXERCISE LIBRARY</div>
          <div class="modal-hero-desc">从全身各部位动作库中选择,快速添加到当前训练。按部位分类浏览。</div>
        </div>
      </div>
    </div>
    <div class="modal-body">
      ${groupsHtml}
    </div>
  `);
}

function updateSet(ei, si, field, val){
  if(!activeSession) return;
  activeSession.exercises[ei].sets[si][field] = val;
  saveSession();
}

function toggleSetDone(ei, si){
  if(!activeSession) return;
  activeSession.exercises[ei].sets[si].done = !activeSession.exercises[ei].sets[si].done;
  saveSession();
  renderSessionExercises();
}

function addSet(ei){
  if(!activeSession) return;
  activeSession.exercises[ei].sets.push({weight:'', reps:'', done:false});
  saveSession();
  renderSessionExercises();
}

function removeSet(ei, si){
  if(!activeSession) return;
  activeSession.exercises[ei].sets.splice(si,1);
  saveSession();
  renderSessionExercises();
}

function removeExercise(ei){
  if(!activeSession) return;
  activeSession.exercises.splice(ei,1);
  saveSession();
  renderSessionExercises();
}

function finishSession(){
  if(!activeSession || activeSession.exercises.length===0){
    toast('请先添加动作', 'error');
    return;
  }
  // 名称同步
  activeSession.name = $('#session-name').value || '训练';
  activeSession.duration = Math.round((Date.now() - activeSession.startTime)/60000);

  // 保存到历史
  state.workouts.push({...activeSession});
  state.totalWorkouts++;

  // 更新连续天数
  const today = todayStr();
  if(state.lastWorkoutDate){
    const last = new Date(state.lastWorkoutDate);
    const diff = Math.round((new Date(today) - last)/86400000);
    if(diff===1) state.streak++;
    else if(diff>1) state.streak = 1;
  } else {
    state.streak = 1;
  }
  state.lastWorkoutDate = today;

  // 统计训练部位
  const parts = new Set();
  activeSession.exercises.forEach(ex=>{
    const e = getExerciseById(ex.id);
    if(e) parts.add(e.part);
  });
  const totalParts = new Set();
  state.workouts.forEach(w=>w.exercises.forEach(ex=>{
    const e = getExerciseById(ex.id);
    if(e) totalParts.add(e.part);
  }));
  state.trainedParts = totalParts.size;

  // 检查PR
  checkPRs(activeSession);

  save();
  activeSession = null;
  saveSession();

  // 检查成就
  checkAchievements();

  toast('训练完成!干得漂亮 💪');
  navigate('dashboard');
}

function clearSession(){
  if(!confirm('确定要清空当前训练吗?')) return;
  activeSession = null;
  saveSession();
  renderTracker();
  toast('已清空训练');
}

function checkPRs(session){
  session.exercises.forEach(ex=>{
    const e = getExerciseById(ex.id);
    if(!e) return;
    let maxWeight = 0;
    ex.sets.forEach(s=>{
      const w = parseFloat(s.weight)||0;
      const r = parseInt(s.reps)||0;
      if(w>maxWeight && r>=1) maxWeight = w;
    });
    // 卧推
    if(e.name.includes('卧推') && maxWeight > (state.prs.bench||0)){
      state.prs.bench = maxWeight;
      toast('新PR!卧推 '+maxWeight+'kg 🏆');
    }
    if(e.name.includes('深蹲') && !e.name.includes('分腿') && maxWeight > (state.prs.squat||0)){
      state.prs.squat = maxWeight;
      toast('新PR!深蹲 '+maxWeight+'kg 🏆');
    }
    if(e.name.includes('硬拉') && maxWeight > (state.prs.deadlift||0)){
      state.prs.deadlift = maxWeight;
      toast('新PR!硬拉 '+maxWeight+'kg 🏆');
    }
  });
}

/* ============== 进度图表 ============== */
function renderProgress(){
  // 当前数据
  const lastM = state.measurements[state.measurements.length-1];
  $('#stat-weight').innerHTML = lastM ? `${lastM.weight}<span class="unit">kg</span>` : `--<span class="unit">kg</span>`;
  $('#stat-bodyfat').innerHTML = lastM&&lastM.bodyfat ? `${lastM.bodyfat}<span class="unit">%</span>` : `--<span class="unit">%</span>`;
  $('#stat-arm').innerHTML = lastM&&lastM.arm ? `${lastM.arm}<span class="unit">cm</span>` : `--<span class="unit">cm</span>`;
  const totalVol = state.workouts.reduce((s,w)=>s+workoutVolume(w),0);
  $('#stat-total-volume').innerHTML = `${Math.round(totalVol).toLocaleString()}<span class="unit">kg</span>`;

  // 体重图
  renderWeightChart();

  // PR列表
  renderPRList();

  // 围度表
  renderMeasureTable();
}

function renderWeightChart(){
  const ctx = $('#chart-weight');
  if(!ctx) return;
  if(charts.weight) charts.weight.destroy();

  const sorted = [...state.measurements].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const labels = sorted.map(m=>fmtDate(m.date));
  const data = sorted.map(m=>m.weight);

  if(labels.length===0){
    charts.weight = new Chart(ctx, {
      type:'line',
      data:{ labels:['暂无'], datasets:[{ data:[0], borderColor:'#d4af37' }]},
      options: chartOpts()
    });
    return;
  }

  charts.weight = new Chart(ctx, {
    type:'line',
    data:{ labels, datasets:[{
      label:'体重(kg)',
      data,
      borderColor:'#d4af37',
      backgroundColor:'rgba(212,175,55,0.1)',
      fill:true,
      tension:0.3,
      pointBackgroundColor:'#d4af37',
      pointRadius:4,
    }]},
    options: chartOpts()
  });
}

function renderPRList(){
  const el = $('#pr-list');
  const prs = [
    { name:'卧推', val:state.prs.bench, icon:'fa-dumbbell', color:'#ef4444' },
    { name:'深蹲', val:state.prs.squat, icon:'fa-person-arrows', color:'#10b981' },
    { name:'硬拉', val:state.prs.deadlift, icon:'fa-weight-hanging', color:'#3b82f6' },
    { name:'推举', val:state.prs.opress, icon:'fa-up-down', color:'#f59e0b' },
    { name:'划船', val:state.prs.row, icon:'fa-water', color:'#a855f7' },
  ];
  el.innerHTML = prs.map(p=>`
    <div class="flex items-center justify-between" style="padding:10px 0;border-bottom:1px solid var(--border);">
      <div class="flex items-center gap-1">
        <i class="fa-solid ${p.icon}" style="color:${p.color};font-size:18px;width:24px;text-align:center;"></i>
        <span style="font-weight:600;">${p.name}</span>
      </div>
      <div style="font-family:Oswald;font-size:20px;font-weight:700;color:var(--gold);">${p.val||0}<span style="font-size:12px;color:var(--text-secondary);"> kg</span></div>
    </div>
  `).join('');
}

function renderMeasureTable(){
  const tb = $('#measure-tbody');
  if(state.measurements.length===0){
    tb.innerHTML = `<tr><td colspan="8" class="text-center text-muted" style="padding:24px;">暂无记录,点击"记录"添加</td></tr>`;
    return;
  }
  const sorted = [...state.measurements].sort((a,b)=>new Date(b.date)-new Date(a.date));
  tb.innerHTML = sorted.map((m,i)=>`
    <tr>
      <td>${fmtDate(m.date)}</td>
      <td>${m.weight||'-'}</td>
      <td>${m.bodyfat||'-'}</td>
      <td>${m.chest||'-'}</td>
      <td>${m.waist||'-'}</td>
      <td>${m.arm||'-'}</td>
      <td>${m.thigh||'-'}</td>
      <td><button class="btn btn-ghost btn-sm" onclick="deleteMeasure(${state.measurements.indexOf(m)})"><i class="fa-solid fa-trash"></i></button></td>
    </tr>
  `).join('');
}

function showMeasureModal(){
  openModal(`
    <div class="modal-hero">
      <div class="modal-hero-content">
        <div class="modal-hero-icon" style="background:linear-gradient(135deg,#10b981 0%,#059669 100%);box-shadow:0 8px 30px rgba(16,185,129,0.3);"><i class="fa-solid fa-weight-scale"></i></div>
        <div class="modal-hero-text">
          <div class="modal-title">记录身体数据</div>
          <div class="modal-sub">BODY MEASUREMENTS</div>
          <div class="modal-hero-desc">定期记录身体数据,追踪你的身材变化。数据将自动保存在本地。</div>
        </div>
      </div>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <div class="form-group-title"><i class="fa-solid fa-calendar"></i> 基本信息</div>
        <div class="grid-2">
          <div><label class="label">日期</label><input type="date" class="input" id="m-date" value="${todayStr()}"></div>
          <div><label class="label">测量时间</label><input type="text" class="input" value="${new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'})}" disabled></div>
        </div>
      </div>
      <div class="form-group">
        <div class="form-group-title"><i class="fa-solid fa-scale-unbalanced"></i> 体重体脂</div>
        <div class="grid-2">
          <div><label class="label">体重(kg)</label><input type="number" class="input" id="m-weight" step="0.1" placeholder="如:70.5"></div>
          <div><label class="label">体脂率(%)</label><input type="number" class="input" id="m-bodyfat" step="0.1" placeholder="如:15.2"></div>
        </div>
      </div>
      <div class="form-group">
        <div class="form-group-title"><i class="fa-solid fa-ruler-combined"></i> 身体围度</div>
        <div class="grid-2">
          <div><label class="label">胸围(cm)</label><input type="number" class="input" id="m-chest" step="0.1" placeholder="如:100"></div>
          <div><label class="label">腰围(cm)</label><input type="number" class="input" id="m-waist" step="0.1" placeholder="如:80"></div>
          <div><label class="label">臂围(cm)</label><input type="number" class="input" id="m-arm" step="0.1" placeholder="如:35"></div>
          <div><label class="label">大腿围(cm)</label><input type="number" class="input" id="m-thigh" step="0.1" placeholder="如:58"></div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">取消</button>
      <button class="btn btn-primary" onclick="saveMeasure()"><i class="fa-solid fa-save"></i> 保存记录</button>
    </div>
  `);
}

function saveMeasure(){
  const m = {
    date: $('#m-date').value || todayStr(),
    weight: parseFloat($('#m-weight').value)||0,
    bodyfat: parseFloat($('#m-bodyfat').value)||0,
    chest: parseFloat($('#m-chest').value)||0,
    waist: parseFloat($('#m-waist').value)||0,
    arm: parseFloat($('#m-arm').value)||0,
    thigh: parseFloat($('#m-thigh').value)||0,
  };
  state.measurements.push(m);
  // 更新profile体重
  if(m.weight) state.profile.weight = m.weight;
  save();
  closeModal();
  renderProgress();
  toast('身体数据已记录');
}

function deleteMeasure(idx){
  state.measurements.splice(idx,1);
  save();
  renderProgress();
  toast('已删除记录');
}

function showPRModal(){
  openModal(`
    <div class="modal-hero">
      <div class="modal-hero-content">
        <div class="modal-hero-icon" style="background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);box-shadow:0 8px 30px rgba(245,158,11,0.3);"><i class="fa-solid fa-trophy"></i></div>
        <div class="modal-hero-text">
          <div class="modal-title">更新力量PR</div>
          <div class="modal-sub">PERSONAL RECORD</div>
          <div class="modal-hero-desc">记录你的个人力量记录,追踪力量成长轨迹。建议每次突破极限后更新。</div>
        </div>
      </div>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <div class="form-group-title"><i class="fa-solid fa-dumbbell"></i> 选择动作</div>
        <div class="grid-2">
          <div>
            <label class="label">动作</label>
            <select class="select" id="pr-type">
              <option value="bench">卧推</option>
              <option value="squat">深蹲</option>
              <option value="deadlift">硬拉</option>
              <option value="opress">推举</option>
              <option value="row">划船</option>
            </select>
          </div>
          <div>
            <label class="label">重量(kg)</label>
            <input type="number" class="input" id="pr-weight" step="0.5" placeholder="如:100">
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="form-group-title"><i class="fa-solid fa-chart-simple"></i> 当前PR概览</div>
        <div class="grid-2">
          <div class="modal-info-item" style="background:var(--bg-dark);border-radius:8px;padding:12px 16px;">
            <div class="modal-info-icon" style="background:rgba(239,68,68,0.1);color:#ef4444;"><i class="fa-solid fa-dumbbell"></i></div>
            <div><div class="modal-info-label">卧推</div><div class="modal-info-value">${state.prs.bench||0} kg</div></div>
          </div>
          <div class="modal-info-item" style="background:var(--bg-dark);border-radius:8px;padding:12px 16px;">
            <div class="modal-info-icon" style="background:rgba(16,185,129,0.1);color:#10b981;"><i class="fa-solid fa-person-arrows"></i></div>
            <div><div class="modal-info-label">深蹲</div><div class="modal-info-value">${state.prs.squat||0} kg</div></div>
          </div>
          <div class="modal-info-item" style="background:var(--bg-dark);border-radius:8px;padding:12px 16px;">
            <div class="modal-info-icon" style="background:rgba(59,130,246,0.1);color:#3b82f6;"><i class="fa-solid fa-weight-hanging"></i></div>
            <div><div class="modal-info-label">硬拉</div><div class="modal-info-value">${state.prs.deadlift||0} kg</div></div>
          </div>
          <div class="modal-info-item" style="background:var(--bg-dark);border-radius:8px;padding:12px 16px;">
            <div class="modal-info-icon" style="background:rgba(245,158,11,0.1);color:#f59e0b;"><i class="fa-solid fa-up-down"></i></div>
            <div><div class="modal-info-label">推举</div><div class="modal-info-value">${state.prs.opress||0} kg</div></div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">取消</button>
      <button class="btn btn-primary" onclick="savePR()"><i class="fa-solid fa-save"></i> 保存记录</button>
    </div>
  `);
}

function savePR(){
  const type = $('#pr-type').value;
  const weight = parseFloat($('#pr-weight').value)||0;
  if(weight<=0){ toast('请输入有效重量','error'); return; }
  state.prs[type] = weight;
  save();
  closeModal();
  renderProgress();
  checkAchievements();
  toast('PR已更新');
}

/* ============== 训练历史 ============== */
function renderHistory(){
  const el = $('#history-list');
  if(state.workouts.length===0){
    el.innerHTML = `<div class="empty-state"><i class="fa-solid fa-clock-rotate-left"></i><p>暂无训练记录</p><button class="btn btn-primary mt-2" onclick="navigate('plans')">开始训练</button></div>`;
    return;
  }
  const sorted = [...state.workouts].sort((a,b)=>new Date(b.date)-new Date(a.date));
  el.innerHTML = sorted.map((w,i)=>`
    <div class="exercise-card mb-2" style="cursor:default;">
      <div class="flex items-center justify-between flex-wrap gap-1">
        <div class="flex items-center gap-1">
          <div class="stat-icon" style="position:static;font-size:24px;color:var(--gold);opacity:0.8;"><i class="fa-solid fa-dumbbell"></i></div>
          <div>
            <div class="ex-name">${w.name||'训练'}</div>
            <div class="text-muted" style="font-size:12px;">${fmtDate(w.date)} · ${w.duration||0}分钟 · ${w.exercises?.length||0}个动作</div>
          </div>
        </div>
        <div class="text-gold" style="font-family:Oswald;font-size:20px;font-weight:700;">${Math.round(workoutVolume(w))}<span style="font-size:12px;color:var(--text-secondary);">kg</span></div>
      </div>
      <div class="flex gap-1 mt-2" style="flex-wrap:wrap;">
        ${(w.exercises||[]).map(ex=>`<span class="badge badge-gray">${ex.name}</span>`).join('')}
      </div>
      <button class="btn btn-ghost btn-sm mt-2" onclick="deleteWorkout(${state.workouts.indexOf(w)})"><i class="fa-solid fa-trash"></i> 删除</button>
    </div>
  `).join('');
}

function deleteWorkout(idx){
  if(!confirm('确定删除这条训练记录?')) return;
  state.workouts.splice(idx,1);
  state.totalWorkouts = Math.max(0, state.totalWorkouts-1);
  save();
  renderHistory();
  toast('已删除');
}

/* ============== 营养方案 ============== */
function renderNutrition(){
  const grid = $('#meal-plans-grid');
  grid.innerHTML = MEAL_PLANS.map(m=>`
    <div class="plan-card">
      <div class="plan-name">${m.name}</div>
      <div class="plan-en">${m.goal}</div>
      <p class="plan-desc">${m.desc}</p>
      <div class="plan-meta">
        <div class="plan-meta-item"><i class="fa-solid fa-fire"></i> ${m.calories}</div>
        <div class="plan-meta-item"><i class="fa-solid fa-drumstick-bite"></i> ${m.protein}</div>
      </div>
      <button class="btn btn-secondary btn-sm btn-block" onclick='showMealDetail("${m.id}")'><i class="fa-solid fa-eye"></i> 查看餐单</button>
    </div>
  `).join('');
  // 自动计算宏量
  if(state.profile.weight){
    $('#macro-weight').value = state.profile.weight;
    $('#macro-goal').value = state.profile.goal;
    calcMacros();
  }
}

function showMealDetail(id){
  const m = MEAL_PLANS.find(x=>x.id===id);
  if(!m) return;
  const goalColors = {bulk:'#10b981', cut:'#ef4444', maint:'#f59e0b'};
  const goalIcons = {bulk:'fa-person-plus', cut:'fa-scissors', maint:'fa-balance-scale'};
  const color = goalColors[m.id] || '#d4af37';
  const icon = goalIcons[m.id] || 'fa-apple-whole';
  const mealsHtml = m.meals.map(meal=>`
    <div class="meal-card">
      <div class="meal-card-header">
        <div class="flex items-center gap-1">
          <span class="badge badge-gold">${meal.time}</span>
          <span style="font-weight:600;font-size:16px;">${meal.name}</span>
        </div>
        <div class="text-muted" style="font-size:13px;">${meal.calories}</div>
      </div>
      <div class="meal-card-items">${meal.items}</div>
    </div>
  `).join('');
  openModal(`
    <div class="modal-hero">
      <div class="modal-hero-content">
        <div class="modal-hero-icon" style="background:linear-gradient(135deg,${color} 0%,${color}aa 100%);box-shadow:0 8px 30px ${color}50;"><i class="fa-solid ${icon}"></i></div>
        <div class="modal-hero-text">
          <div class="modal-title">${m.name}</div>
          <div class="modal-sub">${m.goal.toUpperCase()} GOAL</div>
          <div class="modal-hero-desc">${m.desc}</div>
        </div>
      </div>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <div class="form-group-title"><i class="fa-solid fa-fire"></i> 营养概览</div>
        <div class="grid-4" style="gap:12px;">
          <div class="stat-card" style="padding:14px;">
            <div class="stat-label">每日热量</div>
            <div class="stat-value" style="font-size:20px;">${m.calories}</div>
          </div>
          <div class="stat-card red" style="padding:14px;">
            <div class="stat-label">蛋白质</div>
            <div class="stat-value" style="font-size:20px;">${m.protein}</div>
          </div>
          <div class="stat-card green" style="padding:14px;">
            <div class="stat-label">碳水</div>
            <div class="stat-value" style="font-size:20px;">${m.carbs}</div>
          </div>
          <div class="stat-card blue" style="padding:14px;">
            <div class="stat-label">脂肪</div>
            <div class="stat-value" style="font-size:20px;">${m.fat}</div>
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="form-group-title"><i class="fa-solid fa-utensils"></i> 每日餐单</div>
        <div class="grid-2" style="gap:14px;">${mealsHtml}</div>
      </div>
    </div>
  `);
}

function calcMacros(){
  const weight = parseFloat($('#macro-weight').value)||0;
  const goal = $('#macro-goal').value;
  const activity = parseFloat($('#macro-activity').value)||1.55;
  if(weight<=0){
    $('#macro-result').style.display='none';
    return;
  }
  // BMR 简化估算
  const bmr = state.profile.gender==='female' ? weight*22 : weight*24;
  const tdee = bmr * activity;
  let calories, protein, carbs, fat;
  if(goal==='bulk'){
    calories = tdee + 400;
    protein = weight * 2.2;
    fat = weight * 1.0;
    carbs = (calories - protein*4 - fat*9) / 4;
  } else if(goal==='cut'){
    calories = tdee - 400;
    protein = weight * 2.4;
    fat = weight * 0.8;
    carbs = (calories - protein*4 - fat*9) / 4;
  } else {
    calories = tdee;
    protein = weight * 1.8;
    fat = weight * 1.0;
    carbs = (calories - protein*4 - fat*9) / 4;
  }
  const el = $('#macro-result');
  el.style.display='grid';
  el.innerHTML = `
    <div class="stat-card" style="padding:14px;">
      <div class="stat-label">每日热量</div>
      <div class="stat-value" style="font-size:24px;">${Math.round(calories)}<span class="unit">kcal</span></div>
    </div>
    <div class="stat-card red" style="padding:14px;">
      <div class="stat-label">蛋白质</div>
      <div class="stat-value" style="font-size:24px;">${Math.round(protein)}<span class="unit">g</span></div>
    </div>
    <div class="stat-card green" style="padding:14px;">
      <div class="stat-label">碳水化合物</div>
      <div class="stat-value" style="font-size:24px;">${Math.round(carbs)}<span class="unit">g</span></div>
    </div>
    <div class="stat-card blue" style="padding:14px;">
      <div class="stat-label">脂肪</div>
      <div class="stat-value" style="font-size:24px;">${Math.round(fat)}<span class="unit">g</span></div>
    </div>
  `;
}

/* ============== 计算器 ============== */
function calcBMI(){
  const h = parseFloat($('#bmi-h').value)/100;
  const w = parseFloat($('#bmi-w').value);
  if(!h||!w){ $('#bmi-result').innerHTML='<span class="text-muted">输入数据计算</span>'; return; }
  const bmi = w/(h*h);
  let cat = '', color='';
  if(bmi<18.5){ cat='偏瘦'; color='var(--blue)'; }
  else if(bmi<24){ cat='正常'; color='var(--green)'; }
  else if(bmi<28){ cat='超重'; color='var(--orange)'; }
  else { cat='肥胖'; color='var(--red)'; }
  $('#bmi-result').innerHTML = `
    <div class="timer-display" style="font-size:48px;color:${color};">${bmi.toFixed(1)}</div>
    <div class="badge" style="background:${color}22;color:${color};">${cat}</div>
  `;
}

function calc1RM(){
  const w = parseFloat($('#rm-w').value);
  const r = parseInt($('#rm-r').value);
  if(!w||!r){ $('#rm-result').innerHTML='<span class="text-muted">输入数据计算</span>'; return; }
  // Epley公式
  const rm = w * (1 + r/30);
  let percents = [100,95,90,85,80,75,70,65,60];
  let table = '<div class="grid-3 mt-2" style="gap:6px;font-size:12px;">';
  percents.forEach(p=>{
    table += `<div style="background:var(--bg-dark);padding:6px;border-radius:4px;text-align:center;"><div class="text-muted">${p}%</div><div class="text-gold" style="font-weight:600;">${(rm*p/100).toFixed(1)}kg</div></div>`;
  });
  table += '</div>';
  $('#rm-result').innerHTML = `
    <div class="timer-display" style="font-size:40px;color:var(--gold);">${rm.toFixed(1)}<span style="font-size:14px;">kg</span></div>
    <div class="text-muted mb-2">估算1RM(最大重量)</div>
    ${table}
  `;
}

function calcBodyFat(){
  const sex = $('#bf-sex').value;
  const age = parseFloat($('#bf-age').value);
  const waist = parseFloat($('#bf-waist').value);
  const hip = parseFloat($('#bf-hip').value)||0;
  const neck = parseFloat($('#bf-neck').value);
  const height = parseFloat($('#bf-height').value);
  if(!waist||!neck||!height){ $('#bf-result').innerHTML='<span class="text-muted">请填写必填项</span>'; return; }
  // US Navy公式
  let bf;
  if(sex==='male'){
    bf = 495 / (1.0324 - 0.19077*Math.log10(waist-neck) + 0.15456*Math.log10(height)) - 450;
  } else {
    bf = 495 / (1.29579 - 0.35004*Math.log10(waist+hip-neck) + 0.22100*Math.log10(height)) - 450;
  }
  if(isNaN(bf)||bf<0||bf>60){ $('#bf-result').innerHTML='<span class="text-muted">数据异常,请检查</span>'; return; }
  let cat = '', color='';
  if(sex==='male'){
    if(bf<10){ cat='极低'; color='var(--blue)'; }
    else if(bf<15){ cat='运动型'; color='var(--green)'; }
    else if(bf<20){ cat='健康'; color='var(--green)'; }
    else if(bf<25){ cat='偏高'; color='var(--orange)'; }
    else { cat='肥胖'; color='var(--red)'; }
  } else {
    if(bf<18){ cat='极低'; color='var(--blue)'; }
    else if(bf<22){ cat='运动型'; color='var(--green)'; }
    else if(bf<28){ cat='健康'; color='var(--green)'; }
    else if(bf<33){ cat='偏高'; color='var(--orange)'; }
    else { cat='肥胖'; color='var(--red)'; }
  }
  $('#bf-result').innerHTML = `
    <div class="timer-display" style="font-size:40px;color:${color};">${bf.toFixed(1)}<span style="font-size:14px;">%</span></div>
    <div class="badge" style="background:${color}22;color:${color};">${cat}</div>
  `;
}

function calcTDEE(){
  const bmr = parseFloat($('#tdee-bmr').value);
  const act = parseFloat($('#tdee-act').value);
  if(!bmr){ $('#tdee-result').innerHTML='<span class="text-muted">输入BMR计算</span>'; return; }
  const tdee = bmr * act;
  $('#tdee-result').innerHTML = `
    <div class="timer-display" style="font-size:40px;color:var(--gold);">${Math.round(tdee)}<span style="font-size:14px;">kcal</span></div>
    <div class="text-muted">每日总能量消耗</div>
    <div class="flex gap-1 mt-2" style="justify-content:center;font-size:12px;">
      <span class="badge badge-green">增肌: ${Math.round(tdee+300)}</span>
      <span class="badge badge-red">减脂: ${Math.round(tdee-400)}</span>
    </div>
  `;
}

/* ============== 计时器 ============== */
// 休息计时器
let restTimer = null, restTime = 60, restTotal = 60;
function setRestTime(sec){ resetRest(); restTime=restTotal=sec; updateRestDisplay(); }
function updateRestDisplay(){
  const m = String(Math.floor(restTime/60)).padStart(2,'0');
  const s = String(restTime%60).padStart(2,'0');
  $('#rest-display').textContent = `${m}:${s}`;
  const ring = $('#rest-ring');
  if(ring){
    const offset = 691 * (1 - restTime/restTotal);
    ring.style.strokeDashoffset = offset;
  }
}
function toggleRest(){
  if(restTimer){ clearInterval(restTimer); restTimer=null; $('#rest-start').innerHTML='<i class="fa-solid fa-play"></i> 开始'; }
  else{
    if(restTime<=0) restTime=restTotal;
    $('#rest-start').innerHTML='<i class="fa-solid fa-pause"></i> 暂停';
    restTimer = setInterval(()=>{
      restTime--;
      updateRestDisplay();
      if(restTime<=0){
        clearInterval(restTimer); restTimer=null;
        $('#rest-start').innerHTML='<i class="fa-solid fa-play"></i> 开始';
        toast('休息时间到!开始下一组 💪');
        // 蜂鸣
        try{ beep(); }catch(e){}
      }
    },1000);
  }
}
function resetRest(){ clearInterval(restTimer); restTimer=null; restTime=restTotal; updateRestDisplay(); $('#rest-start').innerHTML='<i class="fa-solid fa-play"></i> 开始'; }

// HIIT 计时器
let hiitTimer = null, hiitState = 'idle', hiitRound = 0, hiitPhase = 'work', hiitTimeLeft = 0;
function toggleHIIT(){
  if(hiitTimer){
    clearInterval(hiitTimer); hiitTimer=null;
    $('#hiit-display').textContent = '已暂停';
    return;
  }
  const work = parseInt($('#hiit-work').value)||30;
  const rest = parseInt($('#hiit-rest').value)||15;
  const rounds = parseInt($('#hiit-rounds').value)||8;
  $('#hiit-tot-round').textContent = rounds;
  if(hiitState==='idle' || hiitRound>=rounds){
    hiitRound = 0; hiitPhase='work'; hiitTimeLeft = work;
  }
  runHIIT();
}
function runHIIT(){
  const work = parseInt($('#hiit-work').value)||30;
  const rest = parseInt($('#hiit-rest').value)||15;
  const rounds = parseInt($('#hiit-rounds').value)||8;
  hiitState = 'running';
  hiitTimer = setInterval(()=>{
    if(hiitTimeLeft<=0){
      if(hiitPhase==='work'){
        hiitPhase='rest'; hiitTimeLeft=rest;
        $('#hiit-display').textContent='休息';
        $('#hiit-display').style.color='var(--blue)';
        try{ beep(400); }catch(e){}
      } else {
        hiitRound++;
        $('#hiit-cur-round').textContent = hiitRound;
        if(hiitRound>=rounds){
          clearInterval(hiitTimer); hiitTimer=null; hiitState='done';
          $('#hiit-display').textContent='完成!';
          $('#hiit-display').style.color='var(--green)';
          toast('HIIT训练完成! 🔥');
          return;
        }
        hiitPhase='work'; hiitTimeLeft=work;
        $('#hiit-display').textContent='运动';
        $('#hiit-display').style.color='var(--red)';
        try{ beep(800); }catch(e){}
      }
    }
    $('#hiit-display').textContent = (hiitPhase==='work'?'运动':'休息') + ' ' + hiitTimeLeft;
    $('#hiit-display').style.color = hiitPhase==='work'?'var(--gold)':'var(--blue)';
    hiitTimeLeft--;
  },1000);
}
function resetHIIT(){
  clearInterval(hiitTimer); hiitTimer=null;
  hiitState='idle'; hiitRound=0; hiitPhase='work'; hiitTimeLeft=0;
  $('#hiit-cur-round').textContent = '0';
  $('#hiit-display').textContent = '准备';
  $('#hiit-display').style.color = 'var(--gold)';
}

// 秒表
let swTimer = null, swTime = 0, swStart = 0, swRunning = false, swLaps = [];
function toggleSW(){
  if(swRunning){
    clearInterval(swTimer); swRunning=false;
    $('#sw-start').innerHTML='<i class="fa-solid fa-play"></i> 继续';
  } else {
    if(swTime===0) swStart = Date.now();
    else swStart = Date.now() - swTime;
    swRunning = true;
    $('#sw-start').innerHTML='<i class="fa-solid fa-pause"></i> 暂停';
    swTimer = setInterval(()=>{
      swTime = Date.now() - swStart;
      updateSWDisplay();
    }, 10);
  }
}
function updateSWDisplay(){
  const ms = Math.floor((swTime%1000)/10);
  const s = Math.floor(swTime/1000)%60;
  const m = Math.floor(swTime/60000);
  $('#sw-display').textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(ms).padStart(2,'0')}`;
}
function lapSW(){
  if(!swRunning) return;
  swLaps.unshift(swTime);
  const el = $('#sw-laps');
  el.innerHTML = swLaps.map((l,i)=>{
    const ms = Math.floor((l%1000)/10);
    const s = Math.floor(l/1000)%60;
    const m = Math.floor(l/60000);
    return `<div class="flex items-center justify-between" style="padding:6px 0;border-bottom:1px solid var(--border);">
      <span class="text-muted">第 ${swLaps.length-i} 圈</span>
      <span class="text-gold" style="font-family:Oswald;">${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(ms).padStart(2,'0')}</span>
    </div>`;
  }).join('');
}
function resetSW(){
  clearInterval(swTimer); swRunning=false; swTime=0; swLaps=[];
  $('#sw-start').innerHTML='<i class="fa-solid fa-play"></i> 开始';
  updateSWDisplay();
  $('#sw-laps').innerHTML='';
}

// 蜂鸣音
function beep(freq=600){
  try{
    const ctx = new (window.AudioContext||window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime+0.5);
    osc.start(); osc.stop(ctx.currentTime+0.5);
  }catch(e){}
}

/* ============== 设置 ============== */
function renderProfile(){
  const p = state.profile;
  const devYear = $('#dev-year');
  if(devYear) devYear.textContent = new Date().getFullYear();
  $('#profile-name').value = p.name||'';
  $('#profile-gender').value = p.gender||'male';
  $('#profile-age').value = p.age||'';
  $('#profile-height').value = p.height||'';
  $('#profile-weight').value = p.weight||'';
  $('#profile-goal').value = p.goal||'bulk';
  $('#profile-level').value = p.level||'beginner';
  const initial = (p.name||'F').charAt(0).toUpperCase();
  $('#profile-avatar').textContent = initial;
  $('#user-avatar').textContent = initial;
  $('#user-name-top').textContent = p.name||'FORGE';
  $('#profile-name-display').textContent = p.name||'未设置';
  const levelNames = {beginner:'初级训练者', intermediate:'中级训练者', advanced:'高级训练者'};
  $('#profile-level-display').textContent = levelNames[p.level]||'初级训练者';

  // 统计
  const totalVol = state.workouts.reduce((s,w)=>s+workoutVolume(w),0);
  const lastM = state.measurements[state.measurements.length-1];
  $('#profile-stats').innerHTML = `
    <div class="stats-grid" style="grid-template-columns:1fr 1fr;">
      <div class="stat-card">
        <div class="stat-label">总训练次数</div>
        <div class="stat-value" style="font-size:24px;">${state.totalWorkouts}<span class="unit">次</span></div>
      </div>
      <div class="stat-card red">
        <div class="stat-label">连续天数</div>
        <div class="stat-value" style="font-size:24px;">${state.streak}<span class="unit">天</span></div>
      </div>
      <div class="stat-card green">
        <div class="stat-label">总训练量</div>
        <div class="stat-value" style="font-size:24px;">${Math.round(totalVol).toLocaleString()}<span class="unit">kg</span></div>
      </div>
      <div class="stat-card blue">
        <div class="stat-label">身体部位</div>
        <div class="stat-value" style="font-size:24px;">${state.trainedParts}<span class="unit">/8</span></div>
      </div>
    </div>
    <div class="card mt-3" style="background:var(--bg-dark);">
      <div class="card-title mb-1">训练目标</div>
      <p class="text-secondary" style="font-size:13px;">${
        p.goal==='bulk'?'增肌期:热量盈余,高蛋白饮食,大重量训练':
        p.goal==='cut'?'减脂期:热量缺口,保留肌肉,力量+有氧':
        p.goal==='strength'?'力量期:大重量低次数,长休息':
        '维持期:均衡训练与饮食'
      }</p>
    </div>
    <button class="btn btn-danger btn-block mt-3" onclick="resetAllData()"><i class="fa-solid fa-triangle-exclamation"></i> 清空训练数据(保留基本信息)</button>
  `;
}

function saveProfile(){
  state.profile = {
    name: $('#profile-name').value || 'FORGE',
    gender: $('#profile-gender').value,
    age: parseInt($('#profile-age').value)||0,
    height: parseFloat($('#profile-height').value)||0,
    weight: parseFloat($('#profile-weight').value)||0,
    goal: $('#profile-goal').value,
    level: $('#profile-level').value,
  };
  save();
  renderProfile();
  toast('资料已保存');
}

function resetAllData(){
  if(!confirm('确定清空所有数据?此操作不可恢复!\n(将保留您已设置的基本信息)')) return;
  if(!confirm('再次确认:所有训练记录、身体数据、PR记录将被永久删除!\n基本信息(姓名/性别/年龄/身高/体重/目标/级别)将被保留。')) return;
  const keepProfile = state.profile;
  state = {
    profile: keepProfile,
    workouts: [], measurements: [], prs: { bench:0, squat:0, deadlift:0, opress:0, row:0 },
    achievements: [], streak:0, lastWorkoutDate:null, totalWorkouts:0, trainedParts:0,
    customParts: [], customExercises: [], customEquipment: [],
  };
  activeSession = null;
  localStorage.removeItem(SESSION_KEY);
  save();
  toast('已清空所有训练数据,基本信息已保留');
  navigate('dashboard');
}

/* ============== 成就系统 ============== */
function renderAchievements(){
  const unlocked = ACHIEVEMENTS.filter(a=>a.cond(state));
  $('#ach-unlocked').innerHTML = `${unlocked.length}<span class="unit">/${ACHIEVEMENTS.length}</span>`;
  $('#ach-percent').innerHTML = `${Math.round(unlocked.length/ACHIEVEMENTS.length*100)}<span class="unit">%</span>`;

  $('#achievements-grid').innerHTML = ACHIEVEMENTS.map(a=>{
    const isUnlocked = a.cond(state);
    return `
      <div class="card" style="text-align:center;${isUnlocked?'border-color:var(--gold-dark);box-shadow:var(--shadow-gold);':'opacity:0.5;'}">
        <div style="font-size:36px;margin-bottom:8px;color:${isUnlocked?'var(--gold)':'var(--text-muted)'};">
          <i class="fa-solid ${a.icon}"></i>
        </div>
        <div class="card-title" style="font-size:16px;">${a.name}</div>
        <div class="text-muted mt-1" style="font-size:12px;">${a.desc}</div>
        ${isUnlocked?'<div class="badge badge-gold mt-2"><i class="fa-solid fa-check"></i> 已解锁</div>':'<div class="badge badge-gray mt-2">未解锁</div>'}
      </div>
    `;
  }).join('');
}

function checkAchievements(){
  ACHIEVEMENTS.forEach(a=>{
    if(a.cond(state) && !state.achievements.includes(a.id)){
      state.achievements.push(a.id);
      toast(`🏆 成就解锁: ${a.name}`);
    }
  });
  save();
}

/* ============== 初始化 ============== */
function init(){
  load();

  // 日期
  const now = new Date();
  $('#topbar-date').textContent = now.toLocaleDateString('zh-CN', {year:'numeric',month:'long',day:'numeric',weekday:'long'});

  // 渲染各页面
  renderDashboard();
  renderPlans();
  renderLibrary();
  renderNutrition();
  renderProfile();
  renderAchievements();
  renderHistory();
  renderProgress();

  // 头像
  const initial = (state.profile.name||'F').charAt(0).toUpperCase();
  $('#user-avatar').textContent = initial;
  $('#user-name-top').textContent = state.profile.name||'FORGE';

  // 如果有进行中的训练,提示
  if(activeSession && activeSession.exercises && activeSession.exercises.length>0){
    setTimeout(()=>toast('有未完成的训练: '+activeSession.name, 'info'), 500);
  }
}

document.addEventListener('DOMContentLoaded', init);
