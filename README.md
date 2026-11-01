# ⚡ TypeForge — High-Velocity Rust Typing Tutor

> **A blazing-fast, cross-platform typing tutor built in native Rust** with sub-millisecond keystroke cadence analysis, real mechanical switch sound synthesis, interactive QWERTY visualizer, and curriculums for **Beginners**, **Medium**, and **Expert Programmers**.

---

## 🌟 Key Features

- **🦀 Rust Native Engine**:
  - Sub-millisecond keystroke latency processing.
  - Precision metrics: Gross WPM, Net WPM, Accuracy %, Consistency score (cadence variance), and weak-key error heatmaps.
  - Asynchronous HTTP/WebSocket API built on `Tokio` and `Axum`.
  - Local JSON persistent storage for lifetime statistics, streaks, and achievement unlocks.

- **🎯 3 Difficulty Tiers + Adaptive Drills**:
  - **🟢 Beginner**: Home row anchors (`F & J`), full home row (`ASDF JKL;`), index reaches (`G & H`), top row vowels, bottom row, and top 50 high-frequency words.
  - **🟡 Medium**: Natural punctuation flow, capitalization, top number row drills, dialogue quotes, and 60-second speed bursts.
  - **🔴 Expert Code**: Real-world programming syntax for **Rust** (`match`, `Result`, lifetimes), **TypeScript** (async, generics, arrow functions), **Python** (comprehensions, decorators), **SQL** (window functions, partitions), and intense Symbol Blitz drills (`{ [ ( < > $ & | ! # % * = ; : " ' ` ) ] }`).
  - **⚡ Dynamic Practice**: Customizable randomized word generator (25, 50, 100 words).
  - **🎯 Weak Keys AI**: Automatically inspects your mistyped keys and synthesizes targeted drills to cure bad habits.
  - **📝 Custom Drills**: Paste any code or literature snippet directly into the app to practice.

- **🔊 Synthesized Mechanical Switch Audio (Web Audio API)**:
  - **Cherry MX Blue**: Crisp high-pitch click with metallic bottom-out.
  - **Cherry MX Brown**: Smooth tactile bump with rounded thud.
  - **Cherry MX Red**: Linear low-frequency thock.
  - Error buzz feedback & harmonic Victory Chime upon finishing lessons.
  - 100% synthesized in real time — zero external audio files, zero latency, works anywhere offline.

- **⌨️ Interactive Mechanical Keyboard Visualizer**:
  - Full 3D beveled keycaps with realistic mechanical depress animations.
  - Color-coded finger zones (Pinky, Ring, Middle, Index, Thumbs) so beginners know which finger to use without looking down.
  - Glowing next-key target guide.
  - Dynamic error heatmap overlay showing keys where you stumble.

- **📊 Visual Velocity Chart & Achievements**:
  - Real-time HTML5 Canvas Speed vs Time line graph with Net WPM curve, Raw WPM dashed curve, and error marker dots.
  - 7 unlockable achievements: *First Keystrokes*, *Rapid Flow (40 WPM)*, *Velocity Master (60 WPM)*, *Century Club (100 WPM)*, *Laser Precision (100%)*, *Silicon Scribe (Expert Code)*, *Metronome Rhythm (>95% consistency)*.
  - Lifetime statistics: Personal best, average speed, rolling accuracy, total time typing, and daily streaks.

- **🎨 5 Ultra-Polished Themes**:
  - 🌌 **Moonlight Violet** (Sleek deep cyber-dark)
  - ⚡ **Cyberpunk Neon** (Vibrant hot pink & cyan glow)
  - 🌸 **Tokyo Night** (Classic code editor indigo & lavender)
  - 🟢 **Emerald Matrix** (Terminal green matrix vibe)
  - 🟠 **Retro Amber** (Warm vintage CRT phosphor look)

---

## 🚀 Quick Start

### 1. Run with Launcher Script
```bash
./run.sh
```

### 2. Or Run with Cargo directly
```bash
cargo run
```
The app will automatically compile and open in your browser at `http://localhost:3000`.

---

## 📁 Project Architecture

```
typing app/
├── Cargo.toml               # Cargo package configuration
├── .cargo/config.toml       # Fast sparse registry configuration
├── run.sh                   # Executable launch script
├── src/
│   ├── main.rs              # Rust binary entry point, banner, and server bootstrap
│   ├── api/
│   │   └── mod.rs           # Axum REST API endpoints & static file serving
│   ├── engine/
│   │   ├── mod.rs           # Engine module exports
│   │   ├── metrics.rs       # High-precision Gross/Net WPM, accuracy, consistency math
│   │   ├── session.rs       # Active typing session state machine
│   │   └── validator.rs     # Keystroke-level char states and backspace handler
│   ├── lessons/
│   │   ├── mod.rs           # Curriculum registry
│   │   ├── beginner.rs      # Home row, finger reaches, top 50 words
│   │   ├── medium.rs        # Punctuation, numbers, quotes, prose
│   │   ├── expert.rs        # Rust, TypeScript, Python, SQL, Symbols Blitz
│   │   └── generator.rs     # Dynamic word pools and weak-keys AI drill generator
│   └── stats/
│       ├── mod.rs           # Stats module exports
│       └── storage.rs       # Persistent JSON store for records, heatmaps, badges
├── static/
│   ├── index.html           # Main SPA layout with HUD and Modals
│   ├── css/
│   │   ├── variables.css    # Design tokens, color palettes for 5 themes
│   │   ├── main.css         # Typography, glassmorphism, responsive styles
│   │   ├── keyboard.css     # 3D mechanical keyboard visualizer styling
│   │   └── components.css   # Modals, charts, achievements, and toast styles
│   └── js/
│       ├── audio.js         # Web Audio API Cherry MX mechanical switch synthesizer
│       ├── keyboard.js      # Interactive keyboard visualizer controller
│       ├── lessons.js       # Curriculum state and custom text manager
│       ├── stats.js         # Canvas velocity chart and lifetime stats renderer
│       ├── engine.js        # Zero-latency keystroke capture and caret animator
│       └── app.js           # Master app lifecycle and keyboard shortcuts
└── data/
    └── user_stats.json      # Automatically created local persistence store
```

---

## ⌨️ Global Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` | Quick restart current test |
| `Esc` | Close any active modal or restart |
| `Click on Stage` | Instantly focus typing input |

---

## 🖥️ Cross-Platform Compilation

### Build for Linux:
```bash
cargo build --release --target x86_64-unknown-linux-gnu
```

### Build for Windows:
```bash
# Using MinGW or cross
cargo build --release --target x86_64-pc-windows-gnu
```
Outputs `target/x86_64-pc-windows-gnu/release/typeforge.exe`.

### Build for macOS:
```bash
# Intel Mac
cargo build --release --target x86_64-apple-darwin

# Apple Silicon (M1/M2/M3/M4)
cargo build --release --target aarch64-apple-darwin
```

---

## 🏆 Packaging as Desktop Executable (Tauri v2)

If you wish to bundle TypeForge into a single native desktop installer (`.msi`/`.exe` on Windows, `.dmg` on Mac, `.AppImage`/`.deb` on Linux), you can wrap the current `src/` and `static/` directory using Tauri v2:

```bash
cargo install tauri-cli
cargo tauri build
```
TypeForge's architecture uses zero heavy runtime dependencies, creating a tiny ~8MB desktop app that runs at native hardware speeds!
