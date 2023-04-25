import * as Generator from "yeoman-generator";
import * as which from "which";
import { v4 as uuid } from "uuid";
import { pascalCase } from "pascal-case";
const chalk = require("chalk");
import * as fs from "fs";
import * as fg from "fast-glob";
import * as path from "path";

const webPackPackages: IWebPackage[] = require("./webpackpackages.json");

export interface IWebPackage {
  versions: string;
  nodePackages: INodePackage[] | undefined;
  nugetPackages: INugetPackage[] | undefined;
}

export interface INodePackage {
  package: string;
  version: string | undefined;
  dev: boolean;
}

export interface INugetPackage {
  package: string;
  version: string;
}

export interface IBaseProps extends Generator.GeneratorOptions {
  projType: "master" | "library" | "mvc" | "scss" | "react" | "skin" | "container" | "personabar" | "templates";
}

export default class extends Generator<IBaseProps> {
  props: any;

  constructor(args: any, opts: any) {
    super(args, opts);
    this.options.namespace = "teams";
  }

  _hasYarn(): boolean {
    return which.sync("yarn", { nothrow: true }) !== undefined;
  }

  _generateGuid(): string {
    return uuid();
  }

  _pascalCaseName(val: string): string {
    return pascalCase(val);
  }

  _createSolution(solutionName: string) {
    this.log(chalk.white("Creating sln."));
    return this.spawnCommandSync("dotnet", ["new", "sln", "-n", solutionName, "-o", this.destinationRoot()]);
  }

  _addProjectToSolution(solutionName: string, projectPath: string): void {
    this.log(chalk.white("Adding project to sln."));
    this.spawnCommandSync("dotnet", ["sln", this.destinationPath(solutionName), "add", this.destinationPath(projectPath)]);
  }

  _installWebPack(): void {
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

  _addPackages(packages: IWebPackage[], projFile: string): void {
    if (!packages) return;
    let version = this.config.get("promptValues").dnnVersion;
    let useNpm = this.config.get("promptValues").npm;
    let nugetPackageList: INugetPackage[] = [];
    let nodePackageList: INodePackage[] = [];
    packages.forEach((p) => {
      if (p.versions == "all") {
        nugetPackageList = p.nugetPackages || [];
        nodePackageList = p.nodePackages || [];
      } else if (p.versions.includes(version)) {
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
      let project: any = this.fs.readJSON(this.destinationPath("package.json"));
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
        } else {
          if (dependencies && dependencies[np.package] != undefined) {
            canAdd = false;
          }
        }
        if (canAdd) {
          console.log("Adding package: " + pkg);
          if (useNpm) {
            this.spawnCommandSync("npm", ["i", dev ? "-D" : "-P", pkg]);
          } else {
            this.spawnCommandSync("yarn", ["add", pkg, dev ? "-D" : ""]);
          }
        }
      });
    }
  }

  _copyTplWithNameReplace(patterns: any, to: any, context: any): void {
    let files = fg.sync(patterns);
    files.forEach((file) => {
      let newFileName = path.basename(file).replace("_name_", context.Name).replace("_company_", context.Company).replace("_", "");
      this.fs.copyTpl(file, this.destinationPath(to + newFileName), context);
    });
  }
}
