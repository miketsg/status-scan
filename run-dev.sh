#!/bin/bash

# Ensure the script exits on error
set -e

# Define MongoDB container name
CONTAINER_NAME="status-scan-mongo"

# Function to clean up on exit
cleanup() {
    echo "Stopping http-server..."
    kill $HTTP_SERVER_PID 2>/dev/null || true

    echo "Stopping and removing MongoDB container..."
    docker stop $CONTAINER_NAME >/dev/null 2>&1 || true
    docker rm $CONTAINER_NAME >/dev/null 2>&1 || true

    echo "Cleanup completed."
}

# Set trap to ensure cleanup runs on script exit (including Ctrl+C)
trap cleanup EXIT INT TERM

# Check if MongoDB container exists
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
        echo "MongoDB container is already running."
    else
        echo "Starting existing MongoDB container..."
        docker start $CONTAINER_NAME
    fi
else
    echo "Starting new MongoDB container..."
    docker run --name $CONTAINER_NAME -d -p 27017:27017 mongo
fi

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Serve the basic HTML page
echo "Serving basic HTML page..."
npx http-server src/assets -p 8080 &
HTTP_SERVER_PID=$!  # Capture the process ID of http-server

# Start the development server
echo "Starting status-scan in development mode..."
npm run dev
