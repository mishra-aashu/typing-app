use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LessonItem {
    pub id: String,
    pub title: String,
    pub description: String,
    pub difficulty: String, // "beginner", "medium", "expert"
    pub category: String,   // "home_row", "top_row", "bottom_row", "words", etc.
    pub target_text: String,
    pub min_target_wpm: f64,
    pub min_accuracy: f64,
}

pub fn get_beginner_lessons() -> Vec<LessonItem> {
    vec![
        LessonItem {
            id: "beg-01-home-row-1".to_string(),
            title: "Home Row Basics (F & J)".to_string(),
            description: "Practice the index finger resting anchor keys with homing bumps.".to_string(),
            difficulty: "beginner".to_string(),
            category: "Home Row".to_string(),
            target_text: "ff jj ff jj fff jjj fj fj jf jf ff jj fjf jfj ff jj ffff jjjj".to_string(),
            min_target_wpm: 20.0,
            min_accuracy: 95.0,
        },
        LessonItem {
            id: "beg-02-home-row-all".to_string(),
            title: "Full Home Row (ASDF JKL;)".to_string(),
            description: "Master all 8 home row keys where your fingers naturally rest.".to_string(),
            difficulty: "beginner".to_string(),
            category: "Home Row".to_string(),
            target_text: "asdf jkl; asdf jkl; aadd ssff jjll kk;; ask dad fall lad glad salad flask".to_string(),
            min_target_wpm: 25.0,
            min_accuracy: 95.0,
        },
        LessonItem {
            id: "beg-03-index-reach".to_string(),
            title: "Index Reaches (G & H)".to_string(),
            description: "Stretch index fingers inward from F to G and J to H.".to_string(),
            difficulty: "beginner".to_string(),
            category: "Home Row".to_string(),
            target_text: "fg hj fg hj glad half flash dash gas jag flag dash hall flask glad had has".to_string(),
            min_target_wpm: 25.0,
            min_accuracy: 95.0,
        },
        LessonItem {
            id: "beg-04-top-row-1".to_string(),
            title: "Top Row Introduction (QWERT YUIOP)".to_string(),
            description: "Reach upward to the most common vowel keys E, U, I, O.".to_string(),
            difficulty: "beginner".to_string(),
            category: "Top Row".to_string(),
            target_text: "tree write quiet power outer quote equip route wire pure write quiet".to_string(),
            min_target_wpm: 28.0,
            min_accuracy: 94.0,
        },
        LessonItem {
            id: "beg-05-bottom-row-1".to_string(),
            title: "Bottom Row Foundations (ZXCVBNM)".to_string(),
            description: "Train downward finger reaches with precision and muscle memory.".to_string(),
            difficulty: "beginner".to_string(),
            category: "Bottom Row".to_string(),
            target_text: "zone calm back view next move bank comb zero zinc vibe come back".to_string(),
            min_target_wpm: 25.0,
            min_accuracy: 94.0,
        },
        LessonItem {
            id: "beg-06-common-words-100".to_string(),
            title: "Top 50 Common Words".to_string(),
            description: "The most frequent words in English literature and communication.".to_string(),
            difficulty: "beginner".to_string(),
            category: "Common Words".to_string(),
            target_text: "the and for you that was with are his they have this one had words but not what all were we when your can said there use an each which she do how their if will".to_string(),
            min_target_wpm: 32.0,
            min_accuracy: 95.0,
        },
        LessonItem {
            id: "beg-07-smooth-rhythm".to_string(),
            title: "Rhythm & Muscle Memory Drill".to_string(),
            description: "Focus on uniform timing between keystrokes without stopping.".to_string(),
            difficulty: "beginner".to_string(),
            category: "Rhythm Drills".to_string(),
            target_text: "fast hand soft sand cool wind warm light deep mind true path calm flow free bird safe home".to_string(),
            min_target_wpm: 35.0,
            min_accuracy: 96.0,
        },
    ]
}
