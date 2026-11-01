use crate::engine::{SessionSnapshot, TypingSession};
use crate::lessons::{find_lesson_by_id, generate_random_words_lesson, generate_weak_keys_drill, get_all_lessons, LessonItem};
use crate::stats::{StatsStorage, TestResultRecord, UserStats};
use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::{IntoResponse, Json},
    routing::{get, post},
    Router,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use tower_http::cors::CorsLayer;
use tower_http::services::ServeDir;

#[derive(Clone)]
pub struct AppState {
    pub sessions: Arc<Mutex<HashMap<String, TypingSession>>>,
    pub stats: StatsStorage,
}

pub fn create_router(state: AppState) -> Router {
    let api_routes = Router::new()
        .route("/health", get(health_check))
        .route("/lessons", get(get_lessons))
        .route("/lesson/:id", get(get_lesson_by_id))
        .route("/session/start", post(start_session))
        .route("/session/keystroke", post(process_keystroke))
        .route("/session/finish", post(finish_session))
        .route("/stats", get(get_user_stats))
        .route("/stats/reset", post(reset_user_stats))
        .route("/dynamic-lesson", get(get_dynamic_lesson));

    Router::new()
        .nest("/api", api_routes)
        .nest_service("/", ServeDir::new("static").fallback(ServeDir::new("static/index.html")))
        .layer(CorsLayer::permissive())
        .with_state(state)
}

async fn health_check() -> impl IntoResponse {
    Json(serde_json::json!({
        "status": "ok",
        "app": "TypeForge",
        "version": "0.1.0",
        "engine": "Rust (Native High-Precision)"
    }))
}

#[derive(Serialize)]
struct LessonsResponse {
    beginner: Vec<LessonItem>,
    medium: Vec<LessonItem>,
    expert: Vec<LessonItem>,
    total_count: usize,
}

async fn get_lessons() -> impl IntoResponse {
    let all = get_all_lessons();
    let beginner = all.iter().filter(|l| l.difficulty == "beginner").cloned().collect::<Vec<_>>();
    let medium = all.iter().filter(|l| l.difficulty == "medium").cloned().collect::<Vec<_>>();
    let expert = all.iter().filter(|l| l.difficulty == "expert").cloned().collect::<Vec<_>>();

    Json(LessonsResponse {
        total_count: all.len(),
        beginner,
        medium,
        expert,
    })
}

async fn get_lesson_by_id(Path(id): Path<String>) -> Result<Json<LessonItem>, StatusCode> {
    match find_lesson_by_id(&id) {
        Some(lesson) => Ok(Json(lesson)),
        None => Err(StatusCode::NOT_FOUND),
    }
}

#[derive(Deserialize)]
struct StartSessionRequest {
    pub lesson_id: Option<String>,
    pub custom_text: Option<String>,
}

async fn start_session(
    State(state): State<AppState>,
    Json(payload): Json<StartSessionRequest>,
) -> Result<Json<SessionSnapshot>, StatusCode> {
    let (lesson_id, target_text) = if let Some(custom) = payload.custom_text {
        ("custom".to_string(), custom)
    } else if let Some(lid) = payload.lesson_id {
        match find_lesson_by_id(&lid) {
            Some(l) => (l.id, l.target_text),
            None => return Err(StatusCode::NOT_FOUND),
        }
    } else {
        let default_lesson = &get_all_lessons()[0];
        (default_lesson.id.clone(), default_lesson.target_text.clone())
    };

    let session = TypingSession::new(lesson_id, target_text);
    let snapshot = session.snapshot();
    let session_id = snapshot.id.clone();

    let mut lock = state.sessions.lock().unwrap();
    lock.insert(session_id, session);

    Ok(Json(snapshot))
}

#[derive(Deserialize)]
struct KeystrokeRequest {
    pub session_id: String,
    pub key: String,       // e.g. "a", "Backspace", " ", etc.
    pub is_backspace: bool,
}

#[derive(Serialize)]
struct KeystrokeResponse {
    pub is_correct: bool,
    pub snapshot: SessionSnapshot,
}

async fn process_keystroke(
    State(state): State<AppState>,
    Json(payload): Json<KeystrokeRequest>,
) -> Result<Json<KeystrokeResponse>, StatusCode> {
    let mut lock = state.sessions.lock().unwrap();
    let session = lock.get_mut(&payload.session_id).ok_or(StatusCode::NOT_FOUND)?;

    let is_correct = if payload.is_backspace {
        session.process_backspace();
        true
    } else if let Some(first_char) = payload.key.chars().next() {
        session.process_char(first_char)
    } else {
        false
    };

    let snapshot = session.snapshot();

    // If just completed, auto-record stats
    if snapshot.is_completed {
        let lesson_title = find_lesson_by_id(&session.lesson_id)
            .map(|l| l.title)
            .unwrap_or_else(|| "Practice Session".to_string());
        let difficulty = find_lesson_by_id(&session.lesson_id)
            .map(|l| l.difficulty)
            .unwrap_or_else(|| "medium".to_string());

        let record = TestResultRecord {
            id: session.id.to_string(),
            lesson_id: session.lesson_id.clone(),
            lesson_title,
            difficulty,
            wpm: snapshot.metrics.net_wpm,
            raw_wpm: snapshot.metrics.gross_wpm,
            accuracy: snapshot.metrics.accuracy,
            consistency: snapshot.metrics.consistency,
            elapsed_seconds: snapshot.metrics.elapsed_seconds,
            timestamp: chrono::Utc::now().to_rfc3339(),
        };

        state.stats.record_session(record, session.weak_keys.clone());
    }

    Ok(Json(KeystrokeResponse {
        is_correct,
        snapshot,
    }))
}

#[derive(Deserialize)]
struct FinishSessionRequest {
    pub session_id: String,
}

async fn finish_session(
    State(state): State<AppState>,
    Json(payload): Json<FinishSessionRequest>,
) -> Result<Json<SessionSnapshot>, StatusCode> {
    let mut lock = state.sessions.lock().unwrap();
    let session = lock.get_mut(&payload.session_id).ok_or(StatusCode::NOT_FOUND)?;

    session.finish();
    let snapshot = session.snapshot();

    let lesson_title = find_lesson_by_id(&session.lesson_id)
        .map(|l| l.title)
        .unwrap_or_else(|| "Practice Session".to_string());
    let difficulty = find_lesson_by_id(&session.lesson_id)
        .map(|l| l.difficulty)
        .unwrap_or_else(|| "medium".to_string());

    let record = TestResultRecord {
        id: session.id.to_string(),
        lesson_id: session.lesson_id.clone(),
        lesson_title,
        difficulty,
        wpm: snapshot.metrics.net_wpm,
        raw_wpm: snapshot.metrics.gross_wpm,
        accuracy: snapshot.metrics.accuracy,
        consistency: snapshot.metrics.consistency,
        elapsed_seconds: snapshot.metrics.elapsed_seconds,
        timestamp: chrono::Utc::now().to_rfc3339(),
    };

    state.stats.record_session(record, session.weak_keys.clone());

    Ok(Json(snapshot))
}

async fn get_user_stats(State(state): State<AppState>) -> Json<UserStats> {
    Json(state.stats.get_stats())
}

async fn reset_user_stats(State(state): State<AppState>) -> Json<UserStats> {
    Json(state.stats.reset_stats())
}

#[derive(Deserialize)]
struct DynamicLessonQuery {
    pub mode: Option<String>, // "words" or "weak_keys"
    pub count: Option<usize>,
}

async fn get_dynamic_lesson(
    State(state): State<AppState>,
    axum::extract::Query(query): axum::extract::Query<DynamicLessonQuery>,
) -> Json<LessonItem> {
    let mode = query.mode.as_deref().unwrap_or("words");

    if mode == "weak_keys" {
        let stats = state.stats.get_stats();
        let mut sorted_keys: Vec<(char, usize)> = stats.key_error_heatmap.into_iter().collect();
        sorted_keys.sort_by(|a, b| b.1.cmp(&a.1));
        let top_weak: Vec<char> = sorted_keys.into_iter().take(5).map(|(c, _)| c).collect();

        if top_weak.is_empty() {
            Json(generate_random_words_lesson(query.count.unwrap_or(25)))
        } else {
            Json(generate_weak_keys_drill(&top_weak))
        }
    } else {
        let count = query.count.unwrap_or(25);
        Json(generate_random_words_lesson(count))
    }
}
