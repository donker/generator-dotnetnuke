"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Generator = require("yeoman-generator");
const which = require("which");
const uuid_1 = require("uuid");
const pascal_case_1 = require("pascal-case");
const chalk = require("chalk");
const fs = require("fs");
const fg = require("fast-glob");
const path = require("path");
const webPackPackages = require("./webpackpackages.json");
class default_1 extends Generator {
    constructor(args, opts) {
        super(args, opts);
        this.promptValues = this.config.get("promptValues");
        if (this.promptValues == undefined) {
            this.promptValues = {};
        }
    }
    _saveNewAnswers(answers) {
        this.promptValues = Object.assign({}, this.promptValues, answers);
        this.config.set("promptValues", this.promptValues);
        this.config.save();
    }
    _hasYarn() {
        return which.sync("yarn", { nothrow: true }) !== undefined;
    }
    _generateGuid() {
        return (0, uuid_1.v4)();
    }
    _pascalCaseName(val) {
        return (0, pascal_case_1.pascalCase)(val);
    }
    _createSolution(solutionName) {
        this.log(chalk.white("Creating sln."));
        return this.spawnCommandSync("dotnet", ["new", "sln", "-n", solutionName, "-o", this.destinationRoot()]);
    }
    _addProjectToSolution(solutionName, projectPath) {
        this.log(chalk.white("Adding project to sln."));
        this.spawnCommandSync("dotnet", ["sln", this.destinationPath(solutionName), "add", this.destinationPath(projectPath)]);
    }
    _installWebPack() {
        if (!this.fs.exists(this.destinationPath("Client/webpack.config.js"))) {
            let template = Object.assign({}, this.config.getAll(), this.props);
            this.fs.copyTpl(this.templatePath("../../common/webpack/templates/**/*.*"), this.destinationPath("."), template);
        }
        this._addPackages(webPackPackages, this.destinationPath("."));
        // now ensure all client projects are added to WebPack
        let fileContents = "";
        let cssProjects = fs.existsSync("./Client/Css")
            ? fs
                .readdirSync("./Client/Css", { withFileTypes: true })
                .filter((dirent) => dirent.isDirectory())
                .map((dirent) => dirent.name)
            : [];
        let jsProjects = fs.existsSync("./Client/Js")
            ? fs
                .readdirSync("./Client/Js", { withFileTypes: true })
                .filter((dirent) => dirent.isDirectory())
                .map((dirent) => dirent.name)
            : [];
        let allProjects = cssProjects.concat(jsProjects);
        cssProjects.forEach((project) => {
            fileContents += `var ${project}AppConfig = require("./Css/${project}/webpack.config");\n`;
        });
        jsProjects.forEach((project) => {
            fileContents += `var ${project}AppConfig = require("./Js/${project}/webpack.config");\n`;
        });
        fileContents += `module.exports = [\n`;
        allProjects.forEach((project) => {
            fileContents += `  ${project}AppConfig,\n`;
        });
        fileContents += `];\n`;
        fs.writeFileSync(this.destinationPath("./Client/webpack.config.js"), fileContents);
    }
    _addPackages(packages, projFile) {
        if (!packages)
            return;
        let version = this.config.get("promptValues").dnnVersion;
        let useNpm = this.config.get("promptValues").npm;
        let nugetPackageList = [];
        let nodePackageList = [];
        packages.forEach((p) => {
            if (p.versions == "all") {
                nugetPackageList = p.nugetPackages || [];
                nodePackageList = p.nodePackages || [];
            }
            else if (p.versions.includes(version)) {
                nugetPackageList = p.nugetPackages || [];
                nodePackageList = p.nodePackages || [];
            }
        });
        if (nugetPackageList) {
            nugetPackageList.forEach((p) => {
                this.spawnCommandSync("dotnet", ["add", projFile, "package", p.package, "-v", p.version == "current" ? version : p.version]);
            });
        }
        if (nodePackageList) {
            let project = this.fs.readJSON(this.destinationPath("package.json"));
            var devDependencies = project.devDependencies;
            var dependencies = project.dependencies;
            nodePackageList.forEach((np) => {
                var dev = np.dev == undefined ? true : np.dev;
                var pkg = np.package;
                if (np.version) {
                    pkg = pkg + "@" + np.version;
                }
                let canAdd = true;
                if (dev) {
                    if (devDependencies && devDependencies[np.package] != undefined) {
                        canAdd = false;
                    }
                }
                else {
                    if (dependencies && dependencies[np.package] != undefined) {
                        canAdd = false;
                    }
                }
                if (canAdd) {
                    console.log("Adding package: " + pkg);
                    if (useNpm) {
                        this.spawnCommandSync("npm", ["i", dev ? "-D" : "-P", pkg]);
                    }
                    else {
                        this.spawnCommandSync("yarn", ["add", pkg, dev ? "-D" : ""]);
                    }
                }
            });
        }
    }
    _copyTplWithNameReplace(patterns, to, context) {
        const paths = patterns.map(p => p.replace(/\\/g, '/'));
        const files = fg.sync(paths, { dot: true });
        files.forEach((file) => {
            const newFileName = path.basename(file).replace("_name_", context.Name).replace("_company_", context.Company).replace("_", "");
            this.fs.copyTpl(file, this.destinationPath(to + newFileName), context);
        });
    }
}
exports.default = default_1;
