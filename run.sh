#!/usr/bin/env bash
# TypeForge Launcher Script

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "=============================================="
echo "⚡ TypeForge: High-Velocity Rust Typing Tutor"
echo "=============================================="

# Check if target debug or release binary exists
if [ -f "./target/release/typeforge" ]; then
    echo "🚀 Starting TypeForge (Release Build)..."
    ./target/release/typeforge
elif [ -f "./target/debug/typeforge" ]; then
    echo "🚀 Starting TypeForge (Debug Build)..."
    ./target/debug/typeforge
else
    echo "🛠 Building TypeForge with Cargo..."
    cargo build --release
    echo "🚀 Launching TypeForge..."
    ./target/release/typeforge
fi
