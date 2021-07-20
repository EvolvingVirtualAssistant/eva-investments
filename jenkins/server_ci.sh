#!/usr/bin/env bash

DOCKER_BUILDKIT=1 docker build -t eva-investments-server-debian --target continuous-integration server/
