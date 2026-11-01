use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use chrono::Utc;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TestResultRecord {
    pub id: String,
    pub lesson_id: String,
    pub lesson_title: String,
    pub difficulty: String,
    pub wpm: f64,
    pub raw_wpm: f64,
    pub accuracy: f64,
    pub consistency: f64,
    pub elapsed_seconds: f64,
    pub timestamp: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Achievement {
    pub id: String,
    pub title: String,
    pub description: String,
    pub icon: String,
    pub unlocked: bool,
    pub unlocked_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LessonProgress {
    pub lesson_id: String,
    pub completed: bool,
    pub best_wpm: f64,
    pub best_accuracy: f64,
    pub times_completed: usize,
    pub last_completed_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserStats {
    pub total_sessions_completed: usize,
    pub total_time_seconds: f64,
    pub highest_wpm: f64,
    pub average_wpm: f64,
    pub average_accuracy: f64,
    pub streak_days: usize,
    pub last_active_date: Option<String>,
    pub completed_lesson_ids: Vec<String>,
    #[serde(default)]
    pub lesson_progress: HashMap<String, LessonProgress>,
    #[serde(default)]
    pub last_active_lesson_id: Option<String>,
    pub key_error_heatmap: HashMap<char, usize>,
    pub achievements: Vec<Achievement>,
    pub recent_history: Vec<TestResultRecord>,
}

impl Default for UserStats {
    fn default() -> Self {
        Self {
            total_sessions_completed: 0,
            total_time_seconds: 0.0,
            highest_wpm: 0.0,
            average_wpm: 0.0,
            average_accuracy: 100.0,
            streak_days: 1,
            last_active_date: Some(Utc::now().format("%Y-%m-%d").to_string()),
            completed_lesson_ids: Vec::new(),
            lesson_progress: HashMap::new(),
            last_active_lesson_id: None,
            key_error_heatmap: HashMap::new(),
            achievements: default_achievements(),
            recent_history: Vec::new(),
        }
    }
}

pub fn default_achievements() -> Vec<Achievement> {
    vec![
        Achievement {
            id: "first_test".to_string(),
            title: "First Keystrokes".to_string(),
            description: "Completed your first typing session.".to_string(),
            icon: "zap".to_string(),
            unlocked: false,
            unlocked_at: None,
        },
        Achievement {
            id: "speed_40".to_string(),
            title: "Rapid Flow (40 WPM)".to_string(),
            description: "Surpassed 40 Words Per Minute with high accuracy.".to_string(),
            icon: "rocket".to_string(),
            unlocked: false,
            unlocked_at: None,
        },
        Achievement {
            id: "speed_60".to_string(),
            title: "Velocity Master (60 WPM)".to_string(),
            description: "Crossed the 60 WPM threshold — touch typing pro.".to_string(),
            icon: "flame".to_string(),
            unlocked: false,
            unlocked_at: None,
        },
        Achievement {
            id: "speed_100".to_string(),
            title: "Century Club (100 WPM)".to_string(),
            description: "Lightning fingertips: reached triple-digit WPM!".to_string(),
            icon: "crown".to_string(),
            unlocked: false,
            unlocked_at: None,
        },
        Achievement {
            id: "flawless_100".to_string(),
            title: "Laser Precision (100%)".to_string(),
            description: "Finished a complete lesson with 100% accuracy without errors.".to_string(),
            icon: "target".to_string(),
            unlocked: false,
            unlocked_at: None,
        },
        Achievement {
            id: "expert_coder".to_string(),
            title: "Silicon Scribe".to_string(),
            description: "Conquered an Expert level programming language test.".to_string(),
            icon: "code".to_string(),
            unlocked: false,
            unlocked_at: None,
        },
        Achievement {
            id: "consistency_star".to_string(),
            title: "Metronome Rhythm".to_string(),
            description: "Achieved >95% typing cadence consistency.".to_string(),
            icon: "music".to_string(),
            unlocked: false,
            unlocked_at: None,
        },
    ]
}

#[derive(Clone)]
pub struct StatsStorage {
    file_path: PathBuf,
    stats: Arc<Mutex<UserStats>>,
}

impl StatsStorage {
    pub fn new() -> Self {
        let mut path = PathBuf::from("data");
        let _ = fs::create_dir_all(&path);
        path.push("user_stats.json");

        let stats = if path.exists() {
            fs::read_to_string(&path)
                .ok()
                .and_then(|data| serde_json::from_str::<UserStats>(&data).ok())
                .unwrap_or_default()
        } else {
            UserStats::default()
        };

        Self {
            file_path: path,
            stats: Arc::new(Mutex::new(stats)),
        }
    }

    pub fn get_stats(&self) -> UserStats {
        let lock = self.stats.lock().unwrap();
        lock.clone()
    }

    pub fn set_last_active_lesson(&self, lesson_id: String) {
        let mut lock = self.stats.lock().unwrap();
        lock.last_active_lesson_id = Some(lesson_id);
        let updated = lock.clone();
        if let Ok(json) = serde_json::to_string_pretty(&updated) {
            let _ = fs::write(&self.file_path, json);
        }
    }

    pub fn record_session(&self, record: TestResultRecord, weak_keys: HashMap<char, usize>) -> UserStats {
        let mut lock = self.stats.lock().unwrap();
        
        lock.total_sessions_completed += 1;
        lock.total_time_seconds += record.elapsed_seconds;

        if record.wpm > lock.highest_wpm {
            lock.highest_wpm = record.wpm;
        }

        // Recompute rolling averages
        let count = lock.total_sessions_completed as f64;
        lock.average_wpm = ((lock.average_wpm * (count - 1.0)) + record.wpm) / count;
        lock.average_wpm = (lock.average_wpm * 10.0).round() / 10.0;

        lock.average_accuracy = ((lock.average_accuracy * (count - 1.0)) + record.accuracy) / count;
        lock.average_accuracy = (lock.average_accuracy * 10.0).round() / 10.0;

        // Remember active lesson
        lock.last_active_lesson_id = Some(record.lesson_id.clone());

        // Update completed lesson list if passed minimum criteria (>85% accuracy)
        if record.accuracy >= 85.0 && !lock.completed_lesson_ids.contains(&record.lesson_id) {
            lock.completed_lesson_ids.push(record.lesson_id.clone());
        }

        // Track per-lesson detailed progress
        let now_str = Utc::now().to_rfc3339();
        let progress = lock.lesson_progress.entry(record.lesson_id.clone()).or_insert_with(|| LessonProgress {
            lesson_id: record.lesson_id.clone(),
            completed: record.accuracy >= 85.0,
            best_wpm: record.wpm,
            best_accuracy: record.accuracy,
            times_completed: 0,
            last_completed_at: Some(now_str.clone()),
        });

        if record.accuracy >= 85.0 {
            progress.completed = true;
        }
        progress.times_completed += 1;
        if record.wpm > progress.best_wpm {
            progress.best_wpm = record.wpm;
        }
        if record.accuracy > progress.best_accuracy {
            progress.best_accuracy = record.accuracy;
        }
        progress.last_completed_at = Some(now_str.clone());

        // Merge weak keys error heatmap
        for (k, err_count) in weak_keys {
            *lock.key_error_heatmap.entry(k).or_insert(0) += err_count;
        }

        // Check & unlock achievements
        for ach in &mut lock.achievements {
            if !ach.unlocked {
                let should_unlock = match ach.id.as_str() {
                    "first_test" => true,
                    "speed_40" => record.wpm >= 40.0,
                    "speed_60" => record.wpm >= 60.0,
                    "speed_100" => record.wpm >= 100.0,
                    "flawless_100" => record.accuracy >= 100.0,
                    "expert_coder" => record.difficulty == "expert",
                    "consistency_star" => record.consistency >= 95.0,
                    _ => false,
                };
                if should_unlock {
                    ach.unlocked = true;
                    ach.unlocked_at = Some(now_str.clone());
                }
            }
        }

        // Prepend to history (keep last 50)
        lock.recent_history.insert(0, record);
        if lock.recent_history.len() > 50 {
            lock.recent_history.truncate(50);
        }

        let updated = lock.clone();

        // Persist to file
        if let Ok(json) = serde_json::to_string_pretty(&updated) {
            let _ = fs::write(&self.file_path, json);
        }

        updated
    }

    pub fn reset_stats(&self) -> UserStats {
        let mut lock = self.stats.lock().unwrap();
        *lock = UserStats::default();
        let fresh = lock.clone();
        if let Ok(json) = serde_json::to_string_pretty(&fresh) {
            let _ = fs::write(&self.file_path, json);
        }
        fresh
    }
}
