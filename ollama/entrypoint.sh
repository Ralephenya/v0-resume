#!/bin/sh
MODEL="${OLLAMA_MODEL:-qwen2.5:0.5b}"

# Start ollama server in background
/bin/ollama serve &
SERVER_PID=$!

# Wait for the server to be ready (up to 60s on cold start)
i=0
until curl -sf http://localhost:11434/api/tags > /dev/null 2>&1; do
  i=$((i+1))
  if [ "$i" -ge 60 ]; then
    echo "ERROR: Ollama server did not start in time"
    exit 1
  fi
  sleep 1
done
echo "Ollama server ready"

# Pull the model only if not already on the volume
if ollama list | grep -q "$MODEL"; then
  echo "Model $MODEL already present — skipping pull"
else
  echo "Pulling $MODEL ..."
  ollama pull "$MODEL"
  echo "Model $MODEL downloaded"
fi

wait "$SERVER_PID"
