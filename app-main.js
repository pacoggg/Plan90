const $$ = s => [...document.querySelectorAll(s)];

let serverProgress = {weights:[],completed:{}};
let serverMenu = null;

async function apiJson(path, options={}) {
  const response = await fetch(path, {
    ...options,
    headers: options.body ? {'Content-Type':'application/json',...(options.headers||{})} : options.headers
  });
  const payload = await response.json().catch(()=>({}));
  if (!response.ok) throw new Error(payload.error || 'No se pudo completar la operación');
  return payload;
}

function showToast(message) {
  const toast=$('#toast');
  toast.textContent=message; toast.classList.remove('hidden');
  clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>toast.classList.add('hidden'),2600);
}

function escapeHtml(value) {
  return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
}

function getData() {
  return serverProgress;
}
function getProfile() { return profiles[activeProfileId] || profiles.yo; }
function getWorkouts() { return activeProfileId==='montse' ? montseWorkouts : weeklyWorkouts; }
function getDefaultMenu() { return activeProfileId==='montse' ? montseMenu : weeklyMenu; }
function getMenu() { return serverMenu || getDefaultMenu(); }
function saveData(data) {
  serverProgress=data;
  apiJson('/api/progress',{method:'PUT',body:JSON.stringify(serverProgress)}).then(()=>showToast('Progreso guardado')).catch(error=>showToast(error.message));
}
function formatNumber(n) { return Number(n).toLocaleString('es-ES',{minimumFractionDigits:1,maximumFractionDigits:1}); }
function todayISO() { return new Date().toISOString().slice(0,10); }

function renderDashboard() {
  const profile=getProfile();
  const data = getData();
  const latest = data.weights.length ? data.weights[0].weight : profile.startWeight;
  const lost = Math.max(0, profile.startWeight - latest);
  const remaining = Math.max(0, latest - profile.targetWeight);
  const total = profile.startWeight - profile.targetWeight;
  const pct = Math.min(100, Math.round((lost / total) * 100));
  $('#currentWeight').textContent = formatNumber(latest);
  $('#lostWeight').textContent = `${formatNumber(lost)} kg`;
  $('#remainingWeight').textContent = `${formatNumber(remaining)} kg`;
  $('#progressPercent').textContent = `${pct}%`;
  $('.progress-ring').style.background = `conic-gradient(var(--primary) ${pct*3.6}deg, #dce8e3 0deg)`;

  const now = new Date();
  const dayName = days[now.getDay()];
  $('#todayName').textContent = dayName;
  $('#todayDate').textContent = now.toLocaleDateString('es-ES',{day:'2-digit',month:'short'});
  const workout = getWorkouts().find(w => w.day === dayName);
  $('#todayWorkout').textContent = workout ? `${workout.type} · ${workout.detail}` : 'Descanso';
  const menu = getMenu()[dayName];
  $('#nextMeal').textContent = menu ? menu[1][1] : 'Consulta el menú del día';
  renderMiniChart(data.weights);
}

function renderMiniChart(weights) {
  const el = $('#miniChart');
  const rows = weights.slice(0,7).reverse();
  if (!rows.length) { el.innerHTML = '<p class="empty">Registra tu primer peso para ver la gráfica.</p>'; return; }
  const vals = rows.map(r => r.weight);
  const min = Math.min(...vals) - .5;
  const max = Math.max(...vals) + .5;
  el.innerHTML = rows.map(r => {
    const h = 28 + ((r.weight-min)/(max-min||1))*60;
    return `<div class="chart-bar" style="height:${h}px" title="${r.weight} kg"><span>${new Date(r.date).toLocaleDateString('es-ES',{day:'2-digit',month:'2-digit'})}</span></div>`;
  }).join('');
}

function renderMenuTabs() {
  $('#dayTabs').innerHTML = menuDays.map(day => `<button class="day-tab ${day===selectedDay?'active':''}" data-day="${day}">${day.slice(0,3)}</button>`).join('');
  $$('.day-tab').forEach(btn => btn.addEventListener('click', () => { selectedDay=btn.dataset.day; renderMenuTabs(); renderMeals(); }));
}
function renderMeals() {
  $('#mealList').innerHTML = getMenu()[selectedDay].map(([type,title,key]) => `
    <article class="meal-card">
      <header><div><span class="label">${escapeHtml(type)}</span><h3>${escapeHtml(title)}</h3></div>${key && recipes[key]?'<span class="pill">Receta</span>':''}</header>
      ${key && recipes[key] ? `<button class="secondary recipe-button" data-recipe="${escapeHtml(key)}">Ver receta completa</button>` : activeProfileId==='montse' && montseRecipes[title.replace(/ · \d+ kcal$/,'')] ? `<button class="secondary recipe-button" data-montse-recipe="${escapeHtml(type)}" data-montse-title="${escapeHtml(title)}">Ver receta</button>` : '<p class="meal-meta">Opción personalizada.</p>'}
    </article>`).join('');
  $$('[data-recipe]').forEach(btn => btn.addEventListener('click', () => openRecipe(btn.dataset.recipe)));
  $$('[data-montse-recipe]').forEach(btn => btn.addEventListener('click', () => openMontseRecipe(btn.dataset.montseRecipe,btn.dataset.montseTitle)));
}

function openMenuEditor() {
  const meals=(getMenu()[selectedDay] || []).map(row=>[...row]);
  $('#editMenuTitle').textContent=`Editar ${selectedDay}`;
  $('#editMenuForm').innerHTML=meals.map((meal,index)=>`<label class="meal-edit-row"><span>${escapeHtml(meal[0])}</span><input name="meal-${index}" value="${escapeHtml(meal[1])}" maxlength="240" required /></label>`).join('')+'<button class="primary full" type="submit">Guardar menú</button>';
  $('#editMenuForm').onsubmit=async event=>{
    event.preventDefault();
    const next=JSON.parse(JSON.stringify(getMenu()));
    meals.forEach((meal,index)=>meal[1]=event.target.elements[`meal-${index}`].value.trim());
    next[selectedDay]=meals;
    try {
      const saved=await apiJson('/api/menu',{method:'PUT',body:JSON.stringify(next)});
      serverMenu=saved.menu; renderMeals(); $('#editMenuDialog').close(); showToast('Menú actualizado');
    } catch(error) { showToast(error.message); }
  };
  $('#editMenuDialog').showModal();
}
function openMontseRecipe(type,title) {
  const cleanTitle=title.replace(/ · \d+ kcal$/,'');
  const recipe=montseRecipes[cleanTitle];
  if(!recipe) throw new Error(`Falta la receta de Montse: ${cleanTitle}`);
  const calories=title.match(/\d+(?= kcal)/)?.[0]||'';
  $('#recipeContent').innerHTML=`<div class="recipe-hero"><p class="eyebrow">RECETA DE MONTSE</p><h2>${cleanTitle}</h2></div><div class="recipe-grid"><div class="recipe-stat"><strong>${recipe.time}</strong><small>Tiempo</small></div><div class="recipe-stat"><strong>≈ ${calories}</strong><small>kcal aprox.</small></div><div class="recipe-stat"><strong>1 persona</strong><small>Ración</small></div></div><h3>Ingredientes</h3><ul>${recipe.ingredients.map(x=>`<li>${x}</li>`).join('')}</ul><h3>Preparación</h3><ol>${recipe.steps.map(x=>`<li>${x}</li>`).join('')}</ol><p class="muted">Cantidades orientativas para la ración indicada en el menú de Montse.</p>`;
  $('#recipeDialog').showModal();
}
function openRecipe(key) {
  const r = recipes[key];
  $('#recipeContent').innerHTML = `
    <div class="recipe-hero"><p class="eyebrow">RECETA REAL</p><h2>${r.title}</h2></div>
    <div class="recipe-grid">
      <div class="recipe-stat"><strong>${r.time}</strong><small>Tiempo</small></div>
      <div class="recipe-stat"><strong>${r.calories}</strong><small>kcal aprox.</small></div>
      <div class="recipe-stat"><strong>${r.protein}</strong><small>Proteína</small></div>
    </div>
    <h3>Ingredientes</h3><ul>${r.ingredients.map(x=>`<li>${x}</li>`).join('')}</ul>
    <h3>Preparación</h3><ol>${r.steps.map(x=>`<li>${x}</li>`).join('')}</ol>
    <p class="muted">Las cantidades son orientativas y están pensadas para una persona.</p>`;
  $('#recipeDialog').showModal();
}

function renderWorkouts() {
  const data = getData();
  const workouts=getWorkouts();
  $('#workoutTabs').innerHTML = menuDays.map(day => `<button class="day-tab ${day===selectedWorkoutDay?'active':''}" data-workout-day="${day}">${day.slice(0,3)}</button>`).join('');
  $$('[data-workout-day]').forEach(btn=>btn.onclick=()=>{selectedWorkoutDay=btn.dataset.workoutDay;renderWorkouts();});
  const i=workouts.findIndex(w=>w.day===selectedWorkoutDay);
  const w=workouts[i] || workouts[0];
  const done = data.completed[w.day] === todayISO();
  $('#workoutWeek').innerHTML = `<article class="workout-card ${done?'done':''}">
      <header><div><span class="label">${w.day}</span><h3>${w.type}</h3><p class="meal-meta">${w.detail}</p></div><span class="pill">${done?'Hecho':'Semana 1'}</span></header>
      <div class="workout-actions">
        ${w.exercises.length?`<button class="primary" data-start-workout="${i}">Empezar rutina</button>`:`<button class="secondary" data-complete="${w.day}">${done?'Completado':'Marcar como hecho'}</button>`}
      </div>
    </article>`;
  $$('[data-start-workout]').forEach(b=>b.addEventListener('click',()=>startWorkout(Number(b.dataset.startWorkout))));
  $$('[data-complete]').forEach(b=>b.addEventListener('click',()=>completeDay(b.dataset.complete)));
}
function completeDay(day) {
  const data=getData(); data.completed[day]=todayISO(); saveData(data); renderWorkouts();
}

function startWorkout(index) {
  const workout=getWorkouts()[index];
  workoutState = {workoutIndex:index, exerciseIndex:0, round:1, totalRounds:activeProfileId==='montse'?1:2, exercises:workout.exercises, running:false, remaining:workout.exercises[0].seconds};
  renderWorkoutDialog(); $('#workoutDialog').showModal();
}
function renderWorkoutDialog() {
  const ex = workoutState.exercises[workoutState.exerciseIndex];
  $('#workoutContent').innerHTML = `
    <p class="eyebrow">VUELTA ${workoutState.round} DE ${workoutState.totalRounds} · EJERCICIO ${workoutState.exerciseIndex+1} DE ${workoutState.exercises.length}</p>
    <div class="exercise-name">${ex.name}</div>
    <div class="exercise-visual-card"><img class="exercise-figure" src="assets/exercises/${ex.visual}.png" alt="Ilustración del ejercicio: ${ex.name}"><div><strong>Posición de referencia</strong><small>Ilustración original · músculos principales en color</small></div></div>
    <p><strong>${ex.reps}</strong></p><p class="muted">${ex.cue}</p>
    <div id="timer" class="timer">${workoutState.remaining}</div>
    <div class="timer-actions"><button id="timerToggle" class="primary">${workoutState.running?'Pausar':'Empezar'}</button><button id="nextExercise" class="secondary">Siguiente</button></div>
    <p class="muted" style="margin-top:14px">No aguantes la respiración. Detente ante mareo, dolor torácico o falta de aire anormal.</p>`;
  $('#timerToggle').onclick = toggleTimer;
  $('#nextExercise').onclick = nextExercise;
}
function toggleTimer() {
  workoutState.running = !workoutState.running;
  if (workoutState.running) {
    timerId = setInterval(()=>{
      workoutState.remaining--;
      const t=$('#timer'); if(t) t.textContent=workoutState.remaining;
      if(workoutState.remaining<=0) nextExercise();
    },1000);
  } else clearInterval(timerId);
  renderWorkoutDialog();
}
function nextExercise() {
  clearInterval(timerId);
  workoutState.running=false;
  workoutState.exerciseIndex++;
  if (workoutState.exerciseIndex >= workoutState.exercises.length) {
    if (workoutState.round < workoutState.totalRounds) { workoutState.round++; workoutState.exerciseIndex=0; }
    else {
      completeDay(getWorkouts()[workoutState.workoutIndex].day);
      $('#workoutContent').innerHTML='<div class="recipe-hero"><p class="eyebrow">ENTRENAMIENTO COMPLETADO</p><h2>Buen trabajo</h2><p>Has terminado la rutina de hoy.</p></div><button class="primary full" id="finishWorkout">Cerrar</button>';
      $('#finishWorkout').onclick=()=>$('#workoutDialog').close(); return;
    }
  }
  workoutState.remaining=workoutState.exercises[workoutState.exerciseIndex].seconds;
  renderWorkoutDialog();
}

function renderHistory() {
  const data=getData();
  $('#weightHistory').innerHTML = data.weights.length ? data.weights.map((r,i)=>`
    <div class="history-row"><div><strong>${formatNumber(r.weight)} kg</strong><br><small>${new Date(r.date).toLocaleDateString('es-ES',{weekday:'short',day:'2-digit',month:'short',year:'numeric'})}${r.waist?` · Cintura ${formatNumber(r.waist)} cm`:''}</small></div><button class="link-button" data-delete-weight="${i}">Eliminar</button></div>`).join('') : '<p class="empty">Todavía no hay registros.</p>';
  $$('[data-delete-weight]').forEach(b=>b.onclick=()=>{const d=getData();d.weights.splice(Number(b.dataset.deleteWeight),1);saveData(d);renderHistory();renderDashboard();});
}

function navigate(screen) {
  $$('.screen').forEach(s=>s.classList.toggle('active',s.id===screen));
  $$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.screen===screen));
  if(screen==='progreso') renderHistory();
  if(screen==='ejercicio') renderWorkouts();
  window.scrollTo({top:0,behavior:'smooth'});
}
function renderProfile() {
  const profile=getProfile();
  $('#profileName').textContent=profile.name;
  $('#profileGoal').textContent=`Objetivo inicial: ${formatNumber(profile.targetWeight)} kg`;
  $('#menuGuidance').textContent=activeProfileId==='montse' ? 'Pauta orientativa: unas 1.400 kcal/día, con proteína, fibra y fuentes de calcio.' : 'Plan semanal flexible y sencillo.';
}
function setProfile(id) {
  activeProfileId=id; localStorage.setItem('plan90ActiveProfile',id); $('#profileDialog').close();
  renderProfile(); renderDashboard(); renderMenuTabs(); renderMeals(); renderWorkouts(); renderHistory();
}

$$('.nav-item').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.screen)));
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.go)));
$$('.dialog-close').forEach(b=>b.addEventListener('click',()=>{clearInterval(timerId);b.closest('dialog').close();}));
$('#sourcesBtn').onclick=()=>$('#sourcesDialog').showModal();
$('#profileBtn').onclick=()=>$('#profileDialog').showModal();
$('#editMenuBtn').onclick=openMenuEditor;

$('#weightForm').addEventListener('submit', e=>{
  e.preventDefault();
  const weight=Number($('#weightInput').value); const waist=$('#waistInput').value?Number($('#waistInput').value):null;
  const data=getData();
  data.weights.unshift({date:new Date().toISOString(),weight,waist});
  data.weights=data.weights.slice(0,100);
  saveData(data); e.target.reset(); renderHistory(); renderDashboard();
});
$('#resetData').onclick=()=>{ if(confirm('¿Borrar todos tus registros y entrenamientos guardados?')) { serverProgress={weights:[],completed:{}}; saveData(serverProgress); renderHistory(); renderDashboard(); renderWorkouts(); } };

$('#exportData').onclick=async()=>{
  try {
    const payload=await apiJson('/api/export');
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
    const link=document.createElement('a'); link.href=URL.createObjectURL(blob); link.download=`plan90-${activeProfileId}-${todayISO()}.json`; link.click(); URL.revokeObjectURL(link.href);
  } catch(error) { showToast(error.message); }
};
$('#importData').onclick=()=>$('#importFile').click();
$('#importFile').onchange=async event=>{
  const file=event.target.files[0]; if(!file)return;
  try {
    const payload=JSON.parse(await file.text());
    if(!confirm('¿Importar esta copia y sustituir tus datos actuales?'))return;
    await apiJson('/api/import',{method:'POST',body:JSON.stringify({progress:payload.progress,menu:payload.menu})});
    await loadState(); showToast('Copia importada');
  } catch(error) { showToast(`No se pudo importar: ${error.message}`); }
  finally { event.target.value=''; }
};

$('#logoutBtn').onclick=async()=>{await apiJson('/api/logout',{method:'POST'});location.reload();};
$('#passwordForm').onsubmit=async event=>{
  event.preventDefault();
  try {
    await apiJson('/api/password',{method:'POST',body:JSON.stringify({currentPassword:$('#currentPassword').value,newPassword:$('#newPassword').value})});
    event.target.reset(); $('#profileDialog').close(); showToast('PIN actualizado');
  } catch(error) { showToast(error.message); }
};

window.addEventListener('beforeinstallprompt', e=>{e.preventDefault();deferredPrompt=e;$('#installBtn').classList.remove('hidden');});
$('#installBtn').onclick=async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('#installBtn').classList.add('hidden');};

async function migrateLegacyIfNeeded() {
  if(serverProgress.weights.length || Object.keys(serverProgress.completed).length)return;
  const raw=localStorage.getItem(getProfile().storageKey);
  if(!raw)return;
  try {
    const legacy=JSON.parse(raw);
    if((legacy.weights?.length || Object.keys(legacy.completed||{}).length) && confirm('Hemos encontrado progreso guardado en este navegador. ¿Importarlo a tu cuenta privada?')) {
      await apiJson('/api/import',{method:'POST',body:JSON.stringify({progress:legacy})});
      serverProgress=legacy; showToast('Progreso anterior importado');
    }
  } catch { /* Una copia antigua dañada no debe bloquear el acceso. */ }
}

async function loadState() {
  const state=await apiJson('/api/state');
  activeProfileId=state.profile.id==='montse'?'montse':'yo';
  serverProgress=state.progress || {weights:[],completed:{}};
  serverMenu=state.menu;
  await migrateLegacyIfNeeded();
  $('#accountName').textContent=state.profile.name;
  renderProfile(); renderDashboard(); renderMenuTabs(); renderMeals(); renderWorkouts(); renderHistory();
}

async function enterApp() {
  await loadState();
  $('#authScreen').classList.add('hidden'); $('#appShell').classList.remove('hidden');
}

$('#loginForm').onsubmit=async event=>{
  event.preventDefault(); $('#loginError').classList.add('hidden');
  try {
    await apiJson('/api/login',{method:'POST',body:JSON.stringify({username:$('#loginUser').value,password:$('#loginPassword').value})});
    $('#loginPassword').value=''; await enterApp();
  } catch(error) { $('#loginError').textContent=error.message; $('#loginError').classList.remove('hidden'); }
};

async function boot() {
  try {
    const session=await apiJson('/api/session');
    if(session.authenticated) await enterApp(); else $('#authScreen').classList.remove('hidden');
  } catch(error) { $('#loginError').textContent=error.message; $('#loginError').classList.remove('hidden'); $('#authScreen').classList.remove('hidden'); }
  if('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js');
}

boot();
