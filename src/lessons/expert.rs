use super::beginner::LessonItem;

pub fn get_expert_lessons() -> Vec<LessonItem> {
    vec![
        // ==========================================
        // Phase 1: Real Programming Idioms (1-6)
        // ==========================================
        LessonItem {
            id: "exp-01-rust-syntax".to_string(),
            title: "Rust: Pattern Matching & Enums".to_string(),
            description: "Practice typing idiomatic Rust structs, enums, match expressions, and curly braces.".to_string(),
            difficulty: "expert".to_string(),
            category: "Phase 1 · Real Code".to_string(),
            target_text: "pub fn parse_packet(buf: &[u8]) -> Result<Header, ParseError> { match buf.get(0..4) { Some(magic) if magic == [0x7F, b'E', b'L', b'F'] => Ok(Header::Elf), _ => Err(ParseError::InvalidMagic), } }".to_string(),
            min_target_wpm: 65.0,
            min_accuracy: 97.0,
        },
        LessonItem {
            id: "exp-02-typescript-async".to_string(),
            title: "TypeScript: Generics & Async Streams".to_string(),
            description: "Generics, promises, arrow functions, destructuring, and template literals.".to_string(),
            difficulty: "expert".to_string(),
            category: "Phase 1 · Real Code".to_string(),
            target_text: "export const fetchMetrics = async <T>(endpoint: string, opts?: RequestInit): Promise<ApiResponse<T>> => { const res = await fetch(`${API_BASE}/${endpoint}`, { ...opts, headers: { 'Content-Type': 'application/json' } }); return res.json(); };".to_string(),
            min_target_wpm: 68.0,
            min_accuracy: 97.0,
        },
        LessonItem {
            id: "exp-03-python-comprehensions".to_string(),
            title: "Python 3.12: Generators & Comprehensions".to_string(),
            description: "Nested brackets, colons, lambdas, and list comprehensions in Python.".to_string(),
            difficulty: "expert".to_string(),
            category: "Phase 1 · Real Code".to_string(),
            target_text: "matrix = [[(x ** 2) + y for x in range(10) if x % 2 == 0] for y in row_offsets if y > 0]".to_string(),
            min_target_wpm: 68.0,
            min_accuracy: 97.0,
        },
        LessonItem {
            id: "exp-04-sql-analytics".to_string(),
            title: "SQL: Window Functions & Aggregations".to_string(),
            description: "Capitalized SQL keywords, subqueries, and window partition statements.".to_string(),
            difficulty: "expert".to_string(),
            category: "Phase 1 · Real Code".to_string(),
            target_text: "SELECT user_id, AVG(wpm) OVER (PARTITION BY user_id ORDER BY completed_at ROWS BETWEEN 9 PRECEDING AND CURRENT ROW) AS rolling_wpm FROM typing_sessions WHERE accuracy >= 95.0 GROUP BY user_id, completed_at, wpm;".to_string(),
            min_target_wpm: 68.0,
            min_accuracy: 97.0,
        },
        LessonItem {
            id: "exp-05-cpp-pointers".to_string(),
            title: "C++20: Smart Pointers & References".to_string(),
            description: "Pointers, dereferencing, templates, lambdas, and namespaces in modern C++.".to_string(),
            difficulty: "expert".to_string(),
            category: "Phase 1 · Real Code".to_string(),
            target_text: "std::unique_ptr<Node> root = std::make_unique<Node>(value, std::move(left), std::move(right)); auto&& result = root->evaluate();".to_string(),
            min_target_wpm: 65.0,
            min_accuracy: 97.0,
        },
        LessonItem {
            id: "exp-06-go-concurrency".to_string(),
            title: "Go: Goroutines & Channel Select".to_string(),
            description: "Channels (<-), select statements, struct tags, and error handling patterns in Go.".to_string(),
            difficulty: "expert".to_string(),
            category: "Phase 1 · Real Code".to_string(),
            target_text: "select { case msg := <-ch: process(msg) case <-time.After(5 * time.Second): return fmt.Errorf(\"timeout exceeded\") }".to_string(),
            min_target_wpm: 68.0,
            min_accuracy: 97.0,
        },

        // ==========================================
        // Phase 2: High-Velocity Challenges (7-10)
        // ==========================================
        LessonItem {
            id: "exp-07-speed-poem".to_string(),
            title: "High-Cadence Literary Velocity".to_string(),
            description: "Rapid literary meter training rapid rhythmic breathing and finger momentum.".to_string(),
            difficulty: "expert".to_string(),
            category: "Phase 2 · Velocity Drills".to_string(),
            target_text: "The architectural elegance of modern high-performance microprocessors derives from out-of-order instruction scheduling, speculative branch prediction, and multi-tiered cache hierarchies operating synchronously at gigahertz clock frequencies.".to_string(),
            min_target_wpm: 85.0,
            min_accuracy: 98.0,
        },
        LessonItem {
            id: "exp-08-regex-patterns".to_string(),
            title: "Regex Patterns & Backslashes".to_string(),
            description: "Complex regular expression syntax with character classes, escapes, and quantifiers.".to_string(),
            difficulty: "expert".to_string(),
            category: "Phase 2 · Velocity Drills".to_string(),
            target_text: r#"const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;"#.to_string(),
            min_target_wpm: 55.0,
            min_accuracy: 96.0,
        },
        LessonItem {
            id: "exp-09-cli-oneliner".to_string(),
            title: "DevOps Shell Pipeline One-Liner".to_string(),
            description: "Intense combination of curly braces, sed commands, and docker orchestration flags.".to_string(),
            difficulty: "expert".to_string(),
            category: "Phase 2 · Velocity Drills".to_string(),
            target_text: "docker run --rm -it -v $(pwd):/workspace -p 8080:8080 --name web-dev node:20-alpine sh -c \"npm install && npm run build\"".to_string(),
            min_target_wpm: 65.0,
            min_accuracy: 97.0,
        },
        LessonItem {
            id: "exp-10-config-manifests".to_string(),
            title: "TOML & YAML Infrastructure".to_string(),
            description: "Strict key indentation, booleans, arrays, and package definitions.".to_string(),
            difficulty: "expert".to_string(),
            category: "Phase 2 · Velocity Drills".to_string(),
            target_text: "[package]\nname = \"typeforge\"\nversion = \"0.2.0\"\nedition = \"2021\"\n[dependencies]\ntokio = { version = \"1.38\", features = [\"full\"] }".to_string(),
            min_target_wpm: 65.0,
            min_accuracy: 97.0,
        },

        // ==========================================
        // Phase 3: Expert Boss & Century Club (11-12)
        // ==========================================
        LessonItem {
            id: "exp-11-100-wpm-barrier".to_string(),
            title: "The 100 WPM Century Club Sprint".to_string(),
            description: "Join the top 1% of typists worldwide by maintaining triple-digit net velocity.".to_string(),
            difficulty: "expert".to_string(),
            category: "Phase 3 · Century Club".to_string(),
            target_text: "Breaking one hundred words per minute requires you to read entire words as single motor gestures rather than individual characters. Your hands anticipate the next sentence while your fingers effortlessly finish the current thought.".to_string(),
            min_target_wpm: 100.0,
            min_accuracy: 98.0,
        },
        LessonItem {
            id: "exp-12-expert-boss-test".to_string(),
            title: "Expert Milestone Boss Test".to_string(),
            description: "Full synthesis of advanced vocabulary, syntax, and speed at 100 WPM to unlock Legend tier!".to_string(),
            difficulty: "expert".to_string(),
            category: "Phase 3 · Century Club".to_string(),
            target_text: "True mastery in software engineering and touch typing share the same fundamental truth: real speed is never about rushing; it is the natural byproduct of complete relaxation, disciplined technique, and absolute precision.".to_string(),
            min_target_wpm: 100.0,
            min_accuracy: 98.0,
        },
    ]
}
