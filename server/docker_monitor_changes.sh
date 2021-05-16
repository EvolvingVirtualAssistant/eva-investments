#!/bin/sh

# Place this in the begining of the dockerfile
# COPY ./monitor_changes.sh /docker-entrypoint.sh
# RUN chmod 755 docker-entrypoint.sh \
#     && apt-get -qq update \
#     && apt-get -qq install --no-install-recommends inotify.tools
# RUN /docker-entrypoint.sh

touch logs.txt
inotifywait -m -r -e create --format '%w%f' "." | while read dir action file; do
    echo "The file '$file' appeared in directory '$dir' via '$action'"
done >>logs.txt &

# Dockerfile commands down here
