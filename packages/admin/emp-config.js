//@ts-ignore
const deps = require("./package.json").dependencies;
const { resolveApp } = require("@efox/emp-cli/helpers/paths");
const path = require("path");
const fs = require("fs");
const port = process.env.ADMIN_PORT ? parseInt(process.env.ADMIN_PORT) : 8002;
const name = "admin";

const getVercelPreviewUrl = (moduleName) =>
  `https://scratch-tutoring-web-${moduleName}-git-${process.env.VERCEL_GIT_COMMIT_REF}.stg-branch.be`;

const getVercelPreviewUrlCI = (moduleName) =>
  `https://scratch-tutoring-web-${moduleName}-git-${process.env.GITHUB_HEAD_REF}.stg-branch.be`;

const REMOTE_URL = {
  local: {
    app: process.env.APP_URL || "https://local.stg-branch.be:8001",
  },
  preview: {
    app: getVercelPreviewUrl("app"),
  },
  production: {
    app: "https://scratch-tutoring-web-app.stg-branch.be",
  },
  ci: {
    app: getVercelPreviewUrlCI("app"),
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

    config.resolve.alias.set("admin/core", `${resolveApp(".")}/core`);
    config.resolve.alias.set("admin/src", `${resolveApp(".")}/src`);
    config.resolve.alias.set("admin/shared", `${resolveApp(".")}/shared`);
    config.resolve.alias.set("admin/generated", `${resolveApp(".")}/generated`);

    return {
      output: {
        path: path.join(__dirname, "dist"),
        publicPath: !process.env.VERCEL_ENV
          ? process.env.ADMIN_URL
            ? `${process.env.ADMIN_URL}/`
            : `https://local.stg-branch.be:${port}/`
          : `${getVercelPreviewUrl("admin")}/`,
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
      "@scratch-tutoring-web/app": `app@${getRemoteUrl().app}/emp.js`,
    },
    exposes: {
      "./src/routes": "./src/routes",
      "./shared/components/table-pagination/index":
        "./shared/components/table-pagination/index",
      "./shared/components/table-shell/index":
        "./shared/components/table-shell/index",
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
