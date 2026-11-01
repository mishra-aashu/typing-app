use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LessonItem {
    pub id: String,
    pub title: String,
    pub description: String,
    pub difficulty: String, // "beginner", "medium", "advanced", "expert", "legend"
    pub category: String,   // E.g. "Phase 1 · Home Row"
    pub target_text: String,
    pub min_target_wpm: f64,
    pub min_accuracy: f64,
}

pub fn get_beginner_lessons() -> Vec<LessonItem> {
    vec![
        // ==========================================
        // Phase 1: Finger Placement & Home Row (1-5)
        // ==========================================
        LessonItem {
            id: "beg-01-home-row-1".to_string(),
            title: "F & J Index Anchor Keys".to_string(),
            description: "Practice the index finger resting keys featuring physical homing bumps.".to_string(),
            difficulty: "beginner".to_string(),
            category: "Phase 1 · Home Row".to_string(),
            target_text: "ff jj ff jj fff jjj fj fj jf jf ff jj fjf jfj ff jj ffff jjjj".to_string(),
            min_target_wpm: 20.0,
            min_accuracy: 95.0,
        },
        LessonItem {
            id: "beg-02-home-row-all".to_string(),
            title: "Full Home Row (ASDF JKL;)".to_string(),
            description: "Master all 8 home row keys where your 8 typing fingers naturally rest.".to_string(),
            difficulty: "beginner".to_string(),
            category: "Phase 1 · Home Row".to_string(),
            target_text: "asdf jkl; asdf jkl; aadd ssff jjll kk;; ask dad fall lad glad salad flask".to_string(),
            min_target_wpm: 25.0,
            min_accuracy: 95.0,
        },
        LessonItem {
            id: "beg-03-left-hand-iso".to_string(),
            title: "Left Hand Isolation (ASDF)".to_string(),
            description: "Strengthen pinky, ring, middle, and index coordination on your left hand.".to_string(),
            difficulty: "beginner".to_string(),
            category: "Phase 1 · Home Row".to_string(),
            target_text: "asdf fa sa da fa as as sad fad ads dad add fads daff daff dad sad as fads".to_string(),
            min_target_wpm: 25.0,
            min_accuracy: 95.0,
        },
        LessonItem {
            id: "beg-04-right-hand-iso".to_string(),
            title: "Right Hand Isolation (JKL;)".to_string(),
            description: "Sharpen right hand muscle memory without relying on your visual glance.".to_string(),
            difficulty: "beginner".to_string(),
            category: "Phase 1 · Home Row".to_string(),
            target_text: "jkl; ;lkj jj kk ll ;; jak kal lajk all fall call kill look glad salad flak".to_string(),
            min_target_wpm: 25.0,
            min_accuracy: 95.0,
        },
        LessonItem {
            id: "beg-05-index-reaches".to_string(),
            title: "Index Inward Reaches (G & H)".to_string(),
            description: "Stretch index fingers inward horizontally from F to G and J to H.".to_string(),
            difficulty: "beginner".to_string(),
            category: "Phase 1 · Home Row".to_string(),
            target_text: "fg hj fg hj glad half flash dash gas jag flag dash hall flask glad had has shag".to_string(),
            min_target_wpm: 25.0,
            min_accuracy: 95.0,
        },

        // ==========================================
        // Phase 2: Top Row Reaches (6-9)
        // ==========================================
        LessonItem {
            id: "beg-06-top-e-i".to_string(),
            title: "High-Frequency Vowels (E & I)".to_string(),
            description: "Reach middle fingers upward to E (left) and I (right) - the most frequent vowels.".to_string(),
            difficulty: "beginner".to_string(),
            category: "Phase 2 · Top Row".to_string(),
            target_text: "de ki de ki see die side slide hide kid like life file hike fill feed side silk".to_string(),
            min_target_wpm: 28.0,
            min_accuracy: 95.0,
        },
        LessonItem {
            id: "beg-07-top-r-u".to_string(),
            title: "Index Upward Extensions (R & U)".to_string(),
            description: "Extend index fingers upward to R (left) and U (right) with quick return to base.".to_string(),
            difficulty: "beginner".to_string(),
            category: "Phase 2 · Top Row".to_string(),
            target_text: "fr ju fr ju fur run jar red rug rail rule rush drum fur urge dust rust pure".to_string(),
            min_target_wpm: 28.0,
            min_accuracy: 95.0,
        },
        LessonItem {
            id: "beg-08-top-t-y".to_string(),
            title: "Top Inward Angles (T & Y)".to_string(),
            description: "Reach upward and slightly inward for T and Y keys seamlessly.".to_string(),
            difficulty: "beginner".to_string(),
            category: "Phase 2 · Top Row".to_string(),
            target_text: "ft jy ft jy stay they tiny try yard year they yet tale tell tree yard test".to_string(),
            min_target_wpm: 30.0,
            min_accuracy: 95.0,
        },
        LessonItem {
            id: "beg-09-top-q-w-o-p".to_string(),
            title: "Outer Top Row Wings (Q, W, O, P)".to_string(),
            description: "Engage ring fingers and pinkies on outer upper reaches with steady wrists.".to_string(),
            difficulty: "beginner".to_string(),
            category: "Phase 2 · Top Row".to_string(),
            target_text: "ow pe qw po walk drop plot pool slow wipe pass wire open quit post work".to_string(),
            min_target_wpm: 28.0,
            min_accuracy: 94.0,
        },

        // ==========================================
        // Phase 3: Bottom Row Reaches (10-12)
        // ==========================================
        LessonItem {
            id: "beg-10-bot-v-n".to_string(),
            title: "Bottom Index Anchors (V & N)".to_string(),
            description: "Angle index fingers downward to V (left) and N (right) without lifting wrists.".to_string(),
            difficulty: "beginner".to_string(),
            category: "Phase 3 · Bottom Row".to_string(),
            target_text: "fv jn fv jn van fun never view next oven vain plan fine rain vine span down".to_string(),
            min_target_wpm: 28.0,
            min_accuracy: 95.0,
        },
        LessonItem {
            id: "beg-11-bot-c-m".to_string(),
            title: "Middle Finger Drops (C & M)".to_string(),
            description: "Train downward drop of middle fingers to C (left) and M (right) with soft touch.".to_string(),
            difficulty: "beginner".to_string(),
            category: "Phase 3 · Bottom Row".to_string(),
            target_text: "dc km dc km calm come make much camp milk mask call calm cool come make".to_string(),
            min_target_wpm: 28.0,
            min_accuracy: 95.0,
        },
        LessonItem {
            id: "beg-12-bot-x-z-b".to_string(),
            title: "Bottom Corner Reaches (X, Z, B)".to_string(),
            description: "Conquer tricky downward left pinky and ring finger reaches for Z, X, and B.".to_string(),
            difficulty: "beginner".to_string(),
            category: "Phase 3 · Bottom Row".to_string(),
            target_text: "az sx fb box zone zero exam zoom maze blaze basic brag buzz zebra back next".to_string(),
            min_target_wpm: 26.0,
            min_accuracy: 94.0,
        },

        // ==========================================
        // Phase 4: Full Alphabet Integration (13-15)
        // ==========================================
        LessonItem {
            id: "beg-13-all-letters-pangram".to_string(),
            title: "Pangram & All-Key Cycling".to_string(),
            description: "Flow smoothly across every letter of the English alphabet in natural succession.".to_string(),
            difficulty: "beginner".to_string(),
            category: "Phase 4 · Integration".to_string(),
            target_text: "pack my box with five dozen liquor jugs while crazy fred helps jump over six big dogs".to_string(),
            min_target_wpm: 30.0,
            min_accuracy: 95.0,
        },
        LessonItem {
            id: "beg-14-vowel-consonant-flow".to_string(),
            title: "Vowel & Consonant Alternation".to_string(),
            description: "Practice the natural rhythmic oscillation between vowel keystrokes and consonants.".to_string(),
            difficulty: "beginner".to_string(),
            category: "Phase 4 · Integration".to_string(),
            target_text: "banana planet melon river water solar cabin tulip magic radar lemon satin balance".to_string(),
            min_target_wpm: 32.0,
            min_accuracy: 95.0,
        },
        LessonItem {
            id: "beg-15-three-letter-words".to_string(),
            title: "Core 3-Letter Word Foundation".to_string(),
            description: "Build rapid burst muscle memory on high-frequency 3-letter syllable building blocks.".to_string(),
            difficulty: "beginner".to_string(),
            category: "Phase 4 · Integration".to_string(),
            target_text: "the and for are but not you all any can had her was one our out day get has him his how man new now old see two way who boy did its let put say she too use".to_string(),
            min_target_wpm: 32.0,
            min_accuracy: 95.0,
        },

        // ==========================================
        // Phase 5: Rhythm & Speed Unlock (16-18)
        // ==========================================
        LessonItem {
            id: "beg-16-top-100-words".to_string(),
            title: "Top 50 English Core Vocabulary".to_string(),
            description: "Develop seamless touch flow on the 50 most common words in English literature.".to_string(),
            difficulty: "beginner".to_string(),
            category: "Phase 5 · Speed Unlock".to_string(),
            target_text: "about after again against all also always another because before began between both came children come could does first great house know large little made might most much must never people place right should small something think through under water where which without world would".to_string(),
            min_target_wpm: 35.0,
            min_accuracy: 96.0,
        },
        LessonItem {
            id: "beg-17-metronome-cadence".to_string(),
            title: "Metronome Rhythm & Cadence".to_string(),
            description: "Eliminate stuttering pauses: focus on steady, even temporal spacing between keys.".to_string(),
            difficulty: "beginner".to_string(),
            category: "Phase 5 · Speed Unlock".to_string(),
            target_text: "keep your hands calm and soft keep your mind still and sharp type each letter with steady grace feel the smooth rhythm carry your speed higher and higher every day".to_string(),
            min_target_wpm: 35.0,
            min_accuracy: 96.0,
        },
        LessonItem {
            id: "beg-18-beginner-boss-test".to_string(),
            title: "Beginner Milestone Boss Test".to_string(),
            description: "Synthesize full alphabet agility and cross 40 WPM to unlock Intermediate tier!".to_string(),
            difficulty: "beginner".to_string(),
            category: "Phase 5 · Speed Unlock".to_string(),
            target_text: "learning to touch type without looking down is one of the most rewarding skills you will ever build with honest practice each finger finds its home automatically and your speed quickly multiplies".to_string(),
            min_target_wpm: 40.0,
            min_accuracy: 96.0,
        },
    ]
}
