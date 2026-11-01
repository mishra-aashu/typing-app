/**
 * TypeForge - Lesson & Curriculum Progression Manager
 * Tracks completed lessons, unlocks, and prevents re-loading already passed levels.
 */

class LessonManager {
  constructor() {
    this.lessons = {
      beginner: [],
      medium: [],
      expert: [],
    };
    this.completedLessonIds = new Set();
    this.lessonProgress = {};
    this.lastActiveLessonId = null;
    this.currentDifficulty = 'beginner';
    this.activeLesson = null;
    this.onLessonChangeCallbacks = [];
  }

  async fetchLessons() {
    try {
      const res = await fetch('/api/lessons');
      if (res.ok) {
        const data = await res.json();
        this.lessons.beginner = data.beginner;
        this.lessons.medium = data.medium;
        this.lessons.expert = data.expert;
        return true;
      }
    } catch (err) {
      console.warn('Could not reach backend API, loading local fallback catalog.', err);
      this.loadFallbackLessons();
      return true;
    }
    return false;
  }

  loadFallbackLessons() {
    this.lessons.beginner = [
      {
        id: 'beg-01-home-row-1',
        title: 'Home Row Basics (F & J)',
        description: 'Practice the index finger resting anchor keys with homing bumps.',
        difficulty: 'beginner',
        category: 'Home Row',
        target_text: 'ff jj ff jj fff jjj fj fj jf jf ff jj fjf jfj ff jj ffff jjjj',
        min_target_wpm: 20.0,
        min_accuracy: 95.0,
      },
      {
        id: 'beg-02-home-row-all',
        title: 'Full Home Row (ASDF JKL;)',
        description: 'Master all 8 home row keys where your fingers naturally rest.',
        difficulty: 'beginner',
        category: 'Home Row',
        target_text: 'asdf jkl; asdf jkl; aadd ssff jjll kk;; ask dad fall lad glad salad flask',
        min_target_wpm: 25.0,
        min_accuracy: 95.0,
      },
      {
        id: 'beg-03-index-reach',
        title: 'Index Reaches (G & H)',
        description: 'Stretch index fingers inward from F to G and J to H.',
        difficulty: 'beginner',
        category: 'Home Row',
        target_text: 'fg hj fg hj glad half flash dash gas jag flag dash hall flask glad had has',
        min_target_wpm: 25.0,
        min_accuracy: 95.0,
      },
      {
        id: 'beg-04-top-row-1',
        title: 'Top Row Introduction (QWERT YUIOP)',
        description: 'Reach upward to the most common vowel keys E, U, I, O.',
        difficulty: 'beginner',
        category: 'Top Row',
        target_text: 'tree write quiet power outer quote equip route wire pure write quiet',
        min_target_wpm: 28.0,
        min_accuracy: 94.0,
      },
      {
        id: 'beg-05-bottom-row-1',
        title: 'Bottom Row Foundations (ZXCVBNM)',
        description: 'Train downward finger reaches with precision and muscle memory.',
        difficulty: 'beginner',
        category: 'Bottom Row',
        target_text: 'zone calm back view next move bank comb zero zinc vibe come back',
        min_target_wpm: 25.0,
        min_accuracy: 94.0,
      },
      {
        id: 'beg-06-common-words-100',
        title: 'Top 50 Common Words',
        description: 'The most frequent words in English literature and communication.',
        difficulty: 'beginner',
        category: 'Common Words',
        target_text: 'the and for you that was with are his they have this one had words but not what all were we when your can said there use an each which she do how their if will',
        min_target_wpm: 32.0,
        min_accuracy: 95.0,
      },
      {
        id: 'beg-07-smooth-rhythm',
        title: 'Rhythm & Muscle Memory Drill',
        description: 'Focus on uniform timing between keystrokes without stopping.',
        difficulty: 'beginner',
        category: 'Rhythm Drills',
        target_text: 'fast hand soft sand cool wind warm light deep mind true path calm flow free bird safe home',
        min_target_wpm: 35.0,
        min_accuracy: 96.0,
      },
    ];

    this.lessons.medium = [
      {
        id: 'med-01-punctuation',
        title: 'Punctuation & Flow',
        description: 'Commas, periods, apostrophes, and question marks in natural sentences.',
        difficulty: 'medium',
        category: 'Punctuation',
        target_text: "Don't stop now, keep moving forward! Can you hear the music? Yes, it's playing softly, yet clearly.",
        min_target_wpm: 45.0,
        min_accuracy: 96.0,
      },
      {
        id: 'med-02-numbers-row',
        title: 'Number Row Mastery',
        description: 'Practice top number keys 0-9 without looking down at the keyboard.',
        difficulty: 'medium',
        category: 'Numbers',
        target_text: 'In 1984, the population reached 4,800,000, while in 2026, about 85% of people used 5G devices.',
        min_target_wpm: 40.0,
        min_accuracy: 94.0,
      },
      {
        id: 'med-03-classic-quote',
        title: 'Wisdom of Marcus Aurelius',
        description: 'Classic philosophical passage requiring steady cadence and capitals.',
        difficulty: 'medium',
        category: 'Quotes',
        target_text: 'You have power over your mind, not outside events. Realize this, and you will find strength in everyday moments.',
        min_target_wpm: 50.0,
        min_accuracy: 96.0,
      },
      {
        id: 'med-04-tech-narrative',
        title: 'The Architecture of the Web',
        description: 'Technical vocabulary with mixed sentence structure and capitalization.',
        difficulty: 'medium',
        category: 'Technical',
        target_text: 'Distributed systems communicate via reliable protocols, ensuring that packet loss does not corrupt critical payload buffers.',
        min_target_wpm: 55.0,
        min_accuracy: 96.0,
      },
      {
        id: 'med-05-speed-burst',
        title: '60-Second Speed Burst',
        description: 'Flowing prose designed to break past your 60 WPM barrier.',
        difficulty: 'medium',
        category: 'Speed Burst',
        target_text: 'The quick brown fox jumps over the lazy dog while bright sunbeams dance across golden autumn leaves and gentle evening breezes whisper through the tall green trees.',
        min_target_wpm: 60.0,
        min_accuracy: 97.0,
      },
      {
        id: 'med-06-dialogue',
        title: 'Dialogue & Quotation Marks',
        description: 'Conversational quotes with shifted punctuation: double quotes, hyphens, and exclamation points.',
        difficulty: 'medium',
        category: 'Dialogue',
        target_text: "\"Wait!\" she called out, \"Did you check the server logs? Everything looks green—we are ready to deploy!\"",
        min_target_wpm: 50.0,
        min_accuracy: 95.0,
      },
    ];

    this.lessons.expert = [
      {
        id: 'exp-01-rust-syntax',
        title: 'Rust Core & Pattern Matching',
        description: 'Practice typing idiomatic Rust structs, enums, match expressions, and curly braces.',
        difficulty: 'expert',
        category: 'Code: Rust',
        target_text: "pub fn parse_packet(buf: &[u8]) -> Result<Header, ParseError> { match buf.get(0..4) { Some(magic) if magic == [0x7F, b'E', b'L', b'F'] => Ok(Header::Elf), _ => Err(ParseError::InvalidMagic), } }",
        min_target_wpm: 60.0,
        min_accuracy: 97.0,
      },
      {
        id: 'exp-02-typescript-async',
        title: 'TypeScript Async Streams',
        description: 'Generics, promises, arrow functions, destructuring, and template literals.',
        difficulty: 'expert',
        category: 'Code: TypeScript',
        target_text: "export const fetchMetrics = async <T>(endpoint: string, opts?: RequestInit): Promise<ApiResponse<T>> => { const res = await fetch(`${API_BASE}/${endpoint}`, { ...opts, headers: { 'Content-Type': 'application/json' } }); return res.json(); };",
        min_target_wpm: 65.0,
        min_accuracy: 97.0,
      },
      {
        id: 'exp-03-symbols-blitz',
        title: 'Programming Symbols Blitz',
        description: 'Intense shift-key workout with braces, brackets, operators, and delimiters.',
        difficulty: 'expert',
        category: 'Symbol Drills',
        target_text: '{ [ ( < & | ^ ! ~ + - * / % = == === != !== <= >= && || -> => :: . , ; : ? ) ] }',
        min_target_wpm: 45.0,
        min_accuracy: 96.0,
      },
      {
        id: 'exp-04-python-comprehensions',
        title: 'Pythonic Generators & Decorators',
        description: 'Indentation, colons, lambdas, and list comprehensions in Python 3.12+.',
        difficulty: 'expert',
        category: 'Code: Python',
        target_text: 'matrix = [[(x ** 2) + y for x in range(10) if x % 2 == 0] for y in row_offsets if y > 0]',
        min_target_wpm: 60.0,
        min_accuracy: 97.0,
      },
      {
        id: 'exp-05-sql-analytics',
        title: 'SQL Window Functions & Aggregations',
        description: 'Capitalized SQL keywords, subqueries, and window partition statements.',
        difficulty: 'expert',
        category: 'Code: SQL',
        target_text: 'SELECT user_id, AVG(wpm) OVER (PARTITION BY user_id ORDER BY completed_at ROWS BETWEEN 9 PRECEDING AND CURRENT ROW) AS rolling_wpm FROM typing_sessions WHERE accuracy >= 95.0 GROUP BY user_id, completed_at, wpm;',
        min_target_wpm: 60.0,
        min_accuracy: 97.0,
      },
      {
        id: 'exp-06-high-speed-prose',
        title: 'Elite 100+ WPM Velocity Test',
        description: 'Complex sentence cadence designed for high-velocity touch typists.',
        difficulty: 'expert',
        category: 'Speed Champion',
        target_text: 'The architectural elegance of modern high-performance microprocessors derives from out-of-order instruction scheduling, speculative branch prediction, and multi-tiered cache hierarchies operating synchronously at gigahertz clock frequencies.',
        min_target_wpm: 80.0,
        min_accuracy: 98.0,
      },
    ];
  }

  /**
   * Synchronize completion state from persistent UserStats
   */
  syncProgress(stats) {
    if (!stats) return;
    this.completedLessonIds = new Set(stats.completed_lesson_ids || []);
    this.lessonProgress = stats.lesson_progress || {};
    this.lastActiveLessonId = stats.last_active_lesson_id || null;
  }

  isLessonCompleted(id) {
    return this.completedLessonIds.has(id);
  }

  getLessonProgress(id) {
    return this.lessonProgress[id] || null;
  }

  getAllLessonsFlat() {
    return [
      ...(this.lessons.beginner || []),
      ...(this.lessons.medium || []),
      ...(this.lessons.expert || []),
    ];
  }

  /**
   * Finds the first incomplete lesson across the curriculum.
   */
  findNextIncompleteLesson() {
    const all = this.getAllLessonsFlat();
    for (const l of all) {
      if (!this.completedLessonIds.has(l.id)) {
        return l;
      }
    }
    // If all are completed, return the first one or last one
    return all[0] || null;
  }

  /**
   * Determine which lesson to load when user opens the app:
   * 1. If user was on an incomplete lesson, resume it.
   * 2. Else, advance to the next incomplete lesson.
   */
  determineResumeLesson() {
    if (this.lastActiveLessonId) {
      const active = this.findLessonById(this.lastActiveLessonId);
      if (active && !this.completedLessonIds.has(active.id)) {
        return active;
      }
    }
    return this.findNextIncompleteLesson();
  }

  markLessonCompleted(id, metrics) {
    this.completedLessonIds.add(id);
    this.lessonProgress[id] = {
      lesson_id: id,
      completed: true,
      best_wpm: Math.max(metrics?.netWpm || 0, this.lessonProgress[id]?.best_wpm || 0),
      best_accuracy: Math.max(metrics?.accuracy || 0, this.lessonProgress[id]?.best_accuracy || 0),
      times_completed: (this.lessonProgress[id]?.times_completed || 0) + 1,
    };
  }

  getLessonsForDifficulty(diff) {
    return this.lessons[diff] || [];
  }

  setDifficulty(diff) {
    this.currentDifficulty = diff;
    const list = this.getLessonsForDifficulty(diff);
    if (list.length > 0) {
      // Pick first uncompleted in this difficulty, or first item
      const uncompleted = list.find(l => !this.completedLessonIds.has(l.id));
      this.selectLesson(uncompleted || list[0]);
    }
  }

  selectLesson(lesson) {
    if (!lesson) return;
    this.activeLesson = lesson;
    this.currentDifficulty = lesson.difficulty;
    this.lastActiveLessonId = lesson.id;

    // Persist active lesson to backend
    fetch('/api/progress/active-lesson', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lesson_id: lesson.id }),
    }).catch(() => {});

    this.triggerChange();
  }

  findLessonById(id) {
    for (const group of Object.values(this.lessons)) {
      const found = group.find(l => l.id === id);
      if (found) return found;
    }
    return null;
  }

  selectLessonById(id) {
    const found = this.findLessonById(id);
    if (found) {
      this.selectLesson(found);
      return found;
    }
    return null;
  }

  setCustomText(title, text) {
    this.activeLesson = {
      id: 'custom-' + Date.now(),
      title: title || 'Custom Practice',
      description: 'User provided custom practice text',
      difficulty: 'custom',
      category: 'Custom Text',
      target_text: text.trim(),
      min_target_wpm: 40.0,
      min_accuracy: 95.0,
    };
    this.currentDifficulty = 'custom';
    this.triggerChange();
  }

  async loadDynamicLesson(mode = 'words', count = 25) {
    try {
      const res = await fetch(`/api/dynamic-lesson?mode=${mode}&count=${count}`);
      if (res.ok) {
        const lesson = await res.json();
        this.activeLesson = lesson;
        this.currentDifficulty = lesson.difficulty;
        this.triggerChange();
        return lesson;
      }
    } catch (err) {
      console.error('Failed to load dynamic lesson:', err);
    }
  }

  onLessonChange(cb) {
    this.onLessonChangeCallbacks.push(cb);
  }

  triggerChange() {
    this.onLessonChangeCallbacks.forEach(cb => cb(this.activeLesson));
  }
}

window.LessonManager = LessonManager;
