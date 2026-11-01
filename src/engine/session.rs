use super::metrics::{calculate_metrics, TypingMetrics};
use super::validator::{CharStatus, TextValidator};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::time::Instant;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WpmDataPoint {
    pub seconds: f64,
    pub wpm: f64,
    pub raw_wpm: f64,
    pub errors: usize,
}

#[derive(Debug)]
pub struct TypingSession {
    pub id: Uuid,
    pub lesson_id: String,
    pub target_text: String,
    pub validator: TextValidator,
    pub start_instant: Option<Instant>,
    pub end_instant: Option<Instant>,
    pub total_keystrokes: usize,
    pub total_errors: usize,
    pub total_backspaces: usize,
    pub weak_keys: HashMap<char, usize>,
    pub keystroke_intervals_ms: Vec<u64>,
    pub last_keystroke_instant: Option<Instant>,
    pub wpm_graph: Vec<WpmDataPoint>,
    pub is_active: bool,
    pub is_completed: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SessionSnapshot {
    pub id: String,
    pub lesson_id: String,
    pub target_text: String,
    pub cursor_position: usize,
    pub char_statuses: Vec<CharStatus>,
    pub metrics: TypingMetrics,
    pub is_completed: bool,
    pub wpm_graph: Vec<WpmDataPoint>,
}

impl TypingSession {
    pub fn new(lesson_id: String, target_text: String) -> Self {
        let validator = TextValidator::new(&target_text);
        Self {
            id: Uuid::new_v4(),
            lesson_id,
            target_text,
            validator,
            start_instant: None,
            end_instant: None,
            total_keystrokes: 0,
            total_errors: 0,
            total_backspaces: 0,
            weak_keys: HashMap::new(),
            keystroke_intervals_ms: Vec::new(),
            last_keystroke_instant: None,
            wpm_graph: Vec::new(),
            is_active: false,
            is_completed: false,
        }
    }

    /// Process a typed character
    pub fn process_char(&mut self, typed_char: char) -> bool {
        let now = Instant::now();

        // Start session timer on the first keystroke
        if self.start_instant.is_none() {
            self.start_instant = Some(now);
            self.is_active = true;
        }

        // Track interval between keystrokes for consistency scoring
        if let Some(last) = self.last_keystroke_instant {
            let interval = now.duration_since(last).as_millis() as u64;
            self.keystroke_intervals_ms.push(interval);
        }
        self.last_keystroke_instant = Some(now);
        self.total_keystrokes += 1;

        let elapsed_ms = self.start_instant
            .map(|s| now.duration_since(s).as_millis() as u64)
            .unwrap_or(0);

        let (is_correct, expected_char) = self.validator.type_char(typed_char, elapsed_ms);

        if !is_correct {
            self.total_errors += 1;
            if let Some(exp) = expected_char {
                *self.weak_keys.entry(exp).or_insert(0) += 1;
            }
        }

        // Periodically record points for speed graph
        let elapsed_sec = self.elapsed_seconds();
        if self.wpm_graph.is_empty() || elapsed_sec - self.wpm_graph.last().unwrap().seconds >= 1.0 {
            let metrics = self.current_metrics();
            self.wpm_graph.push(WpmDataPoint {
                seconds: elapsed_sec,
                wpm: metrics.net_wpm,
                raw_wpm: metrics.gross_wpm,
                errors: self.total_errors,
            });
        }

        if self.validator.is_completed() {
            self.finish();
        }

        is_correct
    }

    /// Process a backspace keystroke
    pub fn process_backspace(&mut self) -> bool {
        if self.validator.current_cursor > 0 {
            self.total_backspaces += 1;
            self.total_keystrokes += 1;
            self.validator.backspace()
        } else {
            false
        }
    }

    /// Complete the session
    pub fn finish(&mut self) {
        if !self.is_completed {
            self.end_instant = Some(Instant::now());
            self.is_completed = true;
            self.is_active = false;

            // Final data point for graph
            let elapsed_sec = self.elapsed_seconds();
            let metrics = self.current_metrics();
            self.wpm_graph.push(WpmDataPoint {
                seconds: elapsed_sec,
                wpm: metrics.net_wpm,
                raw_wpm: metrics.gross_wpm,
                errors: self.total_errors,
            });
        }
    }

    /// Calculate elapsed active typing seconds
    pub fn elapsed_seconds(&self) -> f64 {
        match (self.start_instant, self.end_instant) {
            (Some(start), Some(end)) => end.duration_since(start).as_secs_f64(),
            (Some(start), None) => Instant::now().duration_since(start).as_secs_f64(),
            _ => 0.0,
        }
    }

    /// Calculate real-time metrics
    pub fn current_metrics(&self) -> TypingMetrics {
        calculate_metrics(
            self.validator.correct_count(),
            self.total_keystrokes,
            self.total_errors,
            self.total_backspaces,
            self.elapsed_seconds(),
            self.weak_keys.clone(),
            &self.keystroke_intervals_ms,
        )
    }

    /// Create snapshot to send to frontend
    pub fn snapshot(&self) -> SessionSnapshot {
        let char_statuses = self.validator.char_states
            .iter()
            .map(|s| s.status)
            .collect();

        SessionSnapshot {
            id: self.id.to_string(),
            lesson_id: self.lesson_id.clone(),
            target_text: self.target_text.clone(),
            cursor_position: self.validator.current_cursor,
            char_statuses,
            metrics: self.current_metrics(),
            is_completed: self.is_completed,
            wpm_graph: self.wpm_graph.clone(),
        }
    }
}
