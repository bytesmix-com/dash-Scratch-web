const path = require("path");
const concurrently = require("concurrently");

concurrently(
  [
    `cp -f ../app/dist/index.d.ts ./generated/types/@scratch-tutoring-web-app.d.ts`,
  ],
  {
    prefix: "name",
    restartTries: 3,
    cwd: path.resolve(__dirname, "../"),
  },
).then((success, failure) => console.log(success, failure));
