//@ts-ignore
const deps = require("./package.json").dependencies;
const { resolveApp } = require("@efox/emp-cli/helpers/paths");
const path = require("path");
const fs = require("fs");
require('dotenv').config({
  debug: true,
  override: true
})
console.log("------------")
console.log(JSON.stringify(process.env, null, 2))
console.log("------------")
const port = process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 8001;
const name = "app";

const getVercelPreviewUrl = (moduleName) =>
  `https://scratch-tutoring-web-${moduleName}-git-${process.env.VERCEL_GIT_COMMIT_REF}.stg-branch.be`;

const getVercelPreviewUrlCI = (moduleName) =>
  `https://scratch-tutoring-web-${moduleName}-git-${process.env.GITHUB_HEAD_REF}.stg-branch.be`;

const REMOTE_URL = {
  local: {
    admin: process.env.ADMIN_URL || "https://local.stg-branch.be:8002",
  },
  preview: {
    admin: getVercelPreviewUrl("admin"),
    gui: getVercelPreviewUrl("gui"),
  },
  production: {
    admin: "https://scratch-tutoring-web-admin.stg-branch.be",
  },
  ci: {
    admin: getVercelPreviewUrlCI("admin"),
  },
};

const getRemoteUrl = () => {
  if (!process.env.VERCEL_ENV) {
    if (process.env.CI) return REMOTE_URL.ci;
    return REMOTE_URL.local;
  }
  if (process.env.VERCEL_ENV === "preview") return REMOTE_URL.preview;
  if (process.env.VERCEL_ENV === "production") return REMOTE_URL.production;
  throw new Error("Unknown VERCEL_URL");
};

const readFileIfExists = (filePathRelativeToCwd) => {
  if (fs.existsSync(path.join(process.cwd(), filePathRelativeToCwd))) {
    return fs.readFileSync(path.join(process.cwd(), filePathRelativeToCwd));
  } else {
    return undefined;
  }
};

module.exports = {
  webpack({ webpackEnv, config }) {
    config.plugin("html").tap((args) => {
      args[0] = {
        ...args[0],
        ...{
          template: "./public/index.html",
        },
      };
      return args;
    });

    config.resolve.alias.set("app/core", `${resolveApp(".")}/core`);
    config.resolve.alias.set("app/shared", `${resolveApp(".")}/shared`);
    config.resolve.alias.set("app/src", `${resolveApp(".")}/src`);
    config.resolve.alias.set("app/generated", `${resolveApp(".")}/generated`);

    return {
      output: {
        path: path.join(__dirname, "dist"),
        // eslint-disable-next-line no-nested-ternary
        publicPath: !process.env.VERCEL_ENV
          ? process.env.APP_URL
            ? `${process.env.APP_URL}/`
            : `https://local.stg-branch.be:${port}/`
          : `${getVercelPreviewUrl("app")}/`,
        chunkFilename: "[id].[contenthash].js",
      },
      module: {
        rules: [
          {
            test: /\.(ts|tsx)$/,
            loader: "babel-loader",
            exclude: /node_modules/,
            options: {
              presets: ["@babel/preset-react"],
            },
          },
        ],
      },
      devServer: {
        port,
        static: {
          directory: path.join(__dirname, "dist"),
        },
        historyApiFallback: true,
        hot: "only",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods":
            "GET, POST, PUT, DELETE, PATCH, OPTIONS",
          "Access-Control-Allow-Headers":
            "X-Requested-With, content-type, Authorization",
        },
        https: {
          key: readFileIfExists("../../.cert/key.pem"),
          cert: readFileIfExists("../../.cert/cert.pem"),
        },
      },
    };
  },

  moduleGenerator({ webpackEnv }) {
    return !process.env.VERCEL_ENV ? "/" : `${process.env.VERCEL_URL}/`;
  },

  moduleFederation: {
    name,
    filename: "emp.js",
    remotes: {
      "@scratch-tutoring-web/admin": `admin@${getRemoteUrl().admin}/emp.js`,
    },
    exposes: {
      "./core/components/modal/simple/index":
        "./core/components/modal/simple/index",
      "./core/components/svg-icon/index": "./core/components/svg-icon/index",

      "./core/theme/index": "./core/theme/index",
      "./core/utils/api/client": "./core/utils/api/client",
      "./core/utils/errors/default-request-error-handler":
        "./core/utils/errors/default-request-error-handler",
      "./core/utils/errors/handle-retry": "./core/utils/errors/handle-retry",
      "./shared/components/password-field/index":
        "./shared/components/password-field/index",
    },
    shared: {
      ...deps,
      react: {
        singleton: false,
        requiredVersion: deps.react,
      },
      "react-dom": {
        singleton: false,
        requiredVersion: deps["react-dom"],
      },
      "react-router-dom": {
        singleton: true,
        requiredVersion: "^6.0.2",
      },
      "@chakra-ui/react": {
        singleton: true,
        requiredVersion: deps["@chakra-ui/react"],
      },
      graphql: {
        singleton: true,
        requiredVersion: deps.graphql,
      },
    },
  },
  getRemoteUrl,
};
