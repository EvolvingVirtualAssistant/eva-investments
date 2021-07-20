#!/usr/bin/env bash

docker build --build-arg DEFAULT_BUILD_MODE=continuous-integration -t eva-investments-server-debian --target continuous-integration server/
