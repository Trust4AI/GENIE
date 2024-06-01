#!/bin/bash
MODEL_NAME=$1
MODELFILE_PATH=$2

ollama serve & sleep 5

if [ -z "$MODELFILE_PATH" ]; then
    ollama pull $MODEL_NAME || { echo "Failed to pull model $MODEL_NAME"; exit 1; }
else
    ollama create $MODEL_NAME -f "./$MODELFILE_PATH" || { echo "Failed to create model $MODEL_NAME with file $MODELFILE_PATH"; exit 1; }
fi

ollama run $MODEL_NAME || { echo "Failed to run model $MODEL_NAME"; exit 1; }
