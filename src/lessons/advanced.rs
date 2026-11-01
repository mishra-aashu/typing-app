use super::beginner::LessonItem;

pub fn get_advanced_lessons() -> Vec<LessonItem> {
    vec![
        // ==========================================
        // Phase 1: Symbol Keys Mastery (1-4)
        // ==========================================
        LessonItem {
            id: "adv-01-brackets-braces".to_string(),
            title: "Brackets, Braces & Parentheses".to_string(),
            description: "Master matching delimiters [ ], { }, and ( ) with immediate finger recoil.".to_string(),
            difficulty: "advanced".to_string(),
            category: "Phase 1 · Symbol Keys".to_string(),
            target_text: "{ [ ( item ) ] } [ { key: value } ] ( a + b ) * [ c - d ] { users[0].id } ( fn() )".to_string(),
            min_target_wpm: 50.0,
            min_accuracy: 96.0,
        },
        LessonItem {
            id: "adv-02-operators".to_string(),
            title: "Arithmetic & Logic Operators".to_string(),
            description: "Rapidly type conditional and mathematical operators without breaking rhythm.".to_string(),
            difficulty: "advanced".to_string(),
            category: "Phase 1 · Symbol Keys".to_string(),
            target_text: "a == b && c != d || x <= y && z >= 0; count += 1; total = (subtotal * 1.08) - discount;".to_string(),
            min_target_wpm: 52.0,
            min_accuracy: 96.0,
        },
        LessonItem {
            id: "adv-03-special-chars".to_string(),
            title: "Pointers, Hashes, Percents & Backticks".to_string(),
            description: "Train rare shifted keys: @, #, $, %, ^, &, *, ~, and backtick (`).".to_string(),
            difficulty: "advanced".to_string(),
            category: "Phase 1 · Symbol Keys".to_string(),
            target_text: "const url = `${baseUrl}/api/v1/users?limit=50&active=true#section`; $price = 99.95; 100%".to_string(),
            min_target_wpm: 50.0,
            min_accuracy: 95.0,
        },
        LessonItem {
            id: "adv-04-symbols-blitz".to_string(),
            title: "Symbol Blitz Gauntlet".to_string(),
            description: "High-density symbol sequences designed to build unbreakable spatial awareness.".to_string(),
            difficulty: "advanced".to_string(),
            category: "Phase 1 · Symbol Keys".to_string(),
            target_text: "{ [ ( < & | ^ ! ~ + - * / % = == === != !== <= >= && || -> => :: . , ; : ? ) ] }".to_string(),
            min_target_wpm: 45.0,
            min_accuracy: 96.0,
        },

        // ==========================================
        // Phase 2: Web & Systems Syntax (5-9)
        // ==========================================
        LessonItem {
            id: "adv-05-html-markup".to_string(),
            title: "HTML5 Semantic Elements".to_string(),
            description: "Angle brackets, closing slashes, and attribute quotes at web speed.".to_string(),
            difficulty: "advanced".to_string(),
            category: "Phase 2 · Code Syntax".to_string(),
            target_text: "<div class=\"hero-container\" id=\"app\"><h1 class=\"title\">Welcome</h1><button type=\"submit\" disabled>Send</button></div>".to_string(),
            min_target_wpm: 58.0,
            min_accuracy: 96.0,
        },
        LessonItem {
            id: "adv-06-css-properties".to_string(),
            title: "CSS Declarations & Flexbox".to_string(),
            description: "Colons, semicolons, hyphens, and curly brackets common in styling stylesheets.".to_string(),
            difficulty: "advanced".to_string(),
            category: "Phase 2 · Code Syntax".to_string(),
            target_text: ".card { display: flex; align-items: center; justify-content: space-between; border-radius: 8px; margin: 0 auto; }".to_string(),
            min_target_wpm: 60.0,
            min_accuracy: 96.0,
        },
        LessonItem {
            id: "adv-07-json-payload".to_string(),
            title: "JSON Key-Value Structures".to_string(),
            description: "Nested objects, arrays, quoted keys, commas, and numeric literals in JSON payloads.".to_string(),
            difficulty: "advanced".to_string(),
            category: "Phase 2 · Code Syntax".to_string(),
            target_text: "{\"status\": \"success\", \"code\": 200, \"data\": {\"user_id\": 10842, \"roles\": [\"admin\", \"developer\"], \"active\": true}}".to_string(),
            min_target_wpm: 62.0,
            min_accuracy: 96.0,
        },
        LessonItem {
            id: "adv-08-bash-pipelines".to_string(),
            title: "Bash Pipelines & Flags".to_string(),
            description: "Pipes (|), redirects (>), flags (-rf, -la), and environment variables ($HOME).".to_string(),
            difficulty: "advanced".to_string(),
            category: "Phase 2 · Code Syntax".to_string(),
            target_text: "cat /var/log/syslog | grep -E \"error|fatal\" | awk '{print $1, $5}' | sort | uniq -c > output.txt".to_string(),
            min_target_wpm: 60.0,
            min_accuracy: 96.0,
        },
        LessonItem {
            id: "adv-09-git-workflow".to_string(),
            title: "Git CLI & Commit Convention".to_string(),
            description: "Common git commands, branches, commit message conventions, and merge flags.".to_string(),
            difficulty: "advanced".to_string(),
            category: "Phase 2 · Code Syntax".to_string(),
            target_text: "git checkout -b feat/user-auth && git commit -m \"feat(auth): implement jwt token rotation\" && git push origin HEAD".to_string(),
            min_target_wpm: 65.0,
            min_accuracy: 97.0,
        },

        // ==========================================
        // Phase 3: Consistency & Speed Drills (10-14)
        // ==========================================
        LessonItem {
            id: "adv-10-common-bigrams".to_string(),
            title: "High-Frequency English Bigrams".to_string(),
            description: "Train the top letter pairs that account for over 50% of typed English words.".to_string(),
            difficulty: "advanced".to_string(),
            category: "Phase 3 · Speed Conditioning".to_string(),
            target_text: "th he in er an re on at en nd ti es or te of ed is it al ar st to nt nd ou ea le sa si ar".to_string(),
            min_target_wpm: 65.0,
            min_accuracy: 97.0,
        },
        LessonItem {
            id: "adv-11-common-trigrams".to_string(),
            title: "High-Frequency Trigrams & Suffixes".to_string(),
            description: "Internalize 3-letter combinations for effortless burst typing.".to_string(),
            difficulty: "advanced".to_string(),
            category: "Phase 3 · Speed Conditioning".to_string(),
            target_text: "the and ing ion tio ent for her his nth int eth for are but not you all any can had her was".to_string(),
            min_target_wpm: 70.0,
            min_accuracy: 97.0,
        },
        LessonItem {
            id: "adv-12-pinky-conditioning".to_string(),
            title: "Pinky & Ring Finger Conditioning".to_string(),
            description: "Overcome finger fatigue on lateral keys Q, A, Z, P, and semicolon (;).".to_string(),
            difficulty: "advanced".to_string(),
            category: "Phase 3 · Speed Conditioning".to_string(),
            target_text: "plaza opaque quick zipper quartz policy puzzle quote qualify equip apply lazy zero panic splash".to_string(),
            min_target_wpm: 65.0,
            min_accuracy: 96.0,
        },
        LessonItem {
            id: "adv-13-80-wpm-endurance".to_string(),
            title: "80 WPM Endurance Sprint".to_string(),
            description: "Sustained high-velocity prose designed to push your threshold past 80 words per minute.".to_string(),
            difficulty: "advanced".to_string(),
            category: "Phase 3 · Speed Conditioning".to_string(),
            target_text: "Speed without precision is meaningless, but true mastery marries velocity with effortless accuracy. Every touch typist who crosses eighty words per minute discovers a state of complete flow where fingers move ahead of conscious thought.".to_string(),
            min_target_wpm: 80.0,
            min_accuracy: 97.5,
        },
        LessonItem {
            id: "adv-14-advanced-boss-test".to_string(),
            title: "Advanced Milestone Boss Test".to_string(),
            description: "Surpass 85 WPM with 97.5% accuracy across prose and syntax to unlock Expert!",to_string(),
            difficulty: "advanced".to_string(),
            category: "Phase 3 · Speed Conditioning".to_string(),
            target_text: "Through rigorous repetition and deliberate focus, muscle memory completely replaces conscious hesitation. At eighty-five words per minute, your fingers act as an instantaneous physical bridge between imagination and executable software.".to_string(),
            min_target_wpm: 85.0,
            min_accuracy: 97.5,
        },
    ]
}
