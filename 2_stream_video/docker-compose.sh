#!/bin/bash

if [ $# -eq 0 ]; then
    echo "사용방법: $0 build|up|down"
    exit 1
fi

COMMAND=$1

DOCKER_BUILDKIT=1 NPM_BUILD_ENV=dev docker compose -f ./docker-compose.yaml -p seadronix $COMMAND
