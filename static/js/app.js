/**
 * TypeForge - Master Application Controller
 * High-velocity touch typing tutor with 68 structured stages across 5 difficulty tiers.
 * Features custom glass stage stepper, stage map drawer, milestone celebrations, and persistence.
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

  // Controls & Navigation
  const difficultyTabs = document.querySelectorAll('.diff-tab');
  const restartBtn = document.getElementById('restartBtn');
  const themeSelect = document.getElementById('themeSelect');
  const switchSelect = document.getElementById('switchSelect');
  const toggleKbBtn = document.getElementById('toggleKbBtn');
  const customTextBtn = document.getElementById('customTextBtn');
  const statsModalBtn = document.getElementById('statsModalBtn');
  const stagesMapBtn = document.getElementById('stagesMapBtn');
  const stagesCompletedBadge = document.getElementById('stagesCompletedBadge');

  // Custom Lesson Stepper & Picker Elements
  const prevLessonBtn = document.getElementById('prevLessonBtn');
  const nextLessonBtn = document.getElementById('nextLessonBtn');
  const customLessonPicker = document.getElementById('customLessonPicker');
  const lessonPickerTrigger = document.getElementById('lessonPickerTrigger');
  const lessonPickerMenu = document.getElementById('lessonPickerMenu');
  const pickerPhaseLabel = document.getElementById('pickerPhaseLabel');
  const pickerTitleLabel = document.getElementById('pickerTitleLabel');
  const pickerTargetLabel = document.getElementById('pickerTargetLabel');

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

  // Populate Custom Lesson Picker Trigger & Floating Menu
  function updateLessonPickerUI() {
    const active = lessonMgr.activeLesson;
    if (!active) return;

    // Update trigger labels
    if (pickerPhaseLabel) pickerPhaseLabel.textContent = active.category || 'Curriculum';
    if (pickerTitleLabel) pickerTitleLabel.textContent = active.title;
    if (pickerTargetLabel) pickerTargetLabel.textContent = `${Math.round(active.min_target_wpm)} WPM`;

    // Populate custom floating menu
    if (lessonPickerMenu) {
      lessonPickerMenu.innerHTML = '';
      const diff = lessonMgr.currentDifficulty;
      const groups = lessonMgr.getLessonsGroupedByPhase(diff);

      Object.entries(groups).forEach(([phaseName, phaseLessons]) => {
        const headerEl = document.createElement('div');
        headerEl.className = 'picker-menu-phase-header';
        headerEl.textContent = phaseName;
        lessonPickerMenu.appendChild(headerEl);

        phaseLessons.forEach(l => {
          const isDone = lessonMgr.isLessonCompleted(l.id);
          const isUnlocked = lessonMgr.isLessonUnlocked(l.id);
          const prog = lessonMgr.getLessonProgress(l.id);
          const isCurrent = active && active.id === l.id;

          const itemEl = document.createElement('div');
          itemEl.className = `picker-menu-item ${isCurrent ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}`;

          let statusIconHtml = '';
          if (isDone) {
            statusIconHtml = `
              <span class="picker-item-status-icon passed">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>`;
          } else if (!isUnlocked) {
            statusIconHtml = `
              <span class="picker-item-status-icon locked" style="color:var(--text-muted);">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>`;
          } else {
            statusIconHtml = `<span class="picker-item-status-icon dot"></span>`;
          }

          let rightBadgeHtml = '';
          if (isDone && prog?.best_wpm) {
            rightBadgeHtml = `<span class="picker-item-best">${Math.round(prog.best_wpm)} WPM</span>`;
          } else {
            rightBadgeHtml = `<span class="picker-item-target">${Math.round(l.min_target_wpm)} WPM</span>`;
          }

          itemEl.innerHTML = `
            <div class="picker-item-left">
              ${statusIconHtml}
              <span class="picker-item-name">${l.title}</span>
            </div>
            <div class="picker-item-right">
              ${rightBadgeHtml}
            </div>
          `;

          itemEl.addEventListener('click', e => {
            e.stopPropagation();
            if (isUnlocked || isDone || lessonMgr.freePlayMode) {
              lessonMgr.selectLesson(l);
              closePickerMenu();
            } else {
              // Notify user cleanly without raw emojis
              showToast('Pass previous stage to unlock this lesson.');
            }
          });

          lessonPickerMenu.appendChild(itemEl);
        });
      });
    }

    updateCurriculumSummary();
  }

  // Toggle Custom Lesson Picker Dropdown
  function togglePickerMenu() {
    const isShowing = lessonPickerMenu.classList.contains('show');
    if (isShowing) {
      closePickerMenu();
    } else {
      openPickerMenu();
    }
  }

  function openPickerMenu() {
    lessonPickerMenu.classList.add('show');
    lessonPickerTrigger.classList.add('active');
  }

  function closePickerMenu() {
    lessonPickerMenu.classList.remove('show');
    lessonPickerTrigger.classList.remove('active');
  }

  if (lessonPickerTrigger) {
    lessonPickerTrigger.addEventListener('click', e => {
      e.stopPropagation();
      togglePickerMenu();
    });
  }

  // Close floating picker menu when clicking outside
  document.addEventListener('click', e => {
    if (customLessonPicker && !customLessonPicker.contains(e.target)) {
      closePickerMenu();
    }
  });

  // Stepper Arrow Buttons (Prev / Next)
  if (prevLessonBtn) {
    prevLessonBtn.addEventListener('click', () => {
      const diff = lessonMgr.currentDifficulty;
      const list = lessonMgr.getLessonsForDifficulty(diff);
      const active = lessonMgr.activeLesson;
      if (!active || list.length === 0) return;

      const idx = list.findIndex(l => l.id === active.id);
      if (idx > 0) {
        lessonMgr.selectLesson(list[idx - 1]);
      }
    });
  }

  if (nextLessonBtn) {
    nextLessonBtn.addEventListener('click', () => {
      const diff = lessonMgr.currentDifficulty;
      const list = lessonMgr.getLessonsForDifficulty(diff);
      const active = lessonMgr.activeLesson;
      if (!active || list.length === 0) return;

      const idx = list.findIndex(l => l.id === active.id);
      if (idx < list.length - 1) {
        const nextL = list[idx + 1];
        if (lessonMgr.isLessonUnlocked(nextL.id)) {
          lessonMgr.selectLesson(nextL);
        } else {
          showToast('Pass current stage with 85%+ accuracy to unlock next stage.');
        }
      }
    });
  }

  // Handle Lesson Change
  lessonMgr.onLessonChange(lesson => {
    if (!lesson) return;
    const isDone = lessonMgr.isLessonCompleted(lesson.id);
    const prog = lessonMgr.getLessonProgress(lesson.id);
    const statusTag = isDone
      ? ` <span style="color:#10b981; font-size:0.8rem; margin-left:8px;">[Passed: ${prog ? Math.round(prog.best_wpm) + ' WPM' : 'Complete'}]</span>`
      : ` <span style="color:var(--text-muted); font-size:0.8rem; margin-left:8px;">[Target: ${Math.round(lesson.min_target_wpm)} WPM]</span>`;

    lessonMetaTitle.innerHTML = `<span>${lesson.category}</span> — ${lesson.title}${statusTag}`;
    lessonMetaDesc.textContent = lesson.description;
    updateLessonPickerUI();
    engine.loadLesson(lesson);
  });

  // Handle session completion
  engine.onComplete(async data => {
    const lesson = lessonMgr.activeLesson;
    const acc = Math.round(data.metrics.accuracy);
    const wpm = Math.round(data.metrics.netWpm);

    // Pass criteria: accuracy >= 85%
    const passed = acc >= 85 && lesson;

    if (passed) {
      lessonMgr.markLessonCompleted(lesson.id, data.metrics);
      updateLessonPickerUI();

      // Configure Celebration Banner with clean SVG icons (NO EMOJIS)
      if (resultsCelebrationBanner) {
        resultsCelebrationBanner.style.display = 'flex';
        resultsCelebrationBanner.style.background = 'linear-gradient(135deg, rgba(121, 82, 255, 0.25) 0%, rgba(0, 240, 255, 0.25) 100%)';
        resultsCelebrationBanner.style.borderColor = 'var(--accent-primary)';

        let celebrationMsg = '';
        if (lesson.id === 'beg-18-beginner-boss-test') {
          celebrationMsg = '<strong>Beginner Tier Mastered!</strong> You conquered 40 WPM. Intermediate Tier is now unlocked!';
        } else if (lesson.id === 'med-18-intermediate-boss-test') {
          celebrationMsg = '<strong>Intermediate Milestone Passed!</strong> You broke 65 WPM. Advanced Tier is now unlocked!';
        } else if (lesson.id === 'adv-14-advanced-boss-test') {
          celebrationMsg = '<strong>Advanced Velocity Achieved!</strong> You hit 85 WPM. Welcome to Expert Code tier!';
        } else if (lesson.id === 'exp-12-expert-boss-test') {
          celebrationMsg = '<strong>Century Club Champion!</strong> You crushed 100 WPM. Legend Apex Tier is now unlocked!';
        } else if (lesson.id === 'leg-06-grand-master') {
          celebrationMsg = '<strong>GRAND MASTER APEX ACHIEVED!</strong> You have reached the pinnacle of typing speed!';
        } else {
          celebrationMsg = `<strong>Stage Complete!</strong> Accuracy: <strong>${acc}%</strong> &bull; Net Speed: <strong>${wpm} WPM</strong>. Next stage unlocked!`;
        }

        resultsCelebrationBanner.innerHTML = `
          <div class="banner-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00f0ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <div class="banner-text">${celebrationMsg}</div>
        `;
      }
    } else {
      if (resultsCelebrationBanner) {
        resultsCelebrationBanner.style.display = 'flex';
        resultsCelebrationBanner.style.background = 'rgba(239, 68, 68, 0.15)';
        resultsCelebrationBanner.style.borderColor = 'rgba(239, 68, 68, 0.4)';
        resultsCelebrationBanner.innerHTML = `
          <div class="banner-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div class="banner-text">Requires <strong>85%+ accuracy</strong> to unlock the next stage. Maintain relaxed rhythm and try again!</div>
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
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
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
          statusBadgeHtml = `
            <span class="stage-status-chip passed">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="display:inline-block; vertical-align:middle; margin-right:3px;"><polyline points="20 6 9 17 4 12"/></svg>
              Passed: ${Math.round(prog.best_wpm)} WPM
            </span>`;
        } else if (!isUnlocked) {
          statusBadgeHtml = `
            <span class="stage-status-chip locked">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block; vertical-align:middle; margin-right:3px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Locked
            </span>`;
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
      updateLessonPickerUI();
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

  function showToast(msg) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span>${msg}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', e => {
    // Tab + Enter or Escape to quick restart
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-backdrop.active');
      if (activeModal) {
        closeModal(activeModal);
      } else {
        closePickerMenu();
        engine.reset();
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      closePickerMenu();
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
