/**
 * TypeForge - Master Application Controller
 * Handles 68+ curriculum stages across 5 difficulty tiers,
 * stage progression map, milestone celebration banners, and persistent state.
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
  const stagesMapBtn = document.getElementById('stagesMapBtn');
  const stagesCompletedBadge = document.getElementById('stagesCompletedBadge');

  // Modals
  const resultsModal = document.getElementById('resultsModal');
  const customTextModal = document.getElementById('customTextModal');
  const statsModal = document.getElementById('statsModal');
  const stagesModal = document.getElementById('stagesModal');
  const resultsCelebrationBanner = document.getElementById('resultsCelebrationBanner');

  // Stages Modal Elements
  const totalCurriculumProgress = document.getElementById('totalCurriculumProgress');
  const freePlayCheckbox = document.getElementById('freePlayCheckbox');
  const stagesTierNav = document.getElementById('stagesTierNav');
  const tierProgressTitle = document.getElementById('tierProgressTitle');
  const tierProgressPercent = document.getElementById('tierProgressPercent');
  const tierProgressBar = document.getElementById('tierProgressBar');
  const stagesListContainer = document.getElementById('stagesListContainer');

  let activeModalTier = 'beginner';

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

  // Update curriculum summary badges across header & modal
  function updateCurriculumSummary() {
    const all = lessonMgr.getAllLessonsFlat();
    const completedCount = all.filter(l => lessonMgr.isLessonCompleted(l.id)).length;
    const totalCount = all.length;

    if (stagesCompletedBadge) {
      stagesCompletedBadge.textContent = `${completedCount}/${totalCount}`;
    }
    if (totalCurriculumProgress) {
      totalCurriculumProgress.textContent = `${completedCount} of ${totalCount} Passed`;
    }

    // Update counts for each tier pill in modal
    ['beginner', 'medium', 'advanced', 'expert', 'legend'].forEach(tier => {
      const stats = lessonMgr.getTierStats(tier);
      const el = document.getElementById(`count-${tier}`);
      if (el) el.textContent = `${stats.completed}/${stats.total}`;
    });
  }

  // Populate lesson dropdown with completion status & phase grouping
  function updateLessonDropdown() {
    lessonSelect.innerHTML = '';
    const diff = lessonMgr.currentDifficulty;
    const lessons = lessonMgr.getLessonsForDifficulty(diff);

    // Group by Phase in the dropdown using optgroup
    const groups = lessonMgr.getLessonsGroupedByPhase(diff);

    Object.entries(groups).forEach(([phaseName, phaseLessons]) => {
      const groupEl = document.createElement('optgroup');
      groupEl.label = phaseName;

      phaseLessons.forEach(l => {
        const opt = document.createElement('option');
        opt.value = l.id;
        const isDone = lessonMgr.isLessonCompleted(l.id);
        const isUnlocked = lessonMgr.isLessonUnlocked(l.id);
        const prog = lessonMgr.getLessonProgress(l.id);
        const isCurrent = lessonMgr.activeLesson && lessonMgr.activeLesson.id === l.id;

        let badge = '';
        if (isDone) {
          badge = `[✓ ${prog ? Math.round(prog.best_wpm) + ' WPM' : 'Passed'}] `;
        } else if (!isUnlocked) {
          badge = '[🔒 Locked] ';
        } else if (isCurrent) {
          badge = '[▶ Active] ';
        }

        opt.textContent = `${badge}${l.title} (🎯 ${Math.round(l.min_target_wpm)} WPM)`;
        if (isCurrent) opt.selected = true;
        groupEl.appendChild(opt);
      });

      lessonSelect.appendChild(groupEl);
    });

    updateCurriculumSummary();
  }

  // Handle Lesson Change
  lessonMgr.onLessonChange(lesson => {
    if (!lesson) return;
    const isDone = lessonMgr.isLessonCompleted(lesson.id);
    const prog = lessonMgr.getLessonProgress(lesson.id);
    const statusTag = isDone
      ? ` <span style="color:#10b981; font-size:0.8rem; margin-left:8px;">[Passed: ${prog ? Math.round(prog.best_wpm) + ' WPM' : '✓'}]</span>`
      : ` <span style="color:var(--text-muted); font-size:0.8rem; margin-left:8px;">[Target: ${Math.round(lesson.min_target_wpm)} WPM]</span>`;

    lessonMetaTitle.innerHTML = `<span>${lesson.category}</span> — ${lesson.title}${statusTag}`;
    lessonMetaDesc.textContent = lesson.description;
    updateLessonDropdown();
    engine.loadLesson(lesson);
  });

  // Handle session completion
  engine.onComplete(async data => {
    const lesson = lessonMgr.activeLesson;
    const acc = Math.round(data.metrics.accuracy);
    const wpm = Math.round(data.metrics.netWpm);

    // Check pass criteria (accuracy >= 85%)
    const passed = acc >= 85 && lesson;

    if (passed) {
      lessonMgr.markLessonCompleted(lesson.id, data.metrics);
      updateLessonDropdown();

      // Configure Celebration Banner
      if (resultsCelebrationBanner) {
        resultsCelebrationBanner.style.display = 'flex';
        let celebrationMsg = '';

        if (lesson.id === 'beg-18-beginner-boss-test') {
          celebrationMsg = '🎉 <strong>Beginner Tier Mastered!</strong> You conquered 40 WPM! Intermediate Tier is now fully unlocked!';
        } else if (lesson.id === 'med-18-intermediate-boss-test') {
          celebrationMsg = '🚀 <strong>Intermediate Milestone Passed!</strong> You broke 65 WPM! Advanced Code Tier is now unlocked!';
        } else if (lesson.id === 'adv-14-advanced-boss-test') {
          celebrationMsg = '⚡ <strong>Advanced Velocity Achieved!</strong> You hit 85 WPM! Welcome to Expert Code tier!';
        } else if (lesson.id === 'exp-12-expert-boss-test') {
          celebrationMsg = '👑 <strong>Century Club Champion!</strong> You crushed 100 WPM! Legend Apex Tier is now unlocked!';
        } else if (lesson.id === 'leg-06-grand-master') {
          celebrationMsg = '🏆 <strong>GRAND MASTER 120+ WPM APEX!</strong> You have reached the ultimate pinnacle of typing prowess!';
        } else {
          celebrationMsg = `🌟 <strong>Stage Complete!</strong> Accuracy: <strong>${acc}%</strong> &bull; Net Speed: <strong>${wpm} WPM</strong>. Next stage is ready!`;
        }

        resultsCelebrationBanner.innerHTML = `
          <div class="banner-icon">🎯</div>
          <div class="banner-text">${celebrationMsg}</div>
        `;
      }
    } else {
      if (resultsCelebrationBanner) {
        resultsCelebrationBanner.style.display = 'flex';
        resultsCelebrationBanner.style.background = 'rgba(239, 68, 68, 0.15)';
        resultsCelebrationBanner.style.borderColor = 'rgba(239, 68, 68, 0.4)';
        resultsCelebrationBanner.innerHTML = `
          <div class="banner-icon">💡</div>
          <div class="banner-text">Requires <strong>85%+ accuracy</strong> to unlock the next stage. Take a breath and try again!</div>
        `;
      }
    }

    // Show results modal
    showResultsModal(data);

    // Refresh stats in background
    const updatedStats = await statsMgr.fetchStats();
    if (updatedStats) {
      lessonMgr.syncProgress(updatedStats);
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

  // =========================================================================
  // CURRICULUM MAP & STAGES MODAL RENDERER
  // =========================================================================

  function renderStagesModal(tier) {
    activeModalTier = tier;

    // Update tier buttons active state
    document.querySelectorAll('.stage-tier-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tier === tier);
    });

    // Update Tier Progress Header
    const stats = lessonMgr.getTierStats(tier);
    const tierLabels = {
      beginner: 'Level 1: Beginner Mastery (20–40 WPM Goal)',
      medium: 'Level 2: Intermediate Cadence (45–65 WPM Goal)',
      advanced: 'Level 3: Advanced Web & Syntax (70–85 WPM Goal)',
      expert: 'Level 4: Expert Code & Century Club (90–100 WPM Goal)',
      legend: 'Level 5: Legend Apex Trials (110–120+ WPM Goal)',
    };

    if (tierProgressTitle) tierProgressTitle.textContent = tierLabels[tier] || 'Curriculum Stages';
    if (tierProgressPercent) tierProgressPercent.textContent = `${stats.completed} / ${stats.total} Completed (${stats.percent}%)`;
    if (tierProgressBar) tierProgressBar.style.width = `${stats.percent}%`;

    // Render Stage Cards Grouped by Phase
    stagesListContainer.innerHTML = '';
    const phaseGroups = lessonMgr.getLessonsGroupedByPhase(tier);

    Object.entries(phaseGroups).forEach(([phaseName, phaseLessons]) => {
      const phaseBlock = document.createElement('div');
      phaseBlock.className = 'phase-block';

      const phaseHeader = document.createElement('div');
      phaseHeader.className = 'phase-header';
      phaseHeader.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
        <span>${phaseName}</span>
      `;
      phaseBlock.appendChild(phaseHeader);

      const cardsGrid = document.createElement('div');
      cardsGrid.className = 'phase-cards-grid';

      phaseLessons.forEach(l => {
        const isDone = lessonMgr.isLessonCompleted(l.id);
        const isUnlocked = lessonMgr.isLessonUnlocked(l.id);
        const prog = lessonMgr.getLessonProgress(l.id);
        const isCurrent = lessonMgr.activeLesson && lessonMgr.activeLesson.id === l.id;

        const card = document.createElement('div');
        card.className = `stage-card ${isDone ? 'passed' : ''} ${isCurrent ? 'current' : ''} ${!isUnlocked ? 'locked' : ''}`;

        let statusBadgeHtml = '';
        if (isDone) {
          statusBadgeHtml = `<span class="stage-status-chip passed">✓ Passed: ${Math.round(prog.best_wpm)} WPM</span>`;
        } else if (!isUnlocked) {
          statusBadgeHtml = `<span class="stage-status-chip locked">🔒 Locked</span>`;
        } else {
          statusBadgeHtml = `<span class="stage-status-chip unlocked">Ready</span>`;
        }

        card.innerHTML = `
          <div class="stage-card-top">
            <div class="stage-card-title">${l.title}</div>
            ${statusBadgeHtml}
          </div>
          <div class="stage-card-desc">${l.description}</div>
          <div class="stage-meta-row">
            <span class="target-wpm-chip">Target: <strong>${Math.round(l.min_target_wpm)} WPM</strong></span>
            <span class="target-wpm-chip">Accuracy: <strong>${Math.round(l.min_accuracy)}%</strong></span>
          </div>
          <button class="stage-play-btn" ${!isUnlocked ? 'disabled' : ''}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            <span>${isCurrent ? 'Current Stage' : isDone ? 'Replay Stage' : 'Start Stage'}</span>
          </button>
        `;

        const playBtn = card.querySelector('.stage-play-btn');
        playBtn.addEventListener('click', () => {
          // Switch main tabs
          difficultyTabs.forEach(t => {
            t.classList.toggle('active', t.dataset.diff === tier);
          });
          lessonMgr.selectLesson(l);
          closeModal(stagesModal);
        });

        cardsGrid.appendChild(card);
      });

      phaseBlock.appendChild(cardsGrid);
      stagesListContainer.appendChild(phaseBlock);
    });

    updateCurriculumSummary();
  }

  // Open Stages Modal
  if (stagesMapBtn) {
    stagesMapBtn.addEventListener('click', () => {
      const currentTier = ['beginner', 'medium', 'advanced', 'expert', 'legend'].includes(lessonMgr.currentDifficulty)
        ? lessonMgr.currentDifficulty
        : 'beginner';
      renderStagesModal(currentTier);
      openModal(stagesModal);
    });
  }

  // Tier buttons in Stages Modal
  document.querySelectorAll('.stage-tier-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      renderStagesModal(btn.dataset.tier);
    });
  });

  // Free play checkbox in Stages Modal
  if (freePlayCheckbox) {
    freePlayCheckbox.addEventListener('change', e => {
      lessonMgr.freePlayMode = e.target.checked;
      renderStagesModal(activeModalTier);
      updateLessonDropdown();
    });
  }

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

  // 1. Load full curriculum (68 lessons across 5 tiers)
  await lessonMgr.fetchLessons();

  // 2. Load user stats & progression history from backend
  const initialStats = await statsMgr.fetchStats();
  if (initialStats) {
    lessonMgr.syncProgress(initialStats);
  }

  // 3. Update Curriculum summary badges
  updateCurriculumSummary();

  // 4. Automatically resume at the next incomplete lesson
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
