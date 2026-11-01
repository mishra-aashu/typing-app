use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// Detailed typing performance metrics calculated with precision.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TypingMetrics {
    /// Gross Words Per Minute: (Total Keystrokes / 5) / (Time in minutes)
    pub gross_wpm: f64,
    /// Net Words Per Minute: Gross WPM - (Uncorrected Errors / Time in minutes)
    pub net_wpm: f64,
    /// Raw character accuracy percentage (0.0 to 100.0)
    pub accuracy: f64,
    /// Total keystrokes entered (including backspaces and errors)
    pub total_keystrokes: usize,
    /// Correct keystrokes matching target text
    pub correct_keystrokes: usize,
    /// Incorrect keystrokes typed
    pub error_count: usize,
    /// Number of backspace corrections pressed
    pub backspaces_used: usize,
    /// Elapsed active time in seconds
    pub elapsed_seconds: f64,
    /// Consistency percentage score based on cadence variance
    pub consistency: f64,
    /// Map of key -> number of times mistyped (for heatmap)
    pub weak_keys: HashMap<char, usize>,
}

impl Default for TypingMetrics {
    fn default() -> Self {
        Self {
            gross_wpm: 0.0,
            net_wpm: 0.0,
            accuracy: 100.0,
            total_keystrokes: 0,
            correct_keystrokes: 0,
            error_count: 0,
            backspaces_used: 0,
            elapsed_seconds: 0.0,
            consistency: 100.0,
            weak_keys: HashMap::new(),
        }
    }
}

/// Calculate current WPM and accuracy given raw counters and time.
pub fn calculate_metrics(
    correct_chars: usize,
    total_keystrokes: usize,
    error_count: usize,
    backspaces_used: usize,
    elapsed_seconds: f64,
    weak_keys: HashMap<char, usize>,
    keystroke_intervals_ms: &[u64],
) -> TypingMetrics {
    let safe_elapsed = if elapsed_seconds <= 0.1 { 0.1 } else { elapsed_seconds };
    let minutes = safe_elapsed / 60.0;

    // Standard metric: 1 word = 5 keystrokes
    let gross_wpm = ((total_keystrokes as f64) / 5.0) / minutes;
    
    // Net WPM deducts errors
    let net_wpm_raw = ((correct_chars as f64) / 5.0) / minutes;
    let net_wpm = if net_wpm_raw < 0.0 { 0.0 } else { net_wpm_raw };

    let accuracy = if total_keystrokes == 0 {
        100.0
    } else {
        ((correct_chars as f64) / (total_keystrokes as f64) * 100.0).clamp(0.0, 100.0)
    };

    // Calculate typing cadence consistency (coefficient of variation of inter-keystroke intervals)
    let consistency = calculate_consistency(keystroke_intervals_ms);

    TypingMetrics {
        gross_wpm: (gross_wpm * 10.0).round() / 10.0,
        net_wpm: (net_wpm * 10.0).round() / 10.0,
        accuracy: (accuracy * 10.0).round() / 10.0,
        total_keystrokes,
        correct_keystrokes: correct_chars,
        error_count,
        backspaces_used,
        elapsed_seconds: (elapsed_seconds * 10.0).round() / 10.0,
        consistency: (consistency * 10.0).round() / 10.0,
        weak_keys,
    }
}

/// Calculates keystroke timing consistency as a percentage (100% = perfectly rhythmic)
fn calculate_consistency(intervals_ms: &[u64]) -> f64 {
    if intervals_ms.len() < 3 {
        return 100.0;
    }

    let n = intervals_ms.len() as f64;
    let mean = intervals_ms.iter().sum::<u64>() as f64 / n;

    if mean == 0.0 {
        return 100.0;
    }

    let variance = intervals_ms
        .iter()
        .map(|&val| {
            let diff = val as f64 - mean;
            diff * diff
        })
        .sum::<f64>()
        / n;

    let std_dev = variance.sqrt();
    let cov = std_dev / mean; // Coefficient of variation

    // Map Cov to 0-100 scale: Cov of 0.2 is very consistent (~90%), Cov > 1.0 is inconsistent
    let consistency = (1.0 - (cov * 0.5)).clamp(0.1, 1.0) * 100.0;
    consistency
}
