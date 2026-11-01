use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum CharStatus {
    Pending,
    Correct,
    Incorrect,
    Extra,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CharacterState {
    pub expected: char,
    pub typed: Option<char>,
    pub status: CharStatus,
    pub timestamp_ms: Option<u64>,
}

#[derive(Debug, Clone)]
pub struct TextValidator {
    pub target_chars: Vec<char>,
    pub char_states: Vec<CharacterState>,
    pub current_cursor: usize,
}

impl TextValidator {
    pub fn new(target_text: &str) -> Self {
        let target_chars: Vec<char> = target_text.chars().collect();
        let char_states = target_chars
            .iter()
            .map(|&c| CharacterState {
                expected: c,
                typed: None,
                status: CharStatus::Pending,
                timestamp_ms: None,
            })
            .collect();

        Self {
            target_chars,
            char_states,
            current_cursor: 0,
        }
    }

    /// Process a newly typed character at the current position
    pub fn type_char(&mut self, typed: char, timestamp_ms: u64) -> (bool, Option<char>) {
        if self.current_cursor >= self.char_states.len() {
            // Buffer overflow - extra character
            return (false, None);
        }

        let expected = self.target_chars[self.current_cursor];
        let is_correct = typed == expected;

        self.char_states[self.current_cursor] = CharacterState {
            expected,
            typed: Some(typed),
            status: if is_correct {
                CharStatus::Correct
            } else {
                CharStatus::Incorrect
            },
            timestamp_ms: Some(timestamp_ms),
        };

        self.current_cursor += 1;
        (is_correct, if !is_correct { Some(expected) } else { None })
    }

    /// Process a backspace keystroke
    pub fn backspace(&mut self) -> bool {
        if self.current_cursor == 0 {
            return false;
        }

        self.current_cursor -= 1;
        let expected = self.target_chars[self.current_cursor];
        self.char_states[self.current_cursor] = CharacterState {
            expected,
            typed: None,
            status: CharStatus::Pending,
            timestamp_ms: None,
        };

        true
    }

    /// Check if user has completed typing all target characters
    pub fn is_completed(&self) -> bool {
        self.current_cursor >= self.char_states.len()
    }

    /// Count current correct characters
    pub fn correct_count(&self) -> usize {
        self.char_states
            .iter()
            .filter(|s| s.status == CharStatus::Correct)
            .count()
    }

    /// Count current incorrect characters
    pub fn incorrect_count(&self) -> usize {
        self.char_states
            .iter()
            .filter(|s| s.status == CharStatus::Incorrect)
            .count()
    }
}
