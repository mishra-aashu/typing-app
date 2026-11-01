/**
 * TypeForge - Master Application Controller
 * Multi-View Touch Typing Tutor Architecture:
 * - View 1: Stage & Curriculum Selection Dashboard (Browse levels, stages, progress, and targets)
 * - View 2: Focused Distraction-Free Typing Arena (Real-time HUD, character stream, mechanical sounds, live visual keyboard)
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Primary View Panels
  const curriculumView = document.getElementById('curriculumView');
  const typingArenaView = document.getElementById('typingArenaView');

  // View 1 (Dashboard) Elements
  const difficultyTabs = document.querySelectorAll('.diff-tab');
  const dashboardTierTitle = document.getElementById('dashboardTierTitle');
  const dashboardTierDesc = document.getElementById('dashboardTierDesc');
  const dashboardTierPercent = document.getElementById('dashboardTierPercent');
  const dashboardTierBar = document.getElementById('dashboardTierBar');
  const dashboardStagesContainer = document.getElementById('dashboardStagesContainer');
  const freePlayCheckbox = document.getElementById('freePlayCheckbox');
  const stagesCompletedBadge = document.getElementById('stagesCompletedBadge');

  // View 2 (Typing Arena) Elements
  const arenaBackBtn = document.getElementById('arenaBackBtn');
  const arenaPhaseTag = document.getElementById('arenaPhaseTag');
  const arenaStageName = document.getElementById('arenaStageName');
  const arenaTargetTag = document.getElementById('arenaTargetTag');
  const arenaPrevBtn = document.getElementById('arenaPrevBtn');
  const arenaCounterBadge = document.getElementById('arenaCounterBadge');
  const arenaNextBtn = document.getElementById('arenaNextBtn');

  // Live Performance HUD Elements
  const liveWpmVal = document.getElementById('liveWpmVal');
  const liveAccVal = document.getElementById('liveAccVal');
  const liveTimeVal = document.getElementById('liveTimeVal');
  const liveErrVal = document.getElementById('liveErrVal');
  const lessonMetaTitle = document.getElementById('lessonMetaTitle');
  const lessonMetaDesc = document.getElementById('lessonMetaDesc');

  // Core Typing Display & Caret
  const typingDisplay = document.getElementById('typingDisplay');
  const caret = document.getElementById('caret');
  const hiddenInput = document.getElementById('hiddenInput');
  const restartBtn = document.getElementById('restartBtn');

  // Header Controls
  const themeSelect = document.getElementById('themeSelect');
  const switchSelect = document.getElementById('switchSelect');
  const toggleKbBtn = document.getElementById('toggleKbBtn');
  const customTextBtn = document.getElementById('customTextBtn');
  const statsModalBtn = document.getElementById('statsModalBtn');

  // Modals
  const resultsModal = document.getElementById('resultsModal');
  const resultsRepeatBtn = document.getElementById('resultsRepeatBtn');
  const resultsNextBtn = document.getElementById('resultsNextBtn');
  const resultsBackToStagesBtn = document.getElementById('resultsBackToStagesBtn');
  const resultsCelebrationBanner = document.getElementById('resultsCelebrationBanner');

  const customTextModal = document.getElementById('customTextModal');
  const statsModal = document.getElementById('statsModal');

  let activeTier = 'beginner';
  let currentActiveLesson = null;

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
    if (liveWpmVal) liveWpmVal.textContent = Math.round(metrics.netWpm);
    if (liveAccVal) liveAccVal.textContent = `${Math.round(metrics.accuracy)}%`;
    if (liveTimeVal) liveTimeVal.textContent = `${metrics.elapsedSec.toFixed(1)}s`;
    if (liveErrVal) liveErrVal.textContent = metrics.errorCount;
  });

  // Tier metadata descriptions
  const tierInfo = {
    beginner: {
      title: 'Level 1: Beginner Mastery',
      desc: 'Master home row index anchor keys, reaches, and baseline speed from 20 to 40 WPM.',
    },
    medium: {
      title: 'Level 2: Intermediate Cadence',
      desc: 'Build speed with capital letters, numbers, punctuation, and common English word flow from 45 to 65 WPM.',
    },
    advanced: {
      title: 'Level 3: Advanced Web & Syntax',
      desc: 'Navigate HTML/CSS tags, CamelCase variables, brackets, and clean syntax from 70 to 85 WPM.',
    },
    expert: {
      title: 'Level 4: Expert Code & Century Club',
      desc: 'High-speed algorithmic patterns, nested logic, and 90 to 100 WPM velocity trials.',
    },
    legend: {
      title: 'Level 5: Legend Apex Trials',
      desc: 'Apex speed sprints, complex symbols, and peak performance from 110 to 120+ WPM.',
    },
    dynamic: {
      title: 'Random 25 Sprint',
      desc: 'Quick 25-word speed drills dynamically generated to sharpen cadence and reflex.',
    },
    weak_keys: {
      title: 'Weak Keys Targeted Drill',
      desc: 'Intelligent repetition focusing on your most frequent keystroke errors.',
    },
  };

  // Update curriculum summary badges across tabs and header
  function updateCurriculumSummary() {
    const all = lessonMgr.getAllLessonsFlat();
    const completedCount = all.filter(l => lessonMgr.isLessonCompleted(l.id)).length;
    const totalCount = all.length;

    if (stagesCompletedBadge) {
      stagesCompletedBadge.textContent = `${completedCount}/${totalCount} Passed`;
    }

    ['beginner', 'medium', 'advanced', 'expert', 'legend'].forEach(t => {
      const stats = lessonMgr.getTierStats(t);
      const el = document.getElementById(`badge-${t}`);
      if (el) el.textContent = `${stats.completed}/${stats.total}`;
    });
  }

  // =========================================================================
  // VIEW SWITCHING CONTROLLER
  // =========================================================================

  /**
   * Switch to View 1: Stage Selection Dashboard
   */
  function showCurriculumView(tier) {
    if (tier && tierInfo[tier]) {
      activeTier = tier;
    }

    // Toggle View Panels
    if (curriculumView) {
      curriculumView.style.display = 'flex';
      curriculumView.classList.add('active');
    }
    if (typingArenaView) {
      typingArenaView.style.display = 'none';
      typingArenaView.classList.remove('active');
    }

    // Update Difficulty Tabs
    difficultyTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.diff === activeTier);
    });

    renderDashboardStages(activeTier);
    updateCurriculumSummary();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Switch to View 2: Focused Typing Arena
   */
  function showTypingArena(lesson) {
    if (!lesson) return;
    currentActiveLesson = lesson;
    lessonMgr.selectLesson(lesson);

    // Toggle View Panels
    if (curriculumView) {
      curriculumView.style.display = 'none';
      curriculumView.classList.remove('active');
    }
    if (typingArenaView) {
      typingArenaView.style.display = 'flex';
      typingArenaView.classList.add('active');
    }

    // Update Arena Navigation Header
    const isDone = lessonMgr.isLessonCompleted(lesson.id);
    const prog = lessonMgr.getLessonProgress(lesson.id);

    if (arenaPhaseTag) {
      arenaPhaseTag.textContent = lesson.category || 'Stage';
    }
    if (arenaStageName) {
      arenaStageName.textContent = lesson.title;
    }
    if (arenaTargetTag) {
      if (isDone && prog?.best_wpm) {
        arenaTargetTag.innerHTML = `Best: <strong>${Math.round(prog.best_wpm)} WPM</strong>`;
        arenaTargetTag.style.color = '#34d399';
        arenaTargetTag.style.background = 'rgba(16, 185, 129, 0.15)';
      } else {
        arenaTargetTag.innerHTML = `Target: <strong>${Math.round(lesson.min_target_wpm)} WPM</strong>`;
        arenaTargetTag.style.color = '#38bdf8';
        arenaTargetTag.style.background = 'rgba(56, 189, 248, 0.12)';
      }
    }

    // Update Counter Badge (Stage X / Y)
    const tierList = lessonMgr.getLessonsForDifficulty(lesson.difficulty);
    const currentIdx = tierList.findIndex(l => l.id === lesson.id);
    if (arenaCounterBadge) {
      if (currentIdx !== -1) {
        arenaCounterBadge.textContent = `${currentIdx + 1} / ${tierList.length}`;
      } else {
        arenaCounterBadge.textContent = `Practice Drill`;
      }
    }

    // Update Stage Metadata
    if (lessonMetaTitle) {
      const statusPill = isDone
        ? ` <span style="color:#10b981; font-size:0.8rem; margin-left:8px;">[Passed: ${prog ? Math.round(prog.best_wpm) + ' WPM' : 'Complete'}]</span>`
        : ` <span style="color:var(--text-muted); font-size:0.8rem; margin-left:8px;">[Target: ${Math.round(lesson.min_target_wpm)} WPM]</span>`;
      lessonMetaTitle.innerHTML = `<span>${lesson.category || 'Curriculum'}</span> — ${lesson.title}${statusPill}`;
    }
    if (lessonMetaDesc) {
      lessonMetaDesc.textContent = lesson.description || '';
    }

    // Load into engine & focus
    engine.loadLesson(lesson);
    setTimeout(() => {
      if (hiddenInput) hiddenInput.focus();
    }, 50);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // =========================================================================
  // DASHBOARD STAGES RENDERER (VIEW 1)
  // =========================================================================

  function renderDashboardStages(tier) {
    if (!dashboardStagesContainer) return;

    const info = tierInfo[tier] || tierInfo.beginner;
    if (dashboardTierTitle) dashboardTierTitle.textContent = info.title;
    if (dashboardTierDesc) dashboardTierDesc.textContent = info.desc;

    dashboardStagesContainer.innerHTML = '';

    // Handle Quick Practice Modes (Random 25 / Weak Keys)
    if (tier === 'dynamic' || tier === 'weak_keys') {
      if (dashboardTierPercent) dashboardTierPercent.textContent = 'Infinite Practice';
      if (dashboardTierBar) dashboardTierBar.style.width = '100%';

      const drillCard = document.createElement('div');
      drillCard.className = 'stage-card';
      drillCard.style.maxWidth = '600px';
      drillCard.style.margin = '1rem auto';
      drillCard.style.padding = '2rem';
      drillCard.style.textAlign = 'center';

      const drillTitle = tier === 'dynamic' ? 'Random 25 Words Sprint' : 'Targeted Weak Keys Workout';
      const drillDesc = tier === 'dynamic'
        ? 'Generates fresh sets of high-frequency English vocabulary to boost rhythm and muscle memory.'
        : 'Analyzes your past mistyped characters and produces a tailored sequence to eliminate error habits.';

      drillCard.innerHTML = `
        <div style="font-size:1.4rem; font-weight:800; color:#fff; margin-bottom:0.5rem;">${drillTitle}</div>
        <div style="font-size:0.95rem; color:var(--text-dim); margin-bottom:1.5rem; line-height:1.5;">${drillDesc}</div>
        <button id="startQuickDrillBtn" class="stage-play-btn" style="background:var(--accent-primary); padding:0.85rem 1.75rem; font-size:1rem; width:auto; margin:0 auto;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          <span>Launch ${drillTitle} &rarr;</span>
        </button>
      `;

      drillCard.querySelector('#startQuickDrillBtn').addEventListener('click', async () => {
        if (tier === 'dynamic') {
          const l = await lessonMgr.loadDynamicLesson('words', 25);
          if (l) showTypingArena(l);
        } else {
          const l = await lessonMgr.loadDynamicLesson('weak_keys', 25);
          if (l) showTypingArena(l);
        }
      });

      dashboardStagesContainer.appendChild(drillCard);
      return;
    }

    // Standard Structured Tier (Beginner, Intermediate, Advanced, Expert, Legend)
    const stats = lessonMgr.getTierStats(tier);
    if (dashboardTierPercent) {
      dashboardTierPercent.textContent = `${stats.completed} / ${stats.total} Completed (${stats.percent}%)`;
    }
    if (dashboardTierBar) {
      dashboardTierBar.style.width = `${stats.percent}%`;
    }

    const phaseGroups = lessonMgr.getLessonsGroupedByPhase(tier);

    Object.entries(phaseGroups).forEach(([phaseName, phaseLessons]) => {
      const phaseBlock = document.createElement('div');
      phaseBlock.className = 'phase-block';

      const phaseHeader = document.createElement('div');
      phaseHeader.className = 'phase-header';
      phaseHeader.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
        <span>${phaseName}</span>
      `;
      phaseBlock.appendChild(phaseHeader);

      const cardsGrid = document.createElement('div');
      cardsGrid.className = 'phase-cards-grid';

      phaseLessons.forEach((l, index) => {
        const isDone = lessonMgr.isLessonCompleted(l.id);
        const isUnlocked = lessonMgr.isLessonUnlocked(l.id);
        const prog = lessonMgr.getLessonProgress(l.id);
        const isCurrent = currentActiveLesson && currentActiveLesson.id === l.id;

        const card = document.createElement('div');
        card.className = `stage-card ${isDone ? 'passed' : ''} ${isCurrent ? 'current' : ''} ${!isUnlocked ? 'locked' : ''}`;

        // Status badge
        let statusBadgeHtml = '';
        if (isDone) {
          statusBadgeHtml = `
            <span class="stage-status-chip passed">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Passed: ${Math.round(prog.best_wpm)} WPM
            </span>`;
        } else if (!isUnlocked) {
          statusBadgeHtml = `
            <span class="stage-status-chip locked">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Locked
            </span>`;
        } else {
          statusBadgeHtml = `<span class="stage-status-chip unlocked">Ready</span>`;
        }

        // Action CTA button
        let buttonHtml = '';
        let buttonClass = 'stage-play-btn';
        if (isDone) {
          buttonClass += ' btn-repeat';
          buttonHtml = `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Practice Again</span>
          `;
        } else if (isUnlocked || lessonMgr.freePlayMode) {
          buttonClass += ' btn-start';
          buttonHtml = `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            <span>Start Stage &rarr;</span>
          `;
        } else {
          buttonClass += ' btn-locked';
          buttonHtml = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span>Locked &bull; Complete Previous</span>
          `;
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
          <button class="${buttonClass}" type="button">
            ${buttonHtml}
          </button>
        `;

        // Handle Card / CTA button click
        const clickHandler = () => {
          if (isUnlocked || isDone || lessonMgr.freePlayMode) {
            showTypingArena(l);
          } else {
            showToast(`Pass the previous stage with 85%+ accuracy to unlock "${l.title}"!`);
          }
        };

        const playBtn = card.querySelector('.stage-play-btn');
        playBtn.addEventListener('click', e => {
          e.stopPropagation();
          clickHandler();
        });

        card.addEventListener('click', () => {
          clickHandler();
        });

        cardsGrid.appendChild(card);
      });

      phaseBlock.appendChild(cardsGrid);
      dashboardStagesContainer.appendChild(phaseBlock);
    });
  }

  // Difficulty Tabs Click Handler
  difficultyTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const mode = tab.dataset.diff;
      activeTier = mode;
      difficultyTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderDashboardStages(mode);
    });
  });

  // Free play mode checkbox
  if (freePlayCheckbox) {
    freePlayCheckbox.addEventListener('change', e => {
      lessonMgr.freePlayMode = e.target.checked;
      renderDashboardStages(activeTier);
      showToast(e.target.checked ? 'Free Practice Mode: All stages unlocked!' : 'Sequential Progression Mode enabled.');
    });
  }

  // =========================================================================
  // ARENA TOP BAR CONTROLS (VIEW 2)
  // =========================================================================

  // Return to Stage Selection Dashboard
  if (arenaBackBtn) {
    arenaBackBtn.addEventListener('click', () => {
      showCurriculumView(currentActiveLesson ? currentActiveLesson.difficulty : activeTier);
    });
  }

  // Previous Stage Stepper
  if (arenaPrevBtn) {
    arenaPrevBtn.addEventListener('click', () => {
      if (!currentActiveLesson) return;
      const list = lessonMgr.getLessonsForDifficulty(currentActiveLesson.difficulty);
      const idx = list.findIndex(l => l.id === currentActiveLesson.id);
      if (idx > 0) {
        showTypingArena(list[idx - 1]);
      } else {
        showToast('This is the first stage in this level.');
      }
    });
  }

  // Next Stage Stepper
  if (arenaNextBtn) {
    arenaNextBtn.addEventListener('click', () => {
      if (!currentActiveLesson) return;
      const list = lessonMgr.getLessonsForDifficulty(currentActiveLesson.difficulty);
      const idx = list.findIndex(l => l.id === currentActiveLesson.id);
      if (idx !== -1 && idx < list.length - 1) {
        const nextL = list[idx + 1];
        if (lessonMgr.isLessonUnlocked(nextL.id)) {
          showTypingArena(nextL);
        } else {
          showToast('Pass current stage with 85%+ accuracy to unlock next stage.');
        }
      } else {
        showToast('You have reached the final stage of this tier!');
      }
    });
  }

  // Restart Button in Arena
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      engine.reset();
      if (hiddenInput) hiddenInput.focus();
    });
  }

  // =========================================================================
  // SESSION COMPLETION & RESULTS MODAL
  // =========================================================================

  engine.onComplete(async data => {
    const lesson = currentActiveLesson || lessonMgr.activeLesson;
    const acc = Math.round(data.metrics.accuracy);
    const wpm = Math.round(data.metrics.netWpm);

    // Pass criteria: accuracy >= 85%
    const passed = acc >= 85 && lesson;

    if (passed) {
      lessonMgr.markLessonCompleted(lesson.id, data.metrics);
      updateCurriculumSummary();

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

    // Show Results Modal
    showResultsModal(data);

    // Refresh stats in background
    const updatedStats = await statsMgr.fetchStats();
    if (updatedStats) {
      lessonMgr.syncProgress(updatedStats);
    }
  });

  function showResultsModal(data) {
    document.getElementById('resultWpm').textContent = Math.round(data.metrics.netWpm);
    document.getElementById('resultRawWpm').textContent = Math.round(data.metrics.grossWpm);
    document.getElementById('resultAcc').textContent = `${Math.round(data.metrics.accuracy)}%`;
    document.getElementById('resultTime').textContent = `${data.metrics.elapsedSec.toFixed(1)}s`;
    document.getElementById('resultConsistency').textContent = `${Math.round(data.metrics.consistency)}%`;
    document.getElementById('resultErrors').textContent = data.metrics.errorCount;

    setTimeout(() => {
      statsMgr.drawSpeedChart('speedCanvas', data.wpmGraph);
    }, 100);

    openModal(resultsModal);
  }

  // Results Modal Button Actions
  if (resultsRepeatBtn) {
    resultsRepeatBtn.addEventListener('click', () => {
      closeModal(resultsModal);
      engine.reset();
      if (hiddenInput) hiddenInput.focus();
    });
  }

  if (resultsBackToStagesBtn) {
    resultsBackToStagesBtn.addEventListener('click', () => {
      closeModal(resultsModal);
      showCurriculumView(currentActiveLesson ? currentActiveLesson.difficulty : activeTier);
    });
  }

  if (resultsNextBtn) {
    resultsNextBtn.addEventListener('click', () => {
      closeModal(resultsModal);

      // Advance to next incomplete lesson
      const nextLesson = lessonMgr.findNextIncompleteLesson();
      if (nextLesson) {
        showTypingArena(nextLesson);
      } else {
        engine.reset();
        if (hiddenInput) hiddenInput.focus();
      }
    });
  }

  // =========================================================================
  // HEADER CONTROLS (THEME, SWITCHES, KEYBOARD, STATS, CUSTOM)
  // =========================================================================

  // Theme selector
  const savedTheme = localStorage.getItem('typeforge_theme') || 'default';
  if (savedTheme !== 'default') {
    document.documentElement.dataset.theme = savedTheme;
    if (themeSelect) themeSelect.value = savedTheme;
  }
  if (themeSelect) {
    themeSelect.addEventListener('change', e => {
      const th = e.target.value;
      if (th === 'default') {
        delete document.documentElement.dataset.theme;
      } else {
        document.documentElement.dataset.theme = th;
      }
      localStorage.setItem('typeforge_theme', th);
    });
  }

  // Switch sound selector
  if (switchSelect) {
    switchSelect.value = window.soundEngine.switchType;
    switchSelect.addEventListener('change', e => {
      window.soundEngine.setSwitchType(e.target.value);
      window.soundEngine.playKeypress(false);
    });
  }

  // Toggle visual keyboard
  if (toggleKbBtn) {
    toggleKbBtn.addEventListener('click', () => {
      const kbSection = document.getElementById('keyboardSection');
      if (kbSection) {
        const isHidden = kbSection.style.display === 'none';
        kbSection.style.display = isHidden ? 'block' : 'none';
        toggleKbBtn.classList.toggle('active', isHidden);
      }
    });
  }

  // Custom text modal
  if (customTextBtn) {
    customTextBtn.addEventListener('click', () => {
      openModal(customTextModal);
      document.getElementById('customTextInput').focus();
    });
  }

  const saveCustomBtn = document.getElementById('saveCustomTextBtn');
  if (saveCustomBtn) {
    saveCustomBtn.addEventListener('click', () => {
      const title = document.getElementById('customTitleInput').value.trim() || 'Custom Drill';
      const text = document.getElementById('customTextInput').value.trim();
      if (text.length > 5) {
        lessonMgr.setCustomText(title, text);
        closeModal(customTextModal);
        showTypingArena(lessonMgr.activeLesson);
      }
    });
  }

  // Stats / Achievements Modal
  if (statsModalBtn) {
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
  }

  // Modal helpers
  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-backdrop').forEach(m => closeModal(m));
      if (typingArenaView.classList.contains('active') && hiddenInput) {
        hiddenInput.focus();
      }
    });
  });

  function openModal(modal) {
    if (modal) modal.classList.add('active');
  }

  function closeModal(modal) {
    if (modal) modal.classList.remove('active');
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
    const activeModal = document.querySelector('.modal-backdrop.active');
    if (e.key === 'Escape') {
      if (activeModal) {
        closeModal(activeModal);
        if (typingArenaView.classList.contains('active') && hiddenInput) {
          hiddenInput.focus();
        }
      } else if (typingArenaView.classList.contains('active')) {
        // Return to Stage Selection Dashboard on Escape
        showCurriculumView(currentActiveLesson ? currentActiveLesson.difficulty : activeTier);
      }
    } else if (e.key === 'Tab') {
      if (!activeModal && typingArenaView.classList.contains('active')) {
        e.preventDefault();
        engine.reset();
        if (hiddenInput) hiddenInput.focus();
      }
    }
  });

  // =========================================================================
  // APP INITIALIZATION
  // =========================================================================

  // 1. Fetch full 68-stage curriculum from backend (or fallback catalog)
  await lessonMgr.fetchLessons();

  // 2. Fetch user lifetime stats and progression history
  const initialStats = await statsMgr.fetchStats();
  if (initialStats) {
    lessonMgr.syncProgress(initialStats);
  }

  // 3. Update Curriculum summary badges
  updateCurriculumSummary();

  // 4. Determine user's current resume lesson
  const resumeLesson = lessonMgr.determineResumeLesson();
  if (resumeLesson) {
    currentActiveLesson = resumeLesson;
    activeTier = resumeLesson.difficulty;
  }

  // 5. Land the user on View 1 (Stage Selection Dashboard)
  // "pehle stage chune user then new page pr typing"
  showCurriculumView(activeTier);
});
