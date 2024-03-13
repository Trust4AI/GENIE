MODEL_NAME=$1
MODELFILE_PATH=$2

ollama serve & sleep 5

if [ -z $MODELFILE_PATH ]; then
    ollama pull $MODEL_NAME
else
    ollama create $MODEL_NAME -f "./"$MODELFILE_PATH
fi

ollama run $MODEL_NAME