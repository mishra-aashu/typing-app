/**
 * TypeForge - Real-Time Typing Engine
 * Sub-millisecond keystroke capture, client-side optimistic UI, Rust sync.
 */

class TypingEngine {
  constructor(options = {}) {
    this.textContainer = options.textContainer;
    this.caret = options.caret;
    this.hiddenInput = options.hiddenInput;
    this.keyboard = options.keyboard;
    this.sound = options.sound || window.soundEngine;

    // Session State
    this.sessionId = null;
    this.targetText = '';
    this.targetChars = [];
    this.charElements = [];
    this.cursorIndex = 0;
    this.startTime = null;
    this.endTime = null;
    this.timerInterval = null;
    this.isActive = false;
    this.isCompleted = false;

    // Local Counters
    this.correctCount = 0;
    this.totalKeystrokes = 0;
    this.errorCount = 0;
    this.backspacesCount = 0;
    this.keystrokeIntervals = [];
    this.lastKeystrokeTime = null;
    this.wpmGraphData = [];
    this.weakKeys = {};

    this.onMetricsUpdateCallbacks = [];
    this.onCompleteCallbacks = [];

    this.setupListeners();
  }

  setupListeners() {
    if (!this.hiddenInput) return;

    // Keep hidden input focused when typing stage is clicked
    if (this.textContainer) {
      this.textContainer.parentElement.addEventListener('click', () => {
        this.hiddenInput.focus();
        this.textContainer.parentElement.classList.add('focused');
      });
    }

    this.hiddenInput.addEventListener('focus', () => {
      if (this.textContainer) this.textContainer.parentElement.classList.add('focused');
    });

    this.hiddenInput.addEventListener('blur', () => {
      if (this.textContainer) this.textContainer.parentElement.classList.remove('focused');
    });

    // Capture every keydown event
    this.hiddenInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
  }

  async loadLesson(lesson) {
    if (!lesson || !lesson.target_text) return;

    this.reset();
    this.targetText = lesson.target_text;
    this.targetChars = Array.from(this.targetText);

    this.renderText();

    // Start a session on Rust backend
    try {
      const res = await fetch('/api/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lesson_id: lesson.id,
          custom_text: lesson.difficulty === 'custom' ? lesson.target_text : null,
        }),
      });
      if (res.ok) {
        const snapshot = await res.json();
        this.sessionId = snapshot.id;
      }
    } catch (err) {
      console.warn('Backend not available for session init, running in autonomous mode.');
      this.sessionId = 'local-' + Date.now();
    }

    this.updateCaretPosition();
    this.updateTargetKey();
    this.hiddenInput.focus();
  }

  renderText() {
    if (!this.textContainer) return;
    this.textContainer.innerHTML = '';
    this.charElements = [];

    this.targetChars.forEach((ch, idx) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = ch;
      span.dataset.idx = idx;
      this.textContainer.appendChild(span);
      this.charElements.push(span);
    });
  }

  handleKeyDown(e) {
    // Shortcuts (Ctrl, Alt, Meta, F-keys, Tab)
    if (e.key === 'Tab' || e.key === 'Escape') {
      return; // Handled by App shortcuts
    }
    if (e.ctrlKey || e.altKey || e.metaKey) {
      return;
    }

    if (this.isCompleted) {
      return;
    }

    const key = e.key;

    // Visual mechanical keyboard feedback
    if (this.keyboard) {
      this.keyboard.pressKey(e.code, key);
    }

    // Process Backspace
    if (key === 'Backspace') {
      e.preventDefault();
      this.handleBackspace();
      return;
    }

    // Single character input
    if (key.length === 1) {
      e.preventDefault();
      this.handleCharacterInput(key);
    }
  }

  handleCharacterInput(typedChar) {
    const now = performance.now();

    // Start session on first keypress
    if (!this.isActive) {
      this.startTime = now;
      this.isActive = true;
      this.startTimer();
    }

    // Keystroke timing interval
    if (this.lastKeystrokeTime) {
      this.keystrokeIntervals.push(now - this.lastKeystrokeTime);
    }
    this.lastKeystrokeTime = now;
    this.totalKeystrokes++;

    if (this.cursorIndex >= this.targetChars.length) {
      return;
    }

    const expectedChar = this.targetChars[this.cursorIndex];
    const isCorrect = typedChar === expectedChar;
    const currentSpan = this.charElements[this.cursorIndex];

    if (isCorrect) {
      this.correctCount++;
      currentSpan.className = 'char correct';
      if (this.sound) this.sound.playKeypress(typedChar === ' ');
    } else {
      this.errorCount++;
      currentSpan.className = 'char incorrect';
      this.weakKeys[expectedChar] = (this.weakKeys[expectedChar] || 0) + 1;
      if (this.sound) {
        this.sound.playKeypress(typedChar === ' ');
        this.sound.playErrorSound();
      }
    }

    this.cursorIndex++;
    this.updateCaretPosition();
    this.updateTargetKey();

    // Async sync with Rust backend
    this.syncKeystrokeWithBackend(typedChar, false);

    // Check completion
    if (this.cursorIndex >= this.targetChars.length) {
      this.finishSession();
    }
  }

  handleBackspace() {
    if (this.cursorIndex <= 0) return;

    this.cursorIndex--;
    this.backspacesCount++;
    this.totalKeystrokes++;

    const currentSpan = this.charElements[this.cursorIndex];
    if (currentSpan.classList.contains('correct')) {
      this.correctCount = Math.max(0, this.correctCount - 1);
    }
    currentSpan.className = 'char'; // Reset to pending

    if (this.sound) this.sound.playKeypress(false);

    this.updateCaretPosition();
    this.updateTargetKey();

    this.syncKeystrokeWithBackend('Backspace', true);
  }

  async syncKeystrokeWithBackend(key, isBackspace) {
    if (!this.sessionId) return;
    try {
      fetch('/api/session/keystroke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: this.sessionId,
          key,
          is_backspace: isBackspace,
        }),
      });
    } catch (err) {
      // Non-blocking background sync
    }
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      this.emitMetrics();

      // Collect data point for speed graph
      const elapsedSec = (performance.now() - this.startTime) / 1000;
      const metrics = this.computeMetrics();
      if (this.wpmGraphData.length === 0 || elapsedSec - this.wpmGraphData[this.wpmGraphData.length - 1].seconds >= 1.0) {
        this.wpmGraphData.push({
          seconds: Math.round(elapsedSec * 10) / 10,
          wpm: metrics.netWpm,
          raw_wpm: metrics.grossWpm,
          errors: this.errorCount,
        });
      }
    }, 100);
  }

  computeMetrics() {
    const elapsedSec = this.startTime ? (performance.now() - this.startTime) / 1000 : 0;
    const safeSec = Math.max(elapsedSec, 0.1);
    const minutes = safeSec / 60;

    const grossWpm = ((this.totalKeystrokes / 5) / minutes) || 0;
    const netWpm = Math.max(0, ((this.correctCount / 5) / minutes) || 0);

    const accuracy = this.totalKeystrokes === 0
      ? 100
      : Math.min(100, Math.max(0, (this.correctCount / this.totalKeystrokes) * 100));

    // Consistency calculation
    const consistency = this.computeConsistency();

    return {
      netWpm: Math.round(netWpm * 10) / 10,
      grossWpm: Math.round(grossWpm * 10) / 10,
      accuracy: Math.round(accuracy * 10) / 10,
      consistency: Math.round(consistency * 10) / 10,
      elapsedSec: Math.round(elapsedSec * 10) / 10,
      correctCount: this.correctCount,
      errorCount: this.errorCount,
      backspacesCount: this.backspacesCount,
      totalKeystrokes: this.totalKeystrokes,
    };
  }

  computeConsistency() {
    if (this.keystrokeIntervals.length < 3) return 100;
    const n = this.keystrokeIntervals.length;
    const mean = this.keystrokeIntervals.reduce((a, b) => a + b, 0) / n;
    if (mean === 0) return 100;

    const variance = this.keystrokeIntervals.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    const cov = stdDev / mean;
    return Math.max(10, Math.min(100, (1 - cov * 0.5) * 100));
  }

  updateCaretPosition() {
    if (!this.caret || !this.textContainer) return;

    if (this.cursorIndex < this.charElements.length) {
      const span = this.charElements[this.cursorIndex];
      const spanRect = span.getBoundingClientRect();
      const containerRect = this.textContainer.getBoundingClientRect();

      const left = spanRect.left - containerRect.left;
      const top = spanRect.top - containerRect.top + 2;

      this.caret.style.left = `${left}px`;
      this.caret.style.top = `${top}px`;
      this.caret.style.display = 'block';
    } else if (this.charElements.length > 0) {
      // Past the last character
      const lastSpan = this.charElements[this.charElements.length - 1];
      const spanRect = lastSpan.getBoundingClientRect();
      const containerRect = this.textContainer.getBoundingClientRect();

      const left = spanRect.right - containerRect.left;
      const top = spanRect.top - containerRect.top + 2;

      this.caret.style.left = `${left}px`;
      this.caret.style.top = `${top}px`;
      this.caret.style.display = 'block';
    }
  }

  updateTargetKey() {
    if (this.keyboard) {
      const nextChar = this.cursorIndex < this.targetChars.length ? this.targetChars[this.cursorIndex] : null;
      this.keyboard.setTargetKey(nextChar);
    }
  }

  async finishSession() {
    this.endTime = performance.now();
    this.isActive = false;
    this.isCompleted = true;
    if (this.timerInterval) clearInterval(this.timerInterval);

    if (this.sound) this.sound.playVictoryChime();

    // Final data point
    const elapsedSec = (this.endTime - this.startTime) / 1000;
    const finalMetrics = this.computeMetrics();
    this.wpmGraphData.push({
      seconds: Math.round(elapsedSec * 10) / 10,
      wpm: finalMetrics.netWpm,
      raw_wpm: finalMetrics.grossWpm,
      errors: this.errorCount,
    });

    // Notify backend
    if (this.sessionId) {
      try {
        await fetch('/api/session/finish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: this.sessionId }),
        });
      } catch (err) {
        // Continue
      }
    }

    this.onCompleteCallbacks.forEach(cb => cb({
      metrics: finalMetrics,
      wpmGraph: this.wpmGraphData,
      weakKeys: this.weakKeys,
    }));
  }

  reset() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.startTime = null;
    this.endTime = null;
    this.isActive = false;
    this.isCompleted = false;
    this.cursorIndex = 0;
    this.correctCount = 0;
    this.totalKeystrokes = 0;
    this.errorCount = 0;
    this.backspacesCount = 0;
    this.keystrokeIntervals = [];
    this.lastKeystrokeTime = null;
    this.wpmGraphData = [];
    this.weakKeys = {};

    if (this.charElements) {
      this.charElements.forEach(span => {
        span.className = 'char';
      });
    }

    this.emitMetrics();
    this.updateCaretPosition();
    this.updateTargetKey();
    if (this.hiddenInput) this.hiddenInput.focus();
  }

  emitMetrics() {
    const metrics = this.computeMetrics();
    this.onMetricsUpdateCallbacks.forEach(cb => cb(metrics));
  }

  onMetricsUpdate(cb) {
    this.onMetricsUpdateCallbacks.push(cb);
  }

  onComplete(cb) {
    this.onCompleteCallbacks.push(cb);
  }
}

window.TypingEngine = TypingEngine;
