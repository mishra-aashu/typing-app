/**
 * TypeForge - Lesson & Curriculum Progression Manager
 * Tracks 68+ structured lessons across 5 difficulty tiers (Beginner, Intermediate, Advanced, Expert, Legend).
 * Features phase grouping, milestone unlocks, prerequisite validation, and persistence.
 */

class LessonManager {
  constructor() {
    this.lessons = {
      beginner: [],
      medium: [],
      advanced: [],
      expert: [],
      legend: [],
    };
    this.completedLessonIds = new Set();
    this.lessonProgress = {};
    this.lastActiveLessonId = null;
    this.currentDifficulty = 'beginner';
    this.activeLesson = null;
    this.onLessonChangeCallbacks = [];
    this.freePlayMode = false; // If true, all levels are unlocked without prerequisites
  }

  async fetchLessons() {
    try {
      const res = await fetch('/api/lessons');
      if (res.ok) {
        const data = await res.json();
        this.lessons.beginner = data.beginner || [];
        this.lessons.medium = data.medium || [];
        this.lessons.advanced = data.advanced || [];
        this.lessons.expert = data.expert || [];
        this.lessons.legend = data.legend || [];
        return true;
      }
    } catch (err) {
      console.warn('Could not reach backend API, loading local fallback catalog.', err);
    }
    this.loadFallbackLessons();
    return true;
  }

  loadFallbackLessons() {
    // =========================================================================
    // LEVEL 1: BEGINNER (18 Lessons, 20-40 WPM Goal)
    // =========================================================================
    this.lessons.beginner = [
      // Phase 1: Finger Placement & Home Row (1-5)
      {
        id: 'beg-01-home-row-1',
        title: 'F & J Index Anchor Keys',
        description: 'Practice the index finger resting keys featuring physical homing bumps.',
        difficulty: 'beginner',
        category: 'Phase 1 · Home Row',
        target_text: 'ff jj ff jj fff jjj fj fj jf jf ff jj fjf jfj ff jj ffff jjjj',
        min_target_wpm: 20.0,
        min_accuracy: 95.0,
      },
      {
        id: 'beg-02-home-row-all',
        title: 'Full Home Row (ASDF JKL;)',
        description: 'Master all 8 home row keys where your 8 typing fingers naturally rest.',
        difficulty: 'beginner',
        category: 'Phase 1 · Home Row',
        target_text: 'asdf jkl; asdf jkl; aadd ssff jjll kk;; ask dad fall lad glad salad flask',
        min_target_wpm: 25.0,
        min_accuracy: 95.0,
      },
      {
        id: 'beg-03-left-hand-iso',
        title: 'Left Hand Isolation (ASDF)',
        description: 'Strengthen pinky, ring, middle, and index coordination on your left hand.',
        difficulty: 'beginner',
        category: 'Phase 1 · Home Row',
        target_text: 'asdf fa sa da fa as as sad fad ads dad add fads daff daff dad sad as fads',
        min_target_wpm: 25.0,
        min_accuracy: 95.0,
      },
      {
        id: 'beg-04-right-hand-iso',
        title: 'Right Hand Isolation (JKL;)',
        description: 'Sharpen right hand muscle memory without relying on your visual glance.',
        difficulty: 'beginner',
        category: 'Phase 1 · Home Row',
        target_text: 'jkl; ;lkj jj kk ll ;; jak kal lajk all fall call kill look glad salad flak',
        min_target_wpm: 25.0,
        min_accuracy: 95.0,
      },
      {
        id: 'beg-05-index-reaches',
        title: 'Index Inward Reaches (G & H)',
        description: 'Stretch index fingers inward horizontally from F to G and J to H.',
        difficulty: 'beginner',
        category: 'Phase 1 · Home Row',
        target_text: 'fg hj fg hj glad half flash dash gas jag flag dash hall flask glad had has shag',
        min_target_wpm: 25.0,
        min_accuracy: 95.0,
      },

      // Phase 2: Top Row Reaches (6-9)
      {
        id: 'beg-06-top-e-i',
        title: 'High-Frequency Vowels (E & I)',
        description: 'Reach middle fingers upward to E (left) and I (right) - the most frequent vowels.',
        difficulty: 'beginner',
        category: 'Phase 2 · Top Row',
        target_text: 'de ki de ki see die side slide hide kid like life file hike fill feed side silk',
        min_target_wpm: 28.0,
        min_accuracy: 95.0,
      },
      {
        id: 'beg-07-top-r-u',
        title: 'Index Upward Extensions (R & U)',
        description: 'Extend index fingers upward to R (left) and U (right) with quick return to base.',
        difficulty: 'beginner',
        category: 'Phase 2 · Top Row',
        target_text: 'fr ju fr ju fur run jar red rug rail rule rush drum fur urge dust rust pure',
        min_target_wpm: 28.0,
        min_accuracy: 95.0,
      },
      {
        id: 'beg-08-top-t-y',
        title: 'Top Inward Angles (T & Y)',
        description: 'Reach upward and slightly inward for T and Y keys seamlessly.',
        difficulty: 'beginner',
        category: 'Phase 2 · Top Row',
        target_text: 'ft jy ft jy stay they tiny try yard year they yet tale tell tree yard test',
        min_target_wpm: 30.0,
        min_accuracy: 95.0,
      },
      {
        id: 'beg-09-top-q-w-o-p',
        title: 'Outer Top Row Wings (Q, W, O, P)',
        description: 'Engage ring fingers and pinkies on outer upper reaches with steady wrists.',
        difficulty: 'beginner',
        category: 'Phase 2 · Top Row',
        target_text: 'ow pe qw po walk drop plot pool slow wipe pass wire open quit post work',
        min_target_wpm: 28.0,
        min_accuracy: 94.0,
      },

      // Phase 3: Bottom Row Reaches (10-12)
      {
        id: 'beg-10-bot-v-n',
        title: 'Bottom Index Anchors (V & N)',
        description: 'Angle index fingers downward to V (left) and N (right) without lifting wrists.',
        difficulty: 'beginner',
        category: 'Phase 3 · Bottom Row',
        target_text: 'fv jn fv jn van fun never view next oven vain plan fine rain vine span down',
        min_target_wpm: 28.0,
        min_accuracy: 95.0,
      },
      {
        id: 'beg-11-bot-c-m',
        title: 'Middle Finger Drops (C & M)',
        description: 'Train downward drop of middle fingers to C (left) and M (right) with soft touch.',
        difficulty: 'beginner',
        category: 'Phase 3 · Bottom Row',
        target_text: 'dc km dc km calm come make much camp milk mask call calm cool come make',
        min_target_wpm: 28.0,
        min_accuracy: 95.0,
      },
      {
        id: 'beg-12-bot-x-z-b',
        title: 'Bottom Corner Reaches (X, Z, B)',
        description: 'Conquer tricky downward left pinky and ring finger reaches for Z, X, and B.',
        difficulty: 'beginner',
        category: 'Phase 3 · Bottom Row',
        target_text: 'az sx fb box zone zero exam zoom maze blaze basic brag buzz zebra back next',
        min_target_wpm: 26.0,
        min_accuracy: 94.0,
      },

      // Phase 4: Full Alphabet Integration (13-15)
      {
        id: 'beg-13-all-letters-pangram',
        title: 'Pangram & All-Key Cycling',
        description: 'Flow smoothly across every letter of the English alphabet in natural succession.',
        difficulty: 'beginner',
        category: 'Phase 4 · Integration',
        target_text: 'pack my box with five dozen liquor jugs while crazy fred helps jump over six big dogs',
        min_target_wpm: 30.0,
        min_accuracy: 95.0,
      },
      {
        id: 'beg-14-vowel-consonant-flow',
        title: 'Vowel & Consonant Alternation',
        description: 'Practice the natural rhythmic oscillation between vowel keystrokes and consonants.',
        difficulty: 'beginner',
        category: 'Phase 4 · Integration',
        target_text: 'banana planet melon river water solar cabin tulip magic radar lemon satin balance',
        min_target_wpm: 32.0,
        min_accuracy: 95.0,
      },
      {
        id: 'beg-15-three-letter-words',
        title: 'Core 3-Letter Word Foundation',
        description: 'Build rapid burst muscle memory on high-frequency 3-letter syllable building blocks.',
        difficulty: 'beginner',
        category: 'Phase 4 · Integration',
        target_text: 'the and for are but not you all any can had her was one our out day get has him his how man new now old see two way who boy did its let put say she too use',
        min_target_wpm: 32.0,
        min_accuracy: 95.0,
      },

      // Phase 5: Rhythm & Speed Unlock (16-18)
      {
        id: 'beg-16-top-100-words',
        title: 'Top 50 English Core Vocabulary',
        description: 'Develop seamless touch flow on the 50 most common words in English literature.',
        difficulty: 'beginner',
        category: 'Phase 5 · Speed Unlock',
        target_text: 'about after again against all also always another because before began between both came children come could does first great house know large little made might most much must never people place right should small something think through under water where which without world would',
        min_target_wpm: 35.0,
        min_accuracy: 96.0,
      },
      {
        id: 'beg-17-metronome-cadence',
        title: 'Metronome Rhythm & Cadence',
        description: 'Eliminate stuttering pauses: focus on steady, even temporal spacing between keys.',
        difficulty: 'beginner',
        category: 'Phase 5 · Speed Unlock',
        target_text: 'keep your hands calm and soft keep your mind still and sharp type each letter with steady grace feel the smooth rhythm carry your speed higher and higher every day',
        min_target_wpm: 35.0,
        min_accuracy: 96.0,
      },
      {
        id: 'beg-18-beginner-boss-test',
        title: 'Beginner Milestone Boss Test',
        description: 'Synthesize full alphabet agility and cross 40 WPM to unlock Intermediate tier!',
        difficulty: 'beginner',
        category: 'Phase 5 · Speed Unlock',
        target_text: 'learning to touch type without looking down is one of the most rewarding skills you will ever build with honest practice each finger finds its home automatically and your speed quickly multiplies',
        min_target_wpm: 40.0,
        min_accuracy: 96.0,
      },
    ];

    // =========================================================================
    // LEVEL 2: INTERMEDIATE (18 Lessons, 45-65 WPM Goal)
    // =========================================================================
    this.lessons.medium = [
      // Phase 1: Capital Letters & Shift (1-4)
      {
        id: 'med-01-left-shift',
        title: 'Left Shift: Right-Hand Capitals',
        description: 'Hold left Shift with your left pinky to capitalize right-hand letters (H, J, K, L, U, I, O, P, N, M).',
        difficulty: 'medium',
        category: 'Phase 1 · Capitals & Shift',
        target_text: 'London Tokyo Kyoto Mumbai New York Oslo Paris Rome Seoul Dublin Helsinki Lisbon Madrid',
        min_target_wpm: 40.0,
        min_accuracy: 96.0,
      },
      {
        id: 'med-02-right-shift',
        title: 'Right Shift: Left-Hand Capitals',
        description: 'Hold right Shift with your right pinky to capitalize left-hand letters (A, S, D, F, G, Q, W, E, R, T, Z, X, C, V, B).',
        difficulty: 'medium',
        category: 'Phase 1 · Capitals & Shift',
        target_text: 'Alice David Grace Frank Charlie Brian Edward Walter Rachel Thomas Sarah George Victoria',
        min_target_wpm: 40.0,
        min_accuracy: 96.0,
      },
      {
        id: 'med-03-proper-nouns',
        title: 'Proper Nouns & Sentence Capitalization',
        description: 'Alternate between left and right shift smoothly at natural sentence boundaries.',
        difficulty: 'medium',
        category: 'Phase 1 · Capitals & Shift',
        target_text: 'Every Monday morning, Dr. Watson walked to Baker Street to meet Sherlock Holmes for breakfast.',
        min_target_wpm: 45.0,
        min_accuracy: 96.0,
      },
      {
        id: 'med-04-caps-acronyms',
        title: 'Acronyms & Shift Bursts',
        description: 'Build stamina holding shift cleanly for abbreviations without dropping trailing characters.',
        difficulty: 'medium',
        category: 'Phase 1 · Capitals & Shift',
        target_text: 'HTTP requests utilize REST APIs over SSL/TLS channels with JSON, XML, and SQL payloads.',
        min_target_wpm: 45.0,
        min_accuracy: 95.0,
      },

      // Phase 2: Punctuation Mastery (5-8)
      {
        id: 'med-05-period-comma',
        title: 'Comma & Period Rhythm',
        description: 'Master quick punctuation strikes with immediate single-space thumb tap continuation.',
        difficulty: 'medium',
        category: 'Phase 2 · Punctuation',
        target_text: 'In the beginning, we move slowly, learning each step carefully. Over time, precision turns into natural, effortless speed.',
        min_target_wpm: 48.0,
        min_accuracy: 96.0,
      },
      {
        id: 'med-06-questions-exclamations',
        title: 'Question Marks & Exclamation Points',
        description: 'Reach for top-row Shift-1 and bottom-row Shift-slash without braking forward momentum.',
        difficulty: 'medium',
        category: 'Phase 2 · Punctuation',
        target_text: 'Are you ready? Of course you are! Can you feel your speed growing? Yes! Every single drill makes you faster!',
        min_target_wpm: 48.0,
        min_accuracy: 96.0,
      },
      {
        id: 'med-07-apostrophes-hyphens',
        title: 'Apostrophes, Contractions & Hyphens',
        description: "Pinky reaches for apostrophe (') and ring finger reaches for hyphen (-) in compounds.",
        difficulty: 'medium',
        category: 'Phase 2 · Punctuation',
        target_text: "Don't let yesterday's mistakes stop you. High-performance habits aren't built in a day, they're forged step-by-step.",
        min_target_wpm: 50.0,
        min_accuracy: 96.0,
      },
      {
        id: 'med-08-quotes-dialogue',
        title: 'Direct Quotations & Colons',
        description: 'Shift-quote (") and Shift-semicolon (:) in literary dialogue and structured notes.',
        difficulty: 'medium',
        category: 'Phase 2 · Punctuation',
        target_text: '"Remember this rule: always strike keys with conviction," the coach whispered, "never hesitate halfway."',
        min_target_wpm: 50.0,
        min_accuracy: 96.0,
      },

      // Phase 3: Number Row Mastery (9-11)
      {
        id: 'med-09-numbers-left',
        title: 'Left Hand Numbers (1, 2, 3, 4, 5)',
        description: 'Train precise vertical reaches up to top number keys 1 through 5 without glancing down.',
        difficulty: 'medium',
        category: 'Phase 3 · Numbers',
        target_text: '12 34 51 25 43 15 24 31 52 41 123 451 234 512 345 142 531 245 135 421',
        min_target_wpm: 38.0,
        min_accuracy: 94.0,
      },
      {
        id: 'med-10-numbers-right',
        title: 'Right Hand Numbers (6, 7, 8, 9, 0)',
        description: 'Reach top row keys 6 through 0 with right hand fingers while maintaining home row baseline.',
        difficulty: 'medium',
        category: 'Phase 3 · Numbers',
        target_text: '67 89 90 76 80 97 68 70 86 678 906 789 890 687 908 769 807 968 790',
        min_target_wpm: 38.0,
        min_accuracy: 94.0,
      },
      {
        id: 'med-11-numbers-context',
        title: 'Numbers in Context (Dates & Statistics)',
        description: 'Weave numerical values into real-world sentences effortlessly.',
        difficulty: 'medium',
        category: 'Phase 3 · Numbers',
        target_text: 'On July 20, 1969, Apollo 11 landed on the Moon, traveling over 240,000 miles in roughly 76 hours.',
        min_target_wpm: 45.0,
        min_accuracy: 95.0,
      },

      // Phase 4: Speed Building Prose (12-15)
      {
        id: 'med-12-classic-quote',
        title: 'Philosophical Cadence (Marcus Aurelius)',
        description: 'Classic philosophical passage requiring steady cadence, commas, and quiet concentration.',
        difficulty: 'medium',
        category: 'Phase 4 · Speed Prose',
        target_text: 'You have power over your mind, not outside events. Realize this, and you will find great strength in every quiet morning.',
        min_target_wpm: 52.0,
        min_accuracy: 96.0,
      },
      {
        id: 'med-13-tech-narrative',
        title: 'Modern Technology Narrative',
        description: 'Technical vocabulary with mixed sentence structure, polysyllabic words, and punctuation.',
        difficulty: 'medium',
        category: 'Phase 4 · Speed Prose',
        target_text: 'Distributed networks route packets across redundant undersea fiber cables, ensuring low latency for worldwide collaboration.',
        min_target_wpm: 55.0,
        min_accuracy: 96.0,
      },
      {
        id: 'med-14-science-writing',
        title: 'Scientific Prose: Quantum & Cosmos',
        description: 'High-density prose training rapid eye-finger coordination across long syllables.',
        difficulty: 'medium',
        category: 'Phase 4 · Speed Prose',
        target_text: 'Photons emitted by distant galaxies travel billions of light years before reaching telescope sensors, carrying echoes of cosmic dawn.',
        min_target_wpm: 55.0,
        min_accuracy: 96.0,
      },
      {
        id: 'med-15-business-communication',
        title: 'Professional Workplace Communication',
        description: 'Formal tone, polite phrasing, and practical email structure typed at executive speed.',
        difficulty: 'medium',
        category: 'Phase 4 · Speed Prose',
        target_text: "Please review the quarterly roadmap attached below. We will finalize our deliverables during Tuesday's strategy meeting.",
        min_target_wpm: 55.0,
        min_accuracy: 96.0,
      },

      // Phase 5: Intermediate Boss & Barriers (16-18)
      {
        id: 'med-16-60-wpm-barrier',
        title: '60 WPM Barrier Breaker',
        description: 'Accelerate through flowing continuous prose designed to propel your average speed past 60 words per minute.',
        difficulty: 'medium',
        category: 'Phase 5 · Milestone',
        target_text: 'The quick brown fox jumps over the lazy dog while bright sunbeams dance across golden autumn leaves and gentle evening breezes whisper through the tall green trees.',
        min_target_wpm: 60.0,
        min_accuracy: 97.0,
      },
      {
        id: 'med-17-dialogue-sprint',
        title: 'Narrative Dialogue Sprint',
        description: 'Complex punctuation mix: quotes, em-dashes, questions, and swift narrative shifts.',
        difficulty: 'medium',
        category: 'Phase 5 · Milestone',
        target_text: '"Wait!" she called out, "Did you check the server logs? Everything looks green—we are ready to deploy!"',
        min_target_wpm: 58.0,
        min_accuracy: 96.0,
      },
      {
        id: 'med-18-intermediate-boss-test',
        title: 'Intermediate Milestone Boss Test',
        description: 'Surpass 65 WPM with 97% accuracy across mixed case, numbers, and punctuation to unlock Advanced!',
        difficulty: 'medium',
        category: 'Phase 5 · Milestone',
        target_text: 'Typing at 65 WPM places you in the top 15% of computer users globally. At this speed, your thoughts translate directly into digital form without conscious physical effort.',
        min_target_wpm: 65.0,
        min_accuracy: 97.0,
      },
    ];

    // =========================================================================
    // LEVEL 3: ADVANCED (14 Lessons, 70-85 WPM Goal)
    // =========================================================================
    this.lessons.advanced = [
      // Phase 1: Symbol Keys Mastery (1-4)
      {
        id: 'adv-01-brackets-braces',
        title: 'Brackets, Braces & Parentheses',
        description: 'Master matching delimiters [ ], { }, and ( ) with immediate finger recoil.',
        difficulty: 'advanced',
        category: 'Phase 1 · Symbol Keys',
        target_text: '{ [ ( item ) ] } [ { key: value } ] ( a + b ) * [ c - d ] { users[0].id } ( fn() )',
        min_target_wpm: 50.0,
        min_accuracy: 96.0,
      },
      {
        id: 'adv-02-operators',
        title: 'Arithmetic & Logic Operators',
        description: 'Rapidly type conditional and mathematical operators without breaking rhythm.',
        difficulty: 'advanced',
        category: 'Phase 1 · Symbol Keys',
        target_text: 'a == b && c != d || x <= y && z >= 0; count += 1; total = (subtotal * 1.08) - discount;',
        min_target_wpm: 52.0,
        min_accuracy: 96.0,
      },
      {
        id: 'adv-03-special-chars',
        title: 'Pointers, Hashes, Percents & Backticks',
        description: 'Train rare shifted keys: @, #, $, %, ^, &, *, ~, and backtick (`).',
        difficulty: 'advanced',
        category: 'Phase 1 · Symbol Keys',
        target_text: 'const url = `${baseUrl}/api/v1/users?limit=50&active=true#section`; $price = 99.95; 100%',
        min_target_wpm: 50.0,
        min_accuracy: 95.0,
      },
      {
        id: 'adv-04-symbols-blitz',
        title: 'Symbol Blitz Gauntlet',
        description: 'High-density symbol sequences designed to build unbreakable spatial awareness.',
        difficulty: 'advanced',
        category: 'Phase 1 · Symbol Keys',
        target_text: '{ [ ( < & | ^ ! ~ + - * / % = == === != !== <= >= && || -> => :: . , ; : ? ) ] }',
        min_target_wpm: 45.0,
        min_accuracy: 96.0,
      },

      // Phase 2: Web & Systems Syntax (5-9)
      {
        id: 'adv-05-html-markup',
        title: 'HTML5 Semantic Elements',
        description: 'Angle brackets, closing slashes, and attribute quotes at web speed.',
        difficulty: 'advanced',
        category: 'Phase 2 · Code Syntax',
        target_text: '<div class="hero-container" id="app"><h1 class="title">Welcome</h1><button type="submit" disabled>Send</button></div>',
        min_target_wpm: 58.0,
        min_accuracy: 96.0,
      },
      {
        id: 'adv-06-css-properties',
        title: 'CSS Declarations & Flexbox',
        description: 'Colons, semicolons, hyphens, and curly brackets common in styling stylesheets.',
        difficulty: 'advanced',
        category: 'Phase 2 · Code Syntax',
        target_text: '.card { display: flex; align-items: center; justify-content: space-between; border-radius: 8px; margin: 0 auto; }',
        min_target_wpm: 60.0,
        min_accuracy: 96.0,
      },
      {
        id: 'adv-07-json-payload',
        title: 'JSON Key-Value Structures',
        description: 'Nested objects, arrays, quoted keys, commas, and numeric literals in JSON payloads.',
        difficulty: 'advanced',
        category: 'Phase 2 · Code Syntax',
        target_text: '{"status": "success", "code": 200, "data": {"user_id": 10842, "roles": ["admin", "developer"], "active": true}}',
        min_target_wpm: 62.0,
        min_accuracy: 96.0,
      },
      {
        id: 'adv-08-bash-pipelines',
        title: 'Bash Pipelines & Flags',
        description: 'Pipes (|), redirects (>), flags (-rf, -la), and environment variables ($HOME).',
        difficulty: 'advanced',
        category: 'Phase 2 · Code Syntax',
        target_text: 'cat /var/log/syslog | grep -E "error|fatal" | awk \'{print $1, $5}\' | sort | uniq -c > output.txt',
        min_target_wpm: 60.0,
        min_accuracy: 96.0,
      },
      {
        id: 'adv-09-git-workflow',
        title: 'Git CLI & Commit Convention',
        description: 'Common git commands, branches, commit message conventions, and merge flags.',
        difficulty: 'advanced',
        category: 'Phase 2 · Code Syntax',
        target_text: 'git checkout -b feat/user-auth && git commit -m "feat(auth): implement jwt token rotation" && git push origin HEAD',
        min_target_wpm: 65.0,
        min_accuracy: 97.0,
      },

      // Phase 3: Consistency & Speed Drills (10-14)
      {
        id: 'adv-10-common-bigrams',
        title: 'High-Frequency English Bigrams',
        description: 'Train the top letter pairs that account for over 50% of typed English words.',
        difficulty: 'advanced',
        category: 'Phase 3 · Speed Conditioning',
        target_text: 'th he in er an re on at en nd ti es or te of ed is it al ar st to nt nd ou ea le sa si ar',
        min_target_wpm: 65.0,
        min_accuracy: 97.0,
      },
      {
        id: 'adv-11-common-trigrams',
        title: 'High-Frequency Trigrams & Suffixes',
        description: 'Internalize 3-letter combinations for effortless burst typing.',
        difficulty: 'advanced',
        category: 'Phase 3 · Speed Conditioning',
        target_text: 'the and ing ion tio ent for her his nth int eth for are but not you all any can had her was',
        min_target_wpm: 70.0,
        min_accuracy: 97.0,
      },
      {
        id: 'adv-12-pinky-conditioning',
        title: 'Pinky & Ring Finger Conditioning',
        description: 'Overcome finger fatigue on lateral keys Q, A, Z, P, and semicolon (;).',
        difficulty: 'advanced',
        category: 'Phase 3 · Speed Conditioning',
        target_text: 'plaza opaque quick zipper quartz policy puzzle quote qualify equip apply lazy zero panic splash',
        min_target_wpm: 65.0,
        min_accuracy: 96.0,
      },
      {
        id: 'adv-13-80-wpm-endurance',
        title: '80 WPM Endurance Sprint',
        description: 'Sustained high-velocity prose designed to push your threshold past 80 words per minute.',
        difficulty: 'advanced',
        category: 'Phase 3 · Speed Conditioning',
        target_text: 'Speed without precision is meaningless, but true mastery marries velocity with effortless accuracy. Every touch typist who crosses eighty words per minute discovers a state of complete flow where fingers move ahead of conscious thought.',
        min_target_wpm: 80.0,
        min_accuracy: 97.5,
      },
      {
        id: 'adv-14-advanced-boss-test',
        title: 'Advanced Milestone Boss Test',
        description: 'Surpass 85 WPM with 97.5% accuracy across prose and syntax to unlock Expert!',
        difficulty: 'advanced',
        category: 'Phase 3 · Speed Conditioning',
        target_text: 'Through rigorous repetition and deliberate focus, muscle memory completely replaces conscious hesitation. At eighty-five words per minute, your fingers act as an instantaneous physical bridge between imagination and executable software.',
        min_target_wpm: 85.0,
        min_accuracy: 97.5,
      },
    ];

    // =========================================================================
    // LEVEL 4: EXPERT (12 Lessons, 90-100 WPM Goal)
    // =========================================================================
    this.lessons.expert = [
      // Phase 1: Real Programming Idioms (1-6)
      {
        id: 'exp-01-rust-syntax',
        title: 'Rust: Pattern Matching & Enums',
        description: 'Practice typing idiomatic Rust structs, enums, match expressions, and curly braces.',
        difficulty: 'expert',
        category: 'Phase 1 · Real Code',
        target_text: 'pub fn parse_packet(buf: &[u8]) -> Result<Header, ParseError> { match buf.get(0..4) { Some(magic) if magic == [0x7F, b\'E\', b\'L\', b\'F\'] => Ok(Header::Elf), _ => Err(ParseError::InvalidMagic), } }',
        min_target_wpm: 65.0,
        min_accuracy: 97.0,
      },
      {
        id: 'exp-02-typescript-async',
        title: 'TypeScript: Generics & Async Streams',
        description: 'Generics, promises, arrow functions, destructuring, and template literals.',
        difficulty: 'expert',
        category: 'Phase 1 · Real Code',
        target_text: 'export const fetchMetrics = async <T>(endpoint: string, opts?: RequestInit): Promise<ApiResponse<T>> => { const res = await fetch(`${API_BASE}/${endpoint}`, { ...opts, headers: { \'Content-Type\': \'application/json\' } }); return res.json(); };',
        min_target_wpm: 68.0,
        min_accuracy: 97.0,
      },
      {
        id: 'exp-03-python-comprehensions',
        title: 'Python 3.12: Generators & Comprehensions',
        description: 'Nested brackets, colons, lambdas, and list comprehensions in Python.',
        difficulty: 'expert',
        category: 'Phase 1 · Real Code',
        target_text: 'matrix = [[(x ** 2) + y for x in range(10) if x % 2 == 0] for y in row_offsets if y > 0]',
        min_target_wpm: 68.0,
        min_accuracy: 97.0,
      },
      {
        id: 'exp-04-sql-analytics',
        title: 'SQL: Window Functions & Aggregations',
        description: 'Capitalized SQL keywords, subqueries, and window partition statements.',
        difficulty: 'expert',
        category: 'Phase 1 · Real Code',
        target_text: 'SELECT user_id, AVG(wpm) OVER (PARTITION BY user_id ORDER BY completed_at ROWS BETWEEN 9 PRECEDING AND CURRENT ROW) AS rolling_wpm FROM typing_sessions WHERE accuracy >= 95.0 GROUP BY user_id, completed_at, wpm;',
        min_target_wpm: 68.0,
        min_accuracy: 97.0,
      },
      {
        id: 'exp-05-cpp-pointers',
        title: 'C++20: Smart Pointers & References',
        description: 'Pointers, dereferencing, templates, lambdas, and namespaces in modern C++.',
        difficulty: 'expert',
        category: 'Phase 1 · Real Code',
        target_text: 'std::unique_ptr<Node> root = std::make_unique<Node>(value, std::move(left), std::move(right)); auto&& result = root->evaluate();',
        min_target_wpm: 65.0,
        min_accuracy: 97.0,
      },
      {
        id: 'exp-06-go-concurrency',
        title: 'Go: Goroutines & Channel Select',
        description: 'Channels (<-), select statements, struct tags, and error handling patterns in Go.',
        difficulty: 'expert',
        category: 'Phase 1 · Real Code',
        target_text: 'select { case msg := <-ch: process(msg) case <-time.After(5 * time.Second): return fmt.Errorf("timeout exceeded") }',
        min_target_wpm: 68.0,
        min_accuracy: 97.0,
      },

      // Phase 2: High-Velocity Challenges (7-10)
      {
        id: 'exp-07-speed-poem',
        title: 'High-Cadence Literary Velocity',
        description: 'Rapid literary meter training rapid rhythmic breathing and finger momentum.',
        difficulty: 'expert',
        category: 'Phase 2 · Velocity Drills',
        target_text: 'The architectural elegance of modern high-performance microprocessors derives from out-of-order instruction scheduling, speculative branch prediction, and multi-tiered cache hierarchies operating synchronously at gigahertz clock frequencies.',
        min_target_wpm: 85.0,
        min_accuracy: 98.0,
      },
      {
        id: 'exp-08-regex-patterns',
        title: 'Regex Patterns & Backslashes',
        description: 'Complex regular expression syntax with character classes, escapes, and quantifiers.',
        difficulty: 'expert',
        category: 'Phase 2 · Velocity Drills',
        target_text: "const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;",
        min_target_wpm: 55.0,
        min_accuracy: 96.0,
      },
      {
        id: 'exp-09-cli-oneliner',
        title: 'DevOps Shell Pipeline One-Liner',
        description: 'Intense combination of curly braces, sed commands, and docker orchestration flags.',
        difficulty: 'expert',
        category: 'Phase 2 · Velocity Drills',
        target_text: 'docker run --rm -it -v $(pwd):/workspace -p 8080:8080 --name web-dev node:20-alpine sh -c "npm install && npm run build"',
        min_target_wpm: 65.0,
        min_accuracy: 97.0,
      },
      {
        id: 'exp-10-config-manifests',
        title: 'TOML & YAML Infrastructure',
        description: 'Strict key indentation, booleans, arrays, and package definitions.',
        difficulty: 'expert',
        category: 'Phase 2 · Velocity Drills',
        target_text: '[package]\nname = "typeforge"\nversion = "0.2.0"\nedition = "2021"\n[dependencies]\ntokio = { version = "1.38", features = ["full"] }',
        min_target_wpm: 65.0,
        min_accuracy: 97.0,
      },

      // Phase 3: Expert Boss & Century Club (11-12)
      {
        id: 'exp-11-100-wpm-barrier',
        title: 'The 100 WPM Century Club Sprint',
        description: 'Join the top 1% of typists worldwide by maintaining triple-digit net velocity.',
        difficulty: 'expert',
        category: 'Phase 3 · Century Club',
        target_text: 'Breaking one hundred words per minute requires you to read entire words as single motor gestures rather than individual characters. Your hands anticipate the next sentence while your fingers effortlessly finish the current thought.',
        min_target_wpm: 100.0,
        min_accuracy: 98.0,
      },
      {
        id: 'exp-12-expert-boss-test',
        title: 'Expert Milestone Boss Test',
        description: 'Full synthesis of advanced vocabulary, syntax, and speed at 100 WPM to unlock Legend tier!',
        difficulty: 'expert',
        category: 'Phase 3 · Century Club',
        target_text: 'True mastery in software engineering and touch typing share the same fundamental truth: real speed is never about rushing; it is the natural byproduct of complete relaxation, disciplined technique, and absolute precision.',
        min_target_wpm: 100.0,
        min_accuracy: 98.0,
      },
    ];

    // =========================================================================
    // LEVEL 5: LEGEND (6 Lessons, 110-120+ WPM Goal)
    // =========================================================================
    this.lessons.legend = [
      {
        id: 'leg-01-alternating-hands',
        title: 'Hand Alternation Kinetic Flow',
        description: 'Train words that strictly alternate between left and right hands for astronomical burst speeds.',
        difficulty: 'legend',
        category: 'Legend · Apex Mastery',
        target_text: 'dismantled visual signals authentic panel formal suspend problem handle turn signal element visual toxic authentic',
        min_target_wpm: 110.0,
        min_accuracy: 98.0,
      },
      {
        id: 'leg-02-rolling-combos',
        title: 'Rolling Finger Inward Glides',
        description: 'Finger rolls where adjacent fingers cascade sequentially like a piano arpeggio.',
        difficulty: 'legend',
        category: 'Legend · Apex Mastery',
        target_text: 'bright light straight weight tonight flight slight height stream street strike strong string station action relation section',
        min_target_wpm: 115.0,
        min_accuracy: 98.5,
      },
      {
        id: 'leg-03-velocity-paragraphs',
        title: 'Elite Multitier Velocity Prose',
        description: 'Dense, complex literary vocabulary demanding sustained triple-digit velocity.',
        difficulty: 'legend',
        category: 'Legend · Apex Mastery',
        target_text: "The philosophical inquiry into artificial intelligence mirrors humanity's eternal quest to comprehend consciousness itself, seeking balance between deterministic computation and the elusive spark of creative intuition.",
        min_target_wpm: 115.0,
        min_accuracy: 98.5,
      },
      {
        id: 'leg-04-programmer-poetry',
        title: 'Programmer Poetry & Systems Cadence',
        description: 'Seamless weaving of code syntax, mathematical notations, and technical commentary.',
        difficulty: 'legend',
        category: 'Legend · Apex Mastery',
        target_text: 'for thread in workers.iter_mut() { thread.join().expect("thread panicked during parallel reduction"); } assert_eq!(checksum.finalize(), EXPECTED_HASH);',
        min_target_wpm: 105.0,
        min_accuracy: 98.5,
      },
      {
        id: 'leg-05-the-gauntlet',
        title: 'The Iron Gauntlet: Stamina Test',
        description: 'An intense 200+ word gauntlet challenging your neuromuscular endurance and mental focus.',
        difficulty: 'legend',
        category: 'Legend · Apex Mastery',
        target_text: 'High-performance athletes train their nervous systems to execute complex motor programs under intense physiological pressure. In the realm of digital input, master keyboardists achieve an identical state of unencumbered flow, converting abstract thoughts into permanent code with uncompromising speed and total fidelity.',
        min_target_wpm: 115.0,
        min_accuracy: 98.5,
      },
      {
        id: 'leg-06-grand-master',
        title: 'Grand Master 120+ WPM Apex Test',
        description: 'The pinnacle typing trial: 120 Words Per Minute with 99.0% pinpoint surgical accuracy!',
        difficulty: 'legend',
        category: 'Legend · Apex Mastery',
        target_text: 'You have arrived at the absolute pinnacle of touch typing mastery. At over one hundred twenty words per minute with ninety-nine percent accuracy, your hands do not merely press keys: they conduct a symphony of thought, speed, and uncompromising digital excellence.',
        min_target_wpm: 120.0,
        min_accuracy: 99.0,
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
      ...(this.lessons.advanced || []),
      ...(this.lessons.expert || []),
      ...(this.lessons.legend || []),
    ];
  }

  /**
   * Determine if a lesson is unlocked:
   * 1. If freePlayMode is on, all lessons are unlocked.
   * 2. If the lesson has already been completed, it is always unlocked.
   * 3. The FIRST lesson of EVERY tier (Beginner, Intermediate, Advanced, Expert, Legend) is ALWAYS unlocked!
   * 4. For subsequent lessons in that tier, it unlocks when the previous lesson in that tier is completed.
   */
  isLessonUnlocked(lessonId) {
    if (this.freePlayMode) return true;
    if (this.completedLessonIds.has(lessonId)) return true;

    // Find which tier this lesson belongs to
    for (const [tier, list] of Object.entries(this.lessons)) {
      const idx = list.findIndex(l => l.id === lessonId);
      if (idx !== -1) {
        // First lesson of ANY tier is always open for the user to try!
        if (idx === 0) return true;
        // Otherwise, unlocked if previous lesson in this tier is completed
        const prevInTier = list[idx - 1];
        return this.completedLessonIds.has(prevInTier.id);
      }
    }
    return true;
  }

  /**
   * Group lessons of a difficulty tier by Phase/Category
   */
  getLessonsGroupedByPhase(diff) {
    const list = this.getLessonsForDifficulty(diff);
    const groups = {};
    list.forEach(l => {
      const phase = l.category || 'General';
      if (!groups[phase]) groups[phase] = [];
      groups[phase].push(l);
    });
    return groups;
  }

  /**
   * Get completion statistics for a tier
   */
  getTierStats(diff) {
    const list = this.getLessonsForDifficulty(diff);
    const completed = list.filter(l => this.completedLessonIds.has(l.id));
    let totalWpm = 0;
    completed.forEach(l => {
      const p = this.lessonProgress[l.id];
      if (p && p.best_wpm) totalWpm += p.best_wpm;
    });
    return {
      total: list.length,
      completed: completed.length,
      percent: list.length > 0 ? Math.round((completed.length / list.length) * 100) : 0,
      avgWpm: completed.length > 0 ? Math.round(totalWpm / completed.length) : 0,
    };
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
    const current = this.lessonProgress[id] || {};
    this.lessonProgress[id] = {
      lesson_id: id,
      completed: true,
      best_wpm: Math.max(metrics?.netWpm || 0, current.best_wpm || 0),
      best_accuracy: Math.max(metrics?.accuracy || 0, current.best_accuracy || 0),
      times_completed: (current.times_completed || 0) + 1,
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
