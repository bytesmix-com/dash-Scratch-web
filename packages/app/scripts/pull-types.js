const path = require("path");
const concurrently = require("concurrently");
const { getRemoteUrl } = require("../emp-config");

concurrently(
  [
    `cp -f ../admin/dist/index.d.ts ./generated/types/@scratch-tutoring-web-admin.d.ts`,
  ],
  {
    prefix: "name",
    restartTries: 3,
    cwd: path.resolve(__dirname, "../"),
  },
).then((success, failure) => console.log(success, failure));
