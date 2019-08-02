"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const uuid = require("uuid-v4");
const pascalCase = require("pascal-case");
const which = require("which");
const fg = require("fast-glob");
const path = require("path");
const webPackPackages = require("../common/webpack/packages.json");

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

  _installWebPack() {
    this._addNugetPackages(webPackPackages, this.destinationPath("."));
  }

  _addNugetPackages(packages, projFile) {
    if (!packages) return;
    let version = this.config.get("promptValues").dnnVersion;
    let useNpm = this.config.get("promptValues").npm;
    let nugetPackageList = null;
    let nodePackageList = null;
    packages.forEach(p => {
      if (p.versions == "all") {
        nugetPackageList = p.nugetPackages;
        nodePackageList = p.nodePackages || [];
        if (p.nodePackageList) {
          nodePackageList.push(p.nodePackageList.map(n => {
            return {
              package: n
            }
          }));
        }
      }
      else if (p.versions.includes(version)) {
        nugetPackageList = p.nugetPackages;
        nodePackageList = p.nodePackages || [];
        if (p.nodePackageList) {
          nodePackageList.push(p.nodePackageList.map(n => {
            return {
              package: n
            }
          }));
        }
      }
    });
    if (nugetPackageList) {
      nugetPackageList.forEach(p => {
        this.spawnCommandSync("dotnet", [
          "add",
          projFile,
          "package",
          p.package,
          "-v",
          p.version == "current" ? version : p.version
        ]);
      });
    }
    if (nodePackageList) {
      let project = this.fs.readJSON(this.destinationPath("package.json"));
      var devDependencies = project.devDependencies;
      var dependencies = project.dependencies;
      nodePackageList.forEach(np => {
        var dev = np.dev == undefined ? true : np.dev;
        var pkg = np.package;
        if (np.version) {
          pkg = pkg + "@" + np.version;
        }
        let canAdd = true;
        if (dev) {
          if (devDependencies[np.package] != undefined) {
            canAdd = false;
          }
        } else {
          if (dependencies[np.package] != undefined) {
            canAdd = false;
          }
        }
        if (canAdd) {
          if (useNpm) {
            this.npmInstall(pkg, { 'save-dev': dev });
          } else {
            this.yarnInstall(pkg, { 'save-dev': dev });
          }
        }
      });
    }
  }

  _copyTplWithNameReplace(patterns, to, context) {
    let files = fg.sync(patterns);
    files.forEach(file => {
      let newFileName = path
        .basename(file)
        .replace("_name_", context.Name)
        .replace("_company_", context.Company)
        .replace("_", "");
      this.fs.copyTpl(file, this.destinationPath(to + newFileName), context);
    });
  }
};
