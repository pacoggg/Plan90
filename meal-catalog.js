// Catálogo de platos y sustitución de comidas.
// Se carga después de app-main.js para reutilizar la API y el estado de Plan90.
(() => {
  const state = {query:'', category:'Todos', targetDay:null, targetIndex:null};

  function cleanTitle(title) {
    return String(title || '').replace(/ · \d+ kcal$/,'').trim();
  }

  function slug(text) {
    return String(text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  }

  function inferCategory(title) {
    const t=slug(title);
    if (/yogur|avena|porridge|tostad|desayuno/.test(t)) return 'Desayunos';
    if (/fruta|queso fresco|almendra|nueces|merienda/.test(t)) return 'Meriendas';
    if (/crema|tortilla|revuelto|ensalada|pescado blanco/.test(t)) return 'Cenas';
    return 'Comidas';
  }

  function tagsFor(title) {
    const t=slug(title); const tags=[];
    if (/pollo|pavo|hamburguesa/.test(t)) tags.push('Carne');
    if (/merluza|salmon|bacalao|dorada|atun|pescado|marisco|gamba/.test(t)) tags.push('Pescado');
    if (/garbanzo|lenteja/.test(t)) tags.push('Legumbres');
    if (/arroz|pasta|cuscus|patata|boniato|pan|tortilla integral/.test(t)) tags.push('Hidratos');
    if (/tortilla|huevo|revuelto/.test(t)) tags.push('Huevo');
    if (/verdura|ensalada|calabacin|espinaca|calabaza|seta/.test(t)) tags.push('Verduras');
    return tags;
  }

  function buildCatalog() {
    const byTitle=new Map();
    Object.entries(recipes).forEach(([key,r])=>{
      byTitle.set(cleanTitle(r.title), {
        title:cleanTitle(r.title), key, category:inferCategory(r.title), tags:tagsFor(r.title),
        time:r.time || '', calories:r.calories || '', protein:r.protein || '', source:'paco'
      });
    });
    Object.entries(montseRecipes).forEach(([title,r])=>{
      const name=cleanTitle(title);
      if (!byTitle.has(name)) byTitle.set(name, {title:name,key:'',category:inferCategory(name),tags:tagsFor(name),time:r.time||'',calories:'',protein:'',source:'montse'});
    });
    [weeklyMenu,montseMenu].forEach(menu=>Object.values(menu).flat().forEach(([,title,key])=>{
      const name=cleanTitle(title);
      if(name && !byTitle.has(name)) byTitle.set(name,{title:name,key:key||'',category:inferCategory(name),tags:tagsFor(name),time:'',calories:'',protein:'',source:'menu'});
    }));
    return [...byTitle.values()].sort((a,b)=>a.category.localeCompare(b.category,'es') || a.title.localeCompare(b.title,'es'));
  }

  function ensureUI() {
    if ($('#catalogBtn')) return;
    const menuTitle=document.querySelector('#menu .sticky-title');
    const actions=document.createElement('div');
    actions.className='menu-tools';
    actions.innerHTML='<button id="catalogBtn" class="secondary">Platos y recetas</button>';
    menuTitle.insertAdjacentElement('afterend',actions);

    const dialog=document.createElement('dialog');
    dialog.id='catalogDialog'; dialog.className='dialog catalog-dialog';
    dialog.innerHTML=`<button class="dialog-close" aria-label="Cerrar">×</button>
      <div class="sources-content">
        <p class="eyebrow">CATÁLOGO</p><h2>Platos y recetas</h2>
        <p class="muted">Consulta el repertorio y usa cualquier plato para sustituir una comida de tu semana.</p>
        <div id="catalogTarget" class="catalog-target hidden"></div>
        <input id="catalogSearch" class="catalog-search" type="search" placeholder="Buscar plato…" autocomplete="off" />
        <div id="catalogFilters" class="catalog-filters"></div>
        <div id="catalogList" class="catalog-list"></div>
      </div>`;
    document.body.appendChild(dialog);

    const style=document.createElement('style');
    style.textContent=`
      .menu-tools{display:flex;gap:10px;margin:-4px 0 14px}.menu-tools button{flex:1}
      .catalog-dialog{width:min(760px,94vw)}.catalog-search{width:100%;margin:10px 0 12px;padding:12px 14px;border:1px solid #cad8d3;border-radius:12px;font:inherit}
      .catalog-filters{display:flex;gap:8px;overflow-x:auto;padding-bottom:8px}.catalog-filters button{white-space:nowrap}
      .catalog-list{display:grid;gap:10px;margin-top:8px}.catalog-card{border:1px solid #dfe8e4;border-radius:14px;padding:14px;background:#fff}
      .catalog-card h3{margin:0 0 7px}.catalog-meta{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0}.catalog-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
      .catalog-target{padding:10px 12px;border-radius:12px;background:#eef7f4;margin:10px 0}.catalog-target.hidden{display:none}
      .meal-change-button{margin-left:8px}
    `;
    document.head.appendChild(style);

    $('#catalogBtn').onclick=()=>openCatalog();
    dialog.querySelector('.dialog-close').onclick=()=>dialog.close();
    $('#catalogSearch').addEventListener('input',e=>{state.query=e.target.value;renderCatalog();});
  }

  function renderFilters() {
    const cats=['Todos','Desayunos','Comidas','Cenas','Meriendas'];
    $('#catalogFilters').innerHTML=cats.map(cat=>`<button class="${cat===state.category?'primary':'secondary'}" data-cat="${cat}">${cat}</button>`).join('');
    $$('[data-cat]').forEach(b=>b.onclick=()=>{state.category=b.dataset.cat;renderCatalog();});
  }

  function recipeAvailable(item) {
    if (activeProfileId==='montse') return Boolean(montseRecipes[item.title] || Object.values(recipes).some(r=>cleanTitle(r.title)===item.title));
    return Boolean(item.key && recipes[item.key]);
  }

  function renderCatalog() {
    renderFilters();
    const q=slug(state.query);
    const items=buildCatalog().filter(item => (state.category==='Todos' || item.category===state.category) && (!q || slug(`${item.title} ${item.tags.join(' ')}`).includes(q)));
    $('#catalogList').innerHTML=items.length ? items.map((item,i)=>`
      <article class="catalog-card">
        <span class="label">${escapeHtml(item.category)}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <div class="catalog-meta">${item.time?`<span class="pill">${escapeHtml(item.time)}</span>`:''}${item.calories?`<span class="pill">≈ ${escapeHtml(item.calories)} kcal</span>`:''}${item.protein?`<span class="pill">${escapeHtml(item.protein)} proteína</span>`:''}${item.tags.slice(0,3).map(t=>`<span class="pill">${escapeHtml(t)}</span>`).join('')}</div>
        <div class="catalog-actions">${recipeAvailable(item)?`<button class="secondary" data-catalog-recipe="${i}">Ver receta</button>`:''}<button class="primary" data-use-dish="${i}">${state.targetDay?'Sustituir por este':'Usar este plato'}</button></div>
      </article>`).join('') : '<p class="empty">No hay platos que coincidan con la búsqueda.</p>';
    const visible=items;
    $$('[data-catalog-recipe]').forEach(b=>b.onclick=()=>openCatalogRecipe(visible[Number(b.dataset.catalogRecipe)]));
    $$('[data-use-dish]').forEach(b=>b.onclick=()=>chooseTarget(visible[Number(b.dataset.useDish)]));
  }

  function openCatalogRecipe(item) {
    const pacoEntry=Object.entries(recipes).find(([,r])=>cleanTitle(r.title)===item.title);
    if(activeProfileId!=='montse' && pacoEntry) return openRecipe(pacoEntry[0]);
    if(activeProfileId==='montse' && montseRecipes[item.title]) return openMontseRecipe('',item.title);
    if(pacoEntry) return openRecipe(pacoEntry[0]);
  }

  function openCatalog(day=null,index=null) {
    ensureUI(); state.targetDay=day; state.targetIndex=index; state.query=''; state.category='Todos';
    $('#catalogSearch').value='';
    const target=$('#catalogTarget');
    if(day!=null && index!=null){const meal=getMenu()[day][index];target.textContent=`Vas a sustituir: ${day} · ${meal[0]} · ${cleanTitle(meal[1])}`;target.classList.remove('hidden');}
    else target.classList.add('hidden');
    renderCatalog(); $('#catalogDialog').showModal();
  }

  function chooseTarget(item) {
    if(state.targetDay!=null && state.targetIndex!=null) return replaceMeal(state.targetDay,state.targetIndex,item);
    const menu=getMenu();
    $('#catalogTarget').classList.remove('hidden');
    $('#catalogTarget').innerHTML=`<strong>¿Dónde quieres usar “${escapeHtml(item.title)}”?</strong><label>Día<select id="catalogDay">${menuDays.map(d=>`<option>${d}</option>`).join('')}</select></label><label>Comida<select id="catalogMeal"></select></label><button id="catalogConfirm" class="primary full">Sustituir plato</button>`;
    const day=$('#catalogDay'), meal=$('#catalogMeal');
    const fill=()=>{meal.innerHTML=(menu[day.value]||[]).map((m,i)=>`<option value="${i}">${escapeHtml(m[0])}: ${escapeHtml(cleanTitle(m[1]))}</option>`).join('');};
    day.onchange=fill; fill(); $('#catalogConfirm').onclick=()=>replaceMeal(day.value,Number(meal.value),item);
  }

  async function replaceMeal(day,index,item) {
    const next=JSON.parse(JSON.stringify(getMenu()));
    const type=next[day][index][0];
    let title=item.title, key='';
    if(activeProfileId==='montse') {
      // Si existe receta específica de Montse, conserva el título limpio para que la app la encuentre.
      title=item.title; key='';
    } else {
      const entry=Object.entries(recipes).find(([,r])=>cleanTitle(r.title)===item.title);
      key=entry?.[0] || item.key || '';
    }
    next[day][index]=[type,title,key];
    try {
      const saved=await apiJson('/api/menu',{method:'PUT',body:JSON.stringify(next)});
      serverMenu=saved.menu; state.targetDay=null; state.targetIndex=null;
      $('#catalogDialog').close(); renderMeals(); renderDashboard(); showToast(`${type} del ${day} actualizada`);
    } catch(error){showToast(error.message);}
  }

  const originalRenderMeals=renderMeals;
  renderMeals=function(){
    originalRenderMeals();
    $$('#mealList .meal-card').forEach((card,index)=>{
      const btn=document.createElement('button'); btn.className='secondary meal-change-button'; btn.textContent='Cambiar plato';
      btn.onclick=()=>openCatalog(selectedDay,index); const header=card.querySelector('header'); if(header) header.appendChild(btn); else card.appendChild(btn);
    });
  };

  ensureUI();
  if(activeProfileId) renderMeals();
})();
