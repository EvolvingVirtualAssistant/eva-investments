FROM hayd/alpine-deno:1.9.2

# Listening port used by the application (This will likely change to be more dynamic for kubernetes)
EXPOSE 1993

WORKDIR /server

# Running as deno instead of root
USER deno

# Cache dependencies 
# (docker will create a checksum for this file at the moment of creation of this image. The next time docker 
# is required to build this image, it will check its cache for an existing image, and compare the checksum for that file on the previous image,
# with a checksum for the current version of the deps.ts file, if the checksums match it uses the old image, otherwise it creates a new image)
COPY deps.ts .
# This will download and cache all the dependencies listed inside the deps.ts file. Run deno cache -h for more details
RUN deno cache deps.ts

# After this point, if there is a change on any file on the working dir these steps will be re-run
ADD . .
# Compile the app.ts so that it doesn't need to be compiled each startup
RUN deno cache app.ts

CMD ["run", "--allow-net", "app.ts"]

# Dockerfile based on example provided here https://github.com/hayd/deno-docker
# Example on how to build and run it
# docker build -t eva-investments-server . && docker run -it --init -p 8080:1993 eva-investments-server