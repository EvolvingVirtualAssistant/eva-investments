# eva-investments

## Description
Investments module integrated in E.V.A

## Envs
Environments description

### Dev env
---
#### Requirements:
- OS: (Windows or Linux based OS)

#### Software installed
- Deno (autocomplete included)

## How to run

- Docker development:
  ```
  docker build --build-arg DEFAULT_BUILD_MODE=development -t eva-investments-server-debian . && docker run -it --mount type=bind,source=${ABSOLUTE_PATH_EVA_INVESTMENTS_DIR}/server,target=/app,readonly --init -p 8080:1993 eva-investments-server-debian
  ```
- Docker prod:
  ```
  docker build -t eva-investments-server-debian . && docker run -it --init -p 8080:1993 eva-investments-server-debian
  ```

## Node configs

### package.json
```
"start": "node --loader ts-node/esm --experimental-specifier-resolution=node src/app.ts"

* node --loader ts-node/esm equivalent to ts-node, however it is required to be able to specify the next option
* --experimental-specifier-resolution=node allows to import local files, without having to specify the .js extension in the end
  (i.e., instead of import x from 'localFolder/localFile.js, we can just to import x from 'localFolder/localFile')
```

## IDEs configuration

### Deno code editor configs
#### VS Code
***settings.json***
```json
{
    "deno.enable": true,
    "deno.lint": true,
    "deno.unstable": true,
    "deno.suggest.imports.hosts": {
        "https://deno.land/": true
    }
}
```
***launch.json***
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Deno: Run",
            "request": "launch",
            "type": "pwa-node",
            "program": "main.ts",
            "cwd": "${workspaceFolder}",
            "runtimeExecutable": "deno",
            "runtimeArgs": [
                "run",
                "--inspect",
                "--allow-all"
            ],
            "attachSimplePort": 9229
        }
    ]
}
```

## Git Workflow

This repository should have a **main** branch, and **feature/bug** branches, which are created from the **main** branch.

Everytime a PR is created, the PR should contain **Reviewers**, **Assignees** and **Labels**. 
For a **feature** branch, it is expected that the PR contains the **enhancement** label (it can also contain other labels, for example **documentation**). 
For a **bug** branch, it is expected that the PR contains the **bug** label (it can also contain other labels).

Each PR should go through a number of checks yet to be defined and implemented.

In order to understand if a PR should result in a deployment to production, then a **deploy** label has to be provided. When that label is provided, an automated process should start a deployment process. 
For each deploy a **tag** must be created.
The deployment process still needs to be defined, but the process should be able to bump the version by itself (understand if it is major, minor or patch) and create a release page with all of the release changes.
Test