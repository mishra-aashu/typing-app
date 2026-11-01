mod api;
mod engine;
mod lessons;
mod stats;

use api::{create_router, AppState};
use stats::StatsStorage;
use std::collections::HashMap;
use std::net::SocketAddr;
use std::sync::{Arc, Mutex};

#[tokio::main]
async fn main() {
    println!(r#"
  ████████╗██╗   ██╗██████╗ ███████╗███████╗ ██████╗ ██████╗  ██████╗ ███████╗
  ╚══██╔══╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔════╝ ██╔════╝
     ██║    ╚████╔╝ ██████╔╝█████╗  █████╗  ██║   ██║██████╔╝██║  ███╗█████╗  
     ██║     ╚██╔╝  ██╔═══╝ ██╔══╝  ██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══╝  
     ██║      ██║   ██║     ███████╗██║     ╚██████╔╝██║  ██║╚██████╔╝███████╗
     ╚═╝      ╚═╝   ╚═╝     ╚══════╝╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝
                     -- Ultra-Fast Cross-Platform Typing Tutor --
    "#);

    let stats_storage = StatsStorage::new();
    let initial_stats = stats_storage.get_stats();

    println!("⚡ Engine: Rust Native (sub-millisecond cadence calculation)");
    println!("📊 Total sessions on record: {}", initial_stats.total_sessions_completed);
    println!("🏆 Highest WPM on record: {:.1} WPM", initial_stats.highest_wpm);

    let state = AppState {
        sessions: Arc::new(Mutex::new(HashMap::new())),
        stats: stats_storage,
    };

    let app = create_router(state);

    let port: u16 = std::env::var("PORT")
        .ok()
        .and_then(|p| p.parse().ok())
        .unwrap_or(3000);

    let addr = SocketAddr::from(([127, 0, 0, 1], port));
    println!("🚀 TypeForge server running at: http://localhost:{}", port);
    println!("🌐 Opening in your desktop browser...");

    // Try auto-opening the application URL
    tokio::spawn(async move {
        tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;
        let _ = open::that(format!("http://localhost:{}", port));
    });

    let listener = match tokio::net::TcpListener::bind(addr).await {
        Ok(l) => l,
        Err(e) => {
            eprintln!("Failed to bind on port {}: {}. Trying port 3030...", port, e);
            let fallback_addr = SocketAddr::from(([127, 0, 0, 1], 3030));
            tokio::net::TcpListener::bind(fallback_addr).await.expect("Failed to bind fallback port 3030")
        }
    };

    axum::serve(listener, app).await.unwrap();
}
