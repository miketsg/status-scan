#!/bin/bash

# Ensure the script exits on error
set -e

# Define MongoDB container and image details
MONGODB_CONTAINER_NAME="status-scan-mongo"
# Optimized lightweight MongoDB image
MONGODB_IMAGE="mongo:6.0-alpine"

# Define HTTP server process variable
HTTP_SERVER_PID=""

# Function to clean up on exit
cleanup() {
    echo "Stopping HTTP server..."
    kill $HTTP_SERVER_PID 2>/dev/null || true

    echo "Stopping and removing MongoDB container..."
    docker stop $MONGODB_CONTAINER_NAME >/dev/null 2>&1 || true
    docker rm $MONGODB_CONTAINER_NAME >/dev/null 2>&1 || true

    echo "Cleanup completed."
}

# Set trap to ensure cleanup runs on script exit (including Ctrl+C)
trap cleanup EXIT INT TERM

# Ensure MongoDB image is available
if [[ "$(docker images -q $MONGODB_IMAGE 2>/dev/null)" == "" ]]; then
    echo "MongoDB image ($MONGODB_IMAGE) not found locally. Pulling from Docker Hub..."
    docker pull $MONGODB_IMAGE
fi

# Check if MongoDB container exists
if [ "$(docker ps -aq -f name=$MONGODB_CONTAINER_NAME)" ]; then
    if [ "$(docker ps -q -f name=$MONGODB_CONTAINER_NAME)" ]; then
        echo "MongoDB container is already running."
    else
        echo "Starting existing MongoDB container..."
        docker start $MONGODB_CONTAINER_NAME
    fi
else
    echo "Starting new MongoDB container..."
    docker run --name $MONGODB_CONTAINER_NAME -d -p 27017:27017 $MONGODB_IMAGE
fi

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Serve the basic HTML page
echo "Starting HTTP server..."
npx http-server src/assets -p 8080 &
HTTP_SERVER_PID=$!  # Capture the process ID of the HTTP server

# Start the development server
echo "Starting status-scan in development mode..."
npm run dev
