
import { DenonConfig } from "./src/deps.ts";

const config: DenonConfig = {
  scripts: {
    start: {
      cmd: "deno run app.ts",
      desc: "run my app.ts file",
      allow: ["net"],
      unstable: true,
    },
    install: {
      cmd: "deno install -n eva-investments-server-version -f app.ts",
      desc: "Install and create executable code from my app.ts file",
      allow: ["net"],
      unstable: true,
    },
    bundle: {
      cmd: "deno bundle app.ts eva-investments-server.bundle.js",
      desc: "Install and create executable code from my app.ts file",
      unstable: true,
    },
    compile: {
      cmd: "deno compile app.ts",
      desc: "Install and create executable code from my app.ts file",
      allow: ["net"],
      unstable: true,
    },
    fmt: {
      cmd: "deno fmt",
      desc: "Format the code.",
      allow: [],
      watch: false
    },
    lint: {
      cmd: "deno lint",
      desc: "Code linter for JavaScript and TypeScript",
      unstable: true,
      watch: false,
      allow: []
    }
  },
  watcher: {
    legacy: true // May want to switch this between true and false depending on the env where this is being run
  }
};

export default config;