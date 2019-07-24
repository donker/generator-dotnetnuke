"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const uuid = require("uuid-v4");
const pascalCase = require("pascal-case");
const which = require("which");
const fg = require("fast-glob");
const path = require("path");

module.exports = class DnnGeneratorBase extends Generator {
  constructor(args, opts) {
    super(args, opts);

    // This method adds support for a `--test` flag
    this.option("noinstall");
  }

  _hasYarn() {
    return which.sync("yarn", { nothrow: true }) !== undefined;
  }

  _generateGuid() {
    return uuid();
  }

  _pascalCaseName(val) {
    return pascalCase(val);
  }

  _createSolution(solutionName) {
    this.log(chalk.white("Creating sln."));
    return this.spawnCommandSync("dotnet", [
      "new",
      "sln",
      "-n",
      solutionName,
      "-o",
      this.destinationRoot()
    ]);
  }

  _addProjectToSolution(solutionName, projectPath) {
    this.log(chalk.white("Adding project to sln."));
    this.spawnCommandSync("dotnet", [
      "sln",
      this.destinationPath(solutionName),
      "add",
      this.destinationPath(projectPath)
    ]);
  }

  _copyCommon(namespace, moduleName) {
    this.fs.copyTpl(
      this.templatePath("../../gulp/*.js"),
      this.destinationPath(moduleName + "/_BuildScripts/gulp/"),
      {
        namespace: namespace,
        moduleName: moduleName
      }
    );
  }

  _defaultInstall() {
    if (!this.options.noinstall) {
      let hasYarn = this._hasYarn();
      process.chdir(this.props.moduleName);
      this.installDependencies({ npm: !hasYarn, bower: false, yarn: hasYarn });
    }
  }

  _writeJsConfig() {
    this.fs.extendJSON(
      this.destinationPath(this.props.moduleName + "/jsconfig.json"),
      {
        compilerOptions: {
          target: "es6",
          module: "commonjs",
          allowSyntheticDefaultImports: true
        },
        exclude: ["node_modules"]
      }
    );
  }

  _writeTsConfig() {
    this.fs.extendJSON(
      this.destinationPath(this.props.moduleName + "/tsconfig.json"),
      {
        compilerOptions: {
          module: "es6",
          target: "es6",
          moduleResolution: "node",
          baseUrl: "src",
          allowSyntheticDefaultImports: true,
          noImplicitAny: false,
          sourceMap: true,
          outDir: "ts-build",
          jsx: "react"
        },
        exclude: ["node_modules"]
      }
    );
  }

  _writeBabelRc() {
    this.fs.extendJSON(
      this.destinationPath(this.props.moduleName + "/.babelrc"),
      {
        presets: ["@babel/preset-env", "@babel/preset-react"],
        plugins: [
          "@babel/plugin-transform-object-assign",
          "@babel/plugin-proposal-object-rest-spread"
        ],
        env: {
          production: {
            plugins: ["transform-react-remove-prop-types"]
          }
        }
      }
    );
  }

  _createYarnWorkspace() {
    if (!this._hasYarn()) return;

    const workspaceJson = {
      name: this.props.namespace,
      version: "1.0.0",
      description: "Project workspace",
      private: true,
      workspaces: [this.props.moduleName],
      scripts: {
        // eslint-disable-next-line prettier/prettier
        test: "lerna run test",
        // eslint-disable-next-line prettier/prettier
        clean: "lerna run clean",
        // eslint-disable-next-line prettier/prettier
        build: "lerna run build",
        // eslint-disable-next-line prettier/prettier
        "build-client": "lerna run build-client",
        // eslint-disable-next-line prettier/prettier
        package: "lerna run package"
      },
      devDependencies: {
        // eslint-disable-next-line prettier/prettier
        "browser-sync": "^2.26.3"
      },
      dependencies: {
        // eslint-disable-next-line prettier/prettier
        lerna: "^3.8.4"
      }
    };

    this.fs.extendJSON(this.destinationPath("package.json"), workspaceJson);

    const lernaJson = {
      lerna: "3.8.4",
      npmClient: "yarn",
      packages: [this.props.moduleName],
      version: "1.0.0"
    };

    this.fs.extendJSON(this.destinationPath("lerna.json"), lernaJson);
  }

  _addNugetPackages(packages, projFile) {
    let version = this.config.get("promptValues").dnnVersion;
    let packageList = null;
    packages.forEach(p => {
      if (p.versions.includes(version)) {
        packageList = p.packages;
      }
    });
    if (packageList) {
      packageList.forEach(p => {
        this.spawnCommandSync("dotnet", [
          "add",
          projFile,
          "package",
          p.package,
          "-v",
          p.version
        ]);
      });
    }
  }

  _copyTplWithNameReplace(patterns, to, context) {
    let files = fg.sync(patterns);
    files.forEach(file => {
      let newFileName = path.basename(file).replace("_name_", context.Name).replace("_company_", context.Company).replace("_", "");
      this.fs.copyTpl(
        file,
        this.destinationPath(to + newFileName),
        context
      );
    });
  }
};
