use super::beginner::LessonItem;

pub fn get_medium_lessons() -> Vec<LessonItem> {
    vec![
        // ==========================================
        // Phase 1: Capital Letters & Shift (1-4)
        // ==========================================
        LessonItem {
            id: "med-01-left-shift".to_string(),
            title: "Left Shift: Right-Hand Capitals".to_string(),
            description: "Hold left Shift with your left pinky to capitalize right-hand letters (H, J, K, L, U, I, O, P, N, M).".to_string(),
            difficulty: "medium".to_string(),
            category: "Phase 1 · Capitals & Shift".to_string(),
            target_text: "London Tokyo Kyoto Mumbai New York Oslo Paris Rome Seoul Dublin Helsinki Lisbon Madrid".to_string(),
            min_target_wpm: 40.0,
            min_accuracy: 96.0,
        },
        LessonItem {
            id: "med-02-right-shift".to_string(),
            title: "Right Shift: Left-Hand Capitals".to_string(),
            description: "Hold right Shift with your right pinky to capitalize left-hand letters (A, S, D, F, G, Q, W, E, R, T, Z, X, C, V, B).".to_string(),
            difficulty: "medium".to_string(),
            category: "Phase 1 · Capitals & Shift".to_string(),
            target_text: "Alice David Grace Frank Charlie Brian Edward Walter Rachel Thomas Sarah George Victoria".to_string(),
            min_target_wpm: 40.0,
            min_accuracy: 96.0,
        },
        LessonItem {
            id: "med-03-proper-nouns".to_string(),
            title: "Proper Nouns & Sentence Capitalization".to_string(),
            description: "Alternate between left and right shift smoothly at natural sentence boundaries.".to_string(),
            difficulty: "medium".to_string(),
            category: "Phase 1 · Capitals & Shift".to_string(),
            target_text: "Every Monday morning, Dr. Watson walked to Baker Street to meet Sherlock Holmes for breakfast.".to_string(),
            min_target_wpm: 45.0,
            min_accuracy: 96.0,
        },
        LessonItem {
            id: "med-04-caps-acronyms".to_string(),
            title: "Acronyms & Shift Bursts".to_string(),
            description: "Build stamina holding shift cleanly for abbreviations without dropping trailing characters.".to_string(),
            difficulty: "medium".to_string(),
            category: "Phase 1 · Capitals & Shift".to_string(),
            target_text: "HTTP requests utilize REST APIs over SSL/TLS channels with JSON, XML, and SQL payloads.".to_string(),
            min_target_wpm: 45.0,
            min_accuracy: 95.0,
        },

        // ==========================================
        // Phase 2: Punctuation Mastery (5-8)
        // ==========================================
        LessonItem {
            id: "med-05-period-comma".to_string(),
            title: "Comma & Period Rhythm".to_string(),
            description: "Master quick punctuation strikes with immediate single-space thumb tap continuation.".to_string(),
            difficulty: "medium".to_string(),
            category: "Phase 2 · Punctuation".to_string(),
            target_text: "In the beginning, we move slowly, learning each step carefully. Over time, precision turns into natural, effortless speed.".to_string(),
            min_target_wpm: 48.0,
            min_accuracy: 96.0,
        },
        LessonItem {
            id: "med-06-questions-exclamations".to_string(),
            title: "Question Marks & Exclamation Points".to_string(),
            description: "Reach for top-row Shift-1 and bottom-row Shift-slash without braking forward momentum.".to_string(),
            difficulty: "medium".to_string(),
            category: "Phase 2 · Punctuation".to_string(),
            target_text: "Are you ready? Of course you are! Can you feel your speed growing? Yes! Every single drill makes you faster!".to_string(),
            min_target_wpm: 48.0,
            min_accuracy: 96.0,
        },
        LessonItem {
            id: "med-07-apostrophes-hyphens".to_string(),
            title: "Apostrophes, Contractions & Hyphens".to_string(),
            description: "Pinky reaches for apostrophe (') and ring finger reaches for hyphen (-) in compounds.".to_string(),
            difficulty: "medium".to_string(),
            category: "Phase 2 · Punctuation".to_string(),
            target_text: "Don't let yesterday's mistakes stop you. High-performance habits aren't built in a day, they're forged step-by-step.".to_string(),
            min_target_wpm: 50.0,
            min_accuracy: 96.0,
        },
        LessonItem {
            id: "med-08-quotes-dialogue".to_string(),
            title: "Direct Quotations & Colons".to_string(),
            description: "Shift-quote (\") and Shift-semicolon (:) in literary dialogue and structured notes.".to_string(),
            difficulty: "medium".to_string(),
            category: "Phase 2 · Punctuation".to_string(),
            target_text: "\"Remember this rule: always strike keys with conviction,\" the coach whispered, \"never hesitate halfway.\"",
            min_target_wpm: 50.0,
            min_accuracy: 96.0,
        },

        // ==========================================
        // Phase 3: Number Row Mastery (9-11)
        // ==========================================
        LessonItem {
            id: "med-09-numbers-left".to_string(),
            title: "Left Hand Numbers (1, 2, 3, 4, 5)".to_string(),
            description: "Train precise vertical reaches up to top number keys 1 through 5 without glancing down.".to_string(),
            difficulty: "medium".to_string(),
            category: "Phase 3 · Numbers".to_string(),
            target_text: "12 34 51 25 43 15 24 31 52 41 123 451 234 512 345 142 531 245 135 421".to_string(),
            min_target_wpm: 38.0,
            min_accuracy: 94.0,
        },
        LessonItem {
            id: "med-10-numbers-right".to_string(),
            title: "Right Hand Numbers (6, 7, 8, 9, 0)".to_string(),
            description: "Reach top row keys 6 through 0 with right hand fingers while maintaining home row baseline.".to_string(),
            difficulty: "medium".to_string(),
            category: "Phase 3 · Numbers".to_string(),
            target_text: "67 89 90 76 80 97 68 70 86 678 906 789 890 687 908 769 807 968 790".to_string(),
            min_target_wpm: 38.0,
            min_accuracy: 94.0,
        },
        LessonItem {
            id: "med-11-numbers-context".to_string(),
            title: "Numbers in Context (Dates & Statistics)".to_string(),
            description: "Weave numerical values into real-world sentences effortlessly.".to_string(),
            difficulty: "medium".to_string(),
            category: "Phase 3 · Numbers".to_string(),
            target_text: "On July 20, 1969, Apollo 11 landed on the Moon, traveling over 240,000 miles in roughly 76 hours.".to_string(),
            min_target_wpm: 45.0,
            min_accuracy: 95.0,
        },

        // ==========================================
        // Phase 4: Speed Building Prose (12-15)
        // ==========================================
        LessonItem {
            id: "med-12-classic-quote".to_string(),
            title: "Philosophical Cadence (Marcus Aurelius)".to_string(),
            description: "Classic philosophical passage requiring steady cadence, commas, and quiet concentration.".to_string(),
            difficulty: "medium".to_string(),
            category: "Phase 4 · Speed Prose".to_string(),
            target_text: "You have power over your mind, not outside events. Realize this, and you will find great strength in every quiet morning.".to_string(),
            min_target_wpm: 52.0,
            min_accuracy: 96.0,
        },
        LessonItem {
            id: "med-13-tech-narrative".to_string(),
            title: "Modern Technology Narrative".to_string(),
            description: "Technical vocabulary with mixed sentence structure, polysyllabic words, and punctuation.".to_string(),
            difficulty: "medium".to_string(),
            category: "Phase 4 · Speed Prose".to_string(),
            target_text: "Distributed networks route packets across redundant undersea fiber cables, ensuring low latency for worldwide collaboration.".to_string(),
            min_target_wpm: 55.0,
            min_accuracy: 96.0,
        },
        LessonItem {
            id: "med-14-science-writing".to_string(),
            title: "Scientific Prose: Quantum & Cosmos".to_string(),
            description: "High-density prose training rapid eye-finger coordination across long syllables.".to_string(),
            difficulty: "medium".to_string(),
            category: "Phase 4 · Speed Prose".to_string(),
            target_text: "Photons emitted by distant galaxies travel billions of light years before reaching telescope sensors, carrying echoes of cosmic dawn.".to_string(),
            min_target_wpm: 55.0,
            min_accuracy: 96.0,
        },
        LessonItem {
            id: "med-15-business-communication".to_string(),
            title: "Professional Workplace Communication".to_string(),
            description: "Formal tone, polite phrasing, and practical email structure typed at executive speed.".to_string(),
            difficulty: "medium".to_string(),
            category: "Phase 4 · Speed Prose".to_string(),
            target_text: "Please review the quarterly roadmap attached below. We will finalize our deliverables during Tuesday's strategy meeting.".to_string(),
            min_target_wpm: 55.0,
            min_accuracy: 96.0,
        },

        // ==========================================
        // Phase 5: Intermediate Boss & Barriers (16-18)
        // ==========================================
        LessonItem {
            id: "med-16-60-wpm-barrier".to_string(),
            title: "60 WPM Barrier Breaker".to_string(),
            description: "Accelerate through flowing continuous prose designed to propel your average speed past 60 words per minute.".to_string(),
            difficulty: "medium".to_string(),
            category: "Phase 5 · Milestone".to_string(),
            target_text: "The quick brown fox jumps over the lazy dog while bright sunbeams dance across golden autumn leaves and gentle evening breezes whisper through the tall green trees.".to_string(),
            min_target_wpm: 60.0,
            min_accuracy: 97.0,
        },
        LessonItem {
            id: "med-17-dialogue-sprint".to_string(),
            title: "Narrative Dialogue Sprint".to_string(),
            description: "Complex punctuation mix: quotes, em-dashes, questions, and swift narrative shifts.".to_string(),
            difficulty: "medium".to_string(),
            category: "Phase 5 · Milestone".to_string(),
            target_text: "\"Wait!\" she called out, \"Did you check the server logs? Everything looks green—we are ready to deploy!\"".to_string(),
            min_target_wpm: 58.0,
            min_accuracy: 96.0,
        },
        LessonItem {
            id: "med-18-intermediate-boss-test".to_string(),
            title: "Intermediate Milestone Boss Test".to_string(),
            description: "Surpass 65 WPM with 97% accuracy across mixed case, numbers, and punctuation to unlock Advanced!".to_string(),
            difficulty: "medium".to_string(),
            category: "Phase 5 · Milestone".to_string(),
            target_text: "Typing at 65 WPM places you in the top 15% of computer users globally. At this speed, your thoughts translate directly into digital form without conscious physical effort.".to_string(),
            min_target_wpm: 65.0,
            min_accuracy: 97.0,
        },
    ]
}
