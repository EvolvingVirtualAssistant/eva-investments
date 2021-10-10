#!/usr/bin/env bash

# copies resources from eva-investments folder present in agent to resources folder in server
cp -r /home/eva/.secrets/eva-investments/resources server/resources

# build docker image
DOCKER_BUILDKIT=1 docker build -t eva-investments-server-debian --target continuous-integration server/

# removes resources folder since they are no longer needed
rm -rf server/resources
