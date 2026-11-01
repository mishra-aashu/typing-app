use super::beginner::LessonItem;
use rand::seq::SliceRandom;
use rand::thread_rng;

const COMMON_WORDS_POOL: &[&str] = &[
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "i",
    "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
    "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
    "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
    "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
    "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
    "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
    "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
    "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
    "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
    "great", "between", "need", "system", "program", "code", "light", "world", "never",
    "focus", "speed", "power", "swift", "build", "create", "drive", "pulse", "smart"
];

/// Generate dynamic test with specified word count
pub fn generate_random_words_lesson(word_count: usize) -> LessonItem {
    let mut rng = thread_rng();
    let mut selected_words = Vec::with_capacity(word_count);

    for _ in 0..word_count {
        if let Some(word) = COMMON_WORDS_POOL.choose(&mut rng) {
            selected_words.push(*word);
        }
    }

    let target_text = selected_words.join(" ");

    LessonItem {
        id: format!("custom-random-{}", word_count),
        title: format!("Dynamic Practice ({} Words)", word_count),
        description: format!("Randomized high-frequency vocabulary challenge with {} words.", word_count),
        difficulty: if word_count <= 25 {
            "beginner".to_string()
        } else if word_count <= 50 {
            "medium".to_string()
        } else {
            "expert".to_string()
        },
        category: "Dynamic Practice".to_string(),
        target_text,
        min_target_wpm: 40.0,
        min_accuracy: 95.0,
    }
}

/// Generate targeted drill specifically focusing on the user's weak keys
pub fn generate_weak_keys_drill(weak_keys: &[char]) -> LessonItem {
    let mut rng = thread_rng();
    
    // Filter words from pool that contain at least one weak key
    let mut matching_words: Vec<&str> = COMMON_WORDS_POOL
        .iter()
        .copied()
        .filter(|word| {
            weak_keys.iter().any(|&k| word.contains(k.to_ascii_lowercase()))
        })
        .collect();

    if matching_words.len() < 10 {
        // Fallback or repeat
        matching_words.extend_from_slice(&["quick", "practice", "focus", "precise", "accuracy", "habit", "rhythm"]);
    }

    matching_words.shuffle(&mut rng);
    let count = 25.min(matching_words.len());
    let target_text = matching_words[..count].join(" ");
    let keys_str: String = weak_keys.iter().collect::<Vec<_>>().iter().map(|c| c.to_string()).collect::<Vec<_>>().join(", ");

    LessonItem {
        id: "adaptive-weak-keys".to_string(),
        title: "Adaptive Weak Keys Drill".to_string(),
        description: format!("Targeted therapy for keys you frequently mistype: [{}]", keys_str),
        difficulty: "medium".to_string(),
        category: "Adaptive AI Drill".to_string(),
        target_text,
        min_target_wpm: 35.0,
        min_accuracy: 97.0,
    }
}
