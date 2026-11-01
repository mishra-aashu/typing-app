/**
 * TypeForge - Master Application Controller
 * Handles persistent progression, resume point, and smooth UX.
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Elements
  const typingDisplay = document.getElementById('typingDisplay');
  const caret = document.getElementById('caret');
  const hiddenInput = document.getElementById('hiddenInput');
  const keyboardContainer = document.getElementById('keyboardContainer');

  // HUD Elements
  const liveWpmVal = document.getElementById('liveWpmVal');
  const liveAccVal = document.getElementById('liveAccVal');
  const liveTimeVal = document.getElementById('liveTimeVal');
  const liveErrVal = document.getElementById('liveErrVal');
  const lessonMetaTitle = document.getElementById('lessonMetaTitle');
  const lessonMetaDesc = document.getElementById('lessonMetaDesc');

  // Controls & Dropdowns
  const difficultyTabs = document.querySelectorAll('.diff-tab');
  const lessonSelect = document.getElementById('lessonSelect');
  const restartBtn = document.getElementById('restartBtn');
  const themeSelect = document.getElementById('themeSelect');
  const switchSelect = document.getElementById('switchSelect');
  const toggleKbBtn = document.getElementById('toggleKbBtn');
  const customTextBtn = document.getElementById('customTextBtn');
  const statsModalBtn = document.getElementById('statsModalBtn');

  // Modals
  const resultsModal = document.getElementById('resultsModal');
  const customTextModal = document.getElementById('customTextModal');
  const statsModal = document.getElementById('statsModal');

  // 1. Initialize Visual Keyboard
  const keyboard = new VisualKeyboard('keyboardContainer');

  // 2. Initialize Lesson Manager
  const lessonMgr = new LessonManager();

  // 3. Initialize Stats Manager
  const statsMgr = new StatsManager();

  // 4. Initialize Typing Engine
  const engine = new TypingEngine({
    textContainer: typingDisplay,
    caret: caret,
    hiddenInput: hiddenInput,
    keyboard: keyboard,
    sound: window.soundEngine,
  });

  // Handle live metric updates on HUD
  engine.onMetricsUpdate(metrics => {
    liveWpmVal.textContent = Math.round(metrics.netWpm);
    liveAccVal.textContent = `${Math.round(metrics.accuracy)}%`;
    liveTimeVal.textContent = `${metrics.elapsedSec.toFixed(1)}s`;
    liveErrVal.textContent = metrics.errorCount;
  });

  // Populate lesson dropdown with completion status
  function updateLessonDropdown() {
    lessonSelect.innerHTML = '';
    const diff = lessonMgr.currentDifficulty;
    const lessons = lessonMgr.getLessonsForDifficulty(diff);

    lessons.forEach(l => {
      const opt = document.createElement('option');
      opt.value = l.id;
      const isDone = lessonMgr.isLessonCompleted(l.id);
      const prog = lessonMgr.getLessonProgress(l.id);
      const isCurrent = lessonMgr.activeLesson && lessonMgr.activeLesson.id === l.id;

      let badge = '';
      if (isDone) {
        badge = `[Passed: ${prog ? Math.round(prog.best_wpm) + ' WPM' : 'Done'}] `;
      } else if (isCurrent) {
        badge = '[Current] ';
      }

      opt.textContent = `${badge}${l.title} (${l.category})`;
      if (isCurrent) {
        opt.selected = true;
      }
      lessonSelect.appendChild(opt);
    });
  }

  // Handle Lesson Change
  lessonMgr.onLessonChange(lesson => {
    if (!lesson) return;
    const isDone = lessonMgr.isLessonCompleted(lesson.id);
    const statusTag = isDone ? ' <span style="color:#10b981; font-size:0.8rem; margin-left:8px;">(Passed)</span>' : '';
    
    lessonMetaTitle.innerHTML = `<span>${lesson.category}</span> — ${lesson.title}${statusTag}`;
    lessonMetaDesc.textContent = lesson.description;
    updateLessonDropdown();
    engine.loadLesson(lesson);
  });

  // Handle session completion
  engine.onComplete(async data => {
    // Show results modal
    showResultsModal(data);

    // If passed minimum requirements (>85% accuracy), mark lesson completed
    if (data.metrics.accuracy >= 85 && lessonMgr.activeLesson) {
      lessonMgr.markLessonCompleted(lessonMgr.activeLesson.id, data.metrics);
      updateLessonDropdown();
    }

    // Refresh stats in background and apply updated heatmap to keyboard
    const updatedStats = await statsMgr.fetchStats();
    if (updatedStats) {
      lessonMgr.syncProgress(updatedStats);
      if (updatedStats.key_error_heatmap) {
        keyboard.applyHeatmap(updatedStats.key_error_heatmap);
      }
    }
  });

  // Difficulty Tabs click
  difficultyTabs.forEach(tab => {
    tab.addEventListener('click', async () => {
      difficultyTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const mode = tab.dataset.diff;
      if (mode === 'dynamic') {
        await lessonMgr.loadDynamicLesson('words', 25);
      } else if (mode === 'weak_keys') {
        await lessonMgr.loadDynamicLesson('weak_keys', 25);
      } else {
        lessonMgr.setDifficulty(mode);
      }
    });
  });

  // Lesson dropdown change
  lessonSelect.addEventListener('change', e => {
    lessonMgr.selectLessonById(e.target.value);
  });

  // Restart Button
  restartBtn.addEventListener('click', () => {
    engine.reset();
  });

  // Theme selector
  const savedTheme = localStorage.getItem('typeforge_theme') || 'default';
  if (savedTheme !== 'default') {
    document.documentElement.dataset.theme = savedTheme;
    themeSelect.value = savedTheme;
  }
  themeSelect.addEventListener('change', e => {
    const th = e.target.value;
    if (th === 'default') {
      delete document.documentElement.dataset.theme;
    } else {
      document.documentElement.dataset.theme = th;
    }
    localStorage.setItem('typeforge_theme', th);
  });

  // Switch sound selector
  switchSelect.value = window.soundEngine.switchType;
  switchSelect.addEventListener('change', e => {
    window.soundEngine.setSwitchType(e.target.value);
    window.soundEngine.playKeypress(false);
  });

  // Toggle visual keyboard
  toggleKbBtn.addEventListener('click', () => {
    const kbSection = document.getElementById('keyboardSection');
    const isHidden = kbSection.style.display === 'none';
    kbSection.style.display = isHidden ? 'block' : 'none';
    toggleKbBtn.classList.toggle('active', isHidden);
  });

  // Custom Text Modal
  customTextBtn.addEventListener('click', () => {
    openModal(customTextModal);
    document.getElementById('customTextInput').focus();
  });

  document.getElementById('saveCustomTextBtn').addEventListener('click', () => {
    const title = document.getElementById('customTitleInput').value.trim() || 'Custom Drill';
    const text = document.getElementById('customTextInput').value.trim();
    if (text.length > 5) {
      lessonMgr.setCustomText(title, text);
      closeModal(customTextModal);
    }
  });

  // Stats / Achievements Modal
  statsModalBtn.addEventListener('click', async () => {
    const stats = await statsMgr.fetchStats();
    if (stats) {
      document.getElementById('statsLifetimeWpm').textContent = `${stats.highest_wpm.toFixed(1)} WPM`;
      document.getElementById('statsAvgWpm').textContent = `${stats.average_wpm.toFixed(1)} WPM`;
      document.getElementById('statsAvgAcc').textContent = `${stats.average_accuracy.toFixed(1)}%`;
      document.getElementById('statsTestsTaken').textContent = stats.total_sessions_completed;
      document.getElementById('statsTimeTyping').textContent = `${(stats.total_time_seconds / 60).toFixed(1)} min`;
      document.getElementById('statsStreak').textContent = `${stats.streak_days} days`;

      statsMgr.renderAchievementsList('achievementsContainer', stats.achievements);
    }
    openModal(statsModal);
  });

  // Results Modal Actions
  function showResultsModal(data) {
    document.getElementById('resultWpm').textContent = Math.round(data.metrics.netWpm);
    document.getElementById('resultRawWpm').textContent = Math.round(data.metrics.grossWpm);
    document.getElementById('resultAcc').textContent = `${Math.round(data.metrics.accuracy)}%`;
    document.getElementById('resultTime').textContent = `${data.metrics.elapsedSec.toFixed(1)}s`;
    document.getElementById('resultConsistency').textContent = `${Math.round(data.metrics.consistency)}%`;
    document.getElementById('resultErrors').textContent = data.metrics.errorCount;

    // Draw Speed Chart on Canvas
    setTimeout(() => {
      statsMgr.drawSpeedChart('speedCanvas', data.wpmGraph);
    }, 100);

    openModal(resultsModal);
  }

  document.getElementById('resultsRepeatBtn').addEventListener('click', () => {
    closeModal(resultsModal);
    engine.reset();
  });

  // Next Lesson button: advances to the next incomplete lesson
  document.getElementById('resultsNextBtn').addEventListener('click', () => {
    closeModal(resultsModal);

    // Auto-advance to the next incomplete lesson
    const nextLesson = lessonMgr.findNextIncompleteLesson();
    if (nextLesson && nextLesson.id !== lessonMgr.activeLesson?.id) {
      // Sync active tab in UI
      difficultyTabs.forEach(t => {
        t.classList.toggle('active', t.dataset.diff === nextLesson.difficulty);
      });
      lessonMgr.selectLesson(nextLesson);
    } else {
      engine.reset();
    }
  });

  // Modal Close buttons
  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-backdrop').forEach(m => closeModal(m));
      hiddenInput.focus();
    });
  });

  function openModal(modal) {
    if (modal) modal.classList.add('active');
  }

  function closeModal(modal) {
    if (modal) modal.classList.remove('active');
    hiddenInput.focus();
  }

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', e => {
    // Tab + Enter or Escape to quick restart
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-backdrop.active');
      if (activeModal) {
        closeModal(activeModal);
      } else {
        engine.reset();
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      engine.reset();
    }
  });

  // =========================================================================
  // INITIALIZATION: Load catalog & resume from persistent uncompleted level
  // =========================================================================

  // 1. Load full curriculum
  await lessonMgr.fetchLessons();

  // 2. Load user stats & progression history from backend
  const initialStats = await statsMgr.fetchStats();
  if (initialStats) {
    lessonMgr.syncProgress(initialStats);
    if (initialStats.key_error_heatmap) {
      keyboard.applyHeatmap(initialStats.key_error_heatmap);
    }
  }

  // 3. Automatically resume at the next incomplete lesson
  const resumeLesson = lessonMgr.determineResumeLesson();
  if (resumeLesson) {
    difficultyTabs.forEach(t => {
      t.classList.toggle('active', t.dataset.diff === resumeLesson.difficulty);
    });
    lessonMgr.selectLesson(resumeLesson);
  } else {
    lessonMgr.setDifficulty('beginner');
  }
});
