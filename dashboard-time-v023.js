/* Plan90 v0.2.3 · Actualización horaria del inicio */
(function () {
  function localISO(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function mealIndexForHour(hour) {
    if (hour >= 20) return 3; // Cena
    if (hour >= 16) return 2; // Merienda
    if (hour >= 12) return 1; // Comida
    return 0;                 // Desayuno
  }

  // Evita problemas de fecha UTC cerca de medianoche.
  todayISO = function () {
    return localISO();
  };

  renderDashboard = function () {
    const profile = getProfile();
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
    $('.progress-ring').style.background = `conic-gradient(var(--primary) ${pct * 3.6}deg, #dce8e3 0deg)`;

    const now = new Date();
    const dayName = days[now.getDay()];
    $('#todayName').textContent = dayName;
    $('#todayDate').textContent = now.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });

    const workout = getWorkouts().find(item => item.day === dayName);
    const workoutDone = data.completed[dayName] === localISO(now);
    $('#todayWorkout').textContent = workout ? `${workout.type} · ${workout.detail}` : 'Descanso';

    const workoutButton = document.querySelector('.today-card .today-row button[data-go="ejercicio"]');
    if (workoutButton) {
      workoutButton.textContent = workoutDone ? 'Completado' : 'Empezar';
      workoutButton.disabled = workoutDone;
      workoutButton.classList.toggle('secondary', workoutDone);
      workoutButton.classList.toggle('primary', !workoutDone);
      workoutButton.setAttribute('aria-disabled', workoutDone ? 'true' : 'false');
    }

    const menu = getMenu()[dayName];
    if (menu && menu.length) {
      const meal = menu[Math.min(mealIndexForHour(now.getHours()), menu.length - 1)];
      $('#nextMeal').textContent = `${meal[0]}: ${meal[1]}`;
    } else {
      $('#nextMeal').textContent = 'Consulta el menú del día';
    }

    renderMiniChart(data.weights);
  };

  completeDay = function (day) {
    const data = getData();
    data.completed[day] = localISO();
    saveData(data);
    renderWorkouts();
    renderDashboard();
  };

  function refreshTimeSensitiveContent() {
    renderDashboard();
    if (document.querySelector('#ejercicio.screen.active')) renderWorkouts();
  }

  refreshTimeSensitiveContent();
  window.setInterval(refreshTimeSensitiveContent, 60 * 1000);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) refreshTimeSensitiveContent();
  });
})();
