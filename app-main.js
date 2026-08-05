const $$ = s => [...document.querySelectorAll(s)];

function getData() {
  return JSON.parse(localStorage.getItem(getProfile().storageKey) || '{"weights":[],"completed":{}}');
}
function getProfile() { return profiles[activeProfileId] || profiles.yo; }
function getWorkouts() { return activeProfileId==='montse' ? montseWorkouts : weeklyWorkouts; }
function saveData(data) { localStorage.setItem(getProfile().storageKey, JSON.stringify(data)); }
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
  const menu = weeklyMenu[dayName];
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
  $('#mealList').innerHTML = weeklyMenu[selectedDay].map(([type,title,key]) => `
    <article class="meal-card">
      <header><div><span class="label">${type}</span><h3>${title}</h3></div>${key?'<span class="pill">Receta</span>':''}</header>
      ${key ? `<button class="secondary recipe-button" data-recipe="${key}">Ver receta completa</button>` : '<p class="meal-meta">Opción sencilla; tómala solo si tienes hambre real.</p>'}
    </article>`).join('');
  $$('[data-recipe]').forEach(btn => btn.addEventListener('click', () => openRecipe(btn.dataset.recipe)));
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
  $('#workoutWeek').innerHTML = getWorkouts().map((w,i) => {
    const done = data.completed[w.day] === todayISO();
    return `<article class="workout-card ${done?'done':''}">
      <header><div><span class="label">${w.day}</span><h3>${w.type}</h3><p class="meal-meta">${w.detail}</p></div><span class="pill">${done?'Hecho':'Semana 1'}</span></header>
      <div class="workout-actions">
        ${w.exercises.length?`<button class="primary" data-start-workout="${i}">Empezar rutina</button>`:`<button class="secondary" data-complete="${w.day}">${done?'Completado':'Marcar como hecho'}</button>`}
      </div>
    </article>`;
  }).join('');
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
}
function setProfile(id) {
  activeProfileId=id; localStorage.setItem('plan90ActiveProfile',id); $('#profileDialog').close();
  renderProfile(); renderDashboard(); renderWorkouts(); renderHistory();
}

$$('.nav-item').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.screen)));
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.go)));
$$('.dialog-close').forEach(b=>b.addEventListener('click',()=>{clearInterval(timerId);b.closest('dialog').close();}));
$('#sourcesBtn').onclick=()=>$('#sourcesDialog').showModal();
$('#profileBtn').onclick=()=>$('#profileDialog').showModal();
$$('[data-profile]').forEach(b=>b.onclick=()=>setProfile(b.dataset.profile));

$('#weightForm').addEventListener('submit', e=>{
  e.preventDefault();
  const weight=Number($('#weightInput').value); const waist=$('#waistInput').value?Number($('#waistInput').value):null;
  const data=getData();
  data.weights.unshift({date:new Date().toISOString(),weight,waist});
  data.weights=data.weights.slice(0,100);
  saveData(data); e.target.reset(); renderHistory(); renderDashboard();
});
$('#resetData').onclick=()=>{ if(confirm('¿Borrar todos los registros y entrenamientos de este perfil?')) { localStorage.removeItem(getProfile().storageKey); renderHistory(); renderDashboard(); renderWorkouts(); } };

window.addEventListener('beforeinstallprompt', e=>{e.preventDefault();deferredPrompt=e;$('#installBtn').classList.remove('hidden');});
$('#installBtn').onclick=async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('#installBtn').classList.add('hidden');};

if('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js');
renderProfile(); renderDashboard(); renderMenuTabs(); renderMeals(); renderWorkouts(); renderHistory();
