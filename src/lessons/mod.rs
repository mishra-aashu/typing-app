pub mod beginner;
pub mod expert;
pub mod generator;
pub mod medium;

pub use beginner::{get_beginner_lessons, LessonItem};
pub use expert::get_expert_lessons;
pub use generator::{generate_random_words_lesson, generate_weak_keys_drill};
pub use medium::get_medium_lessons;

/// Retrieve all pre-configured lessons across all tiers
pub fn get_all_lessons() -> Vec<LessonItem> {
    let mut all = Vec::new();
    all.extend(get_beginner_lessons());
    all.extend(get_medium_lessons());
    all.extend(get_expert_lessons());
    all
}

/// Find a specific lesson by ID
pub fn find_lesson_by_id(id: &str) -> Option<LessonItem> {
    get_all_lessons().into_iter().find(|l| l.id == id)
}
