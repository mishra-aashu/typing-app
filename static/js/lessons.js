/**
 * TypeForge - Lesson & Curriculum Manager
 */

class LessonManager {
  constructor() {
    this.lessons = {
      beginner: [],
      medium: [],
      expert: [],
    };
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
        id: 'beg-06-common-words-100',
        title: 'Top 50 Common Words',
        description: 'The most frequent words in English literature and communication.',
        difficulty: 'beginner',
        category: 'Common Words',
        target_text: 'the and for you that was with are his they have this one had words but not what all were we when your can said there use an each which she do how their if will',
        min_target_wpm: 32.0,
        min_accuracy: 95.0,
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
        id: 'med-05-speed-burst',
        title: '60-Second Speed Burst',
        description: 'Flowing prose designed to break past your 60 WPM barrier.',
        difficulty: 'medium',
        category: 'Speed Burst',
        target_text: 'The quick brown fox jumps over the lazy dog while bright sunbeams dance across golden autumn leaves and gentle evening breezes whisper through the tall green trees.',
        min_target_wpm: 60.0,
        min_accuracy: 97.0,
      },
    ];

    this.lessons.expert = [
      {
        id: 'exp-01-rust-syntax',
        title: 'Rust Core & Pattern Matching',
        description: 'Practice typing idiomatic Rust structs, enums, match expressions, and curly braces.',
        difficulty: 'expert',
        category: 'Code: Rust',
        target_text: 'pub fn parse_packet(buf: &[u8]) -> Result<Header, ParseError> { match buf.get(0..4) { Some(magic) if magic == [0x7F, b\'E\', b\'L\', b\'F\'] => Ok(Header::Elf), _ => Err(ParseError::InvalidMagic), } }',
        min_target_wpm: 60.0,
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
    ];
  }

  getLessonsForDifficulty(diff) {
    return this.lessons[diff] || [];
  }

  setDifficulty(diff) {
    this.currentDifficulty = diff;
    const list = this.getLessonsForDifficulty(diff);
    if (list.length > 0) {
      this.selectLesson(list[0]);
    }
  }

  selectLesson(lesson) {
    this.activeLesson = lesson;
    this.triggerChange();
  }

  selectLessonById(id) {
    for (const group of Object.values(this.lessons)) {
      const found = group.find(l => l.id === id);
      if (found) {
        this.activeLesson = found;
        this.currentDifficulty = found.difficulty;
        this.triggerChange();
        return found;
      }
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
