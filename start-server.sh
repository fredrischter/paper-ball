#!/bin/bash

# Simple script to start HTTP server for any game

if [ -z "$1" ]; then
    echo "Usage: ./start-server.sh [game-folder]"
    echo ""
    echo "Available games:"
    echo "  . (root)           - Main game"
    echo "  game-poc           - Original top-down game"
    echo "  side-scroller      - Platformer with collectables"
    echo "  admin-game         - Element management"
    echo "  tower-defense      - Tower defense strategy"
    echo "  physics-adventure  - Momentum platformer"
    echo "  rpg                - Story-driven RPG"
    echo ""
    echo "Example: ./start-server.sh game-poc"
    exit 1
fi

GAME_DIR="$1"

if [ "$GAME_DIR" = "." ] || [ "$GAME_DIR" = "root" ]; then
    GAME_DIR="."
fi

if [ ! -d "$GAME_DIR" ]; then
    echo "Error: Directory '$GAME_DIR' not found"
    exit 1
fi

if [ ! -f "$GAME_DIR/index.html" ]; then
    echo "Error: No index.html found in '$GAME_DIR'"
    exit 1
fi

PORT=8080

echo "Starting HTTP server for $GAME_DIR on port $PORT..."
echo "Open your browser to: http://localhost:$PORT"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

cd "$GAME_DIR"

# Try different server options
if command -v python3 &> /dev/null; then
    python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    python -m http.server $PORT
elif command -v npx &> /dev/null; then
    npx serve -l $PORT
else
    echo "Error: No HTTP server available"
    echo "Please install Python or Node.js"
    exit 1
fi
