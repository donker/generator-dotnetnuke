"use strict";
const DnnGeneratorBase = require("../lib/DnnGeneratorBase");
const chalk = require("chalk");
const packages = require("./packages.json");

module.exports = class extends DnnGeneratorBase {
  constructor(args, opts) {
    super(args, opts);

    // This method adds support for a `--test` flag
    this.option("noinstall");
  }

  prompting() {
    const prompts = [
      {
        type: "input",
        name: "Name",
        message: "Name:",
        store: false,
        validate: str => {
          return str.length > 0;
        }
      },
      {
        type: "input",
        name: "Namespace",
        message: "Namespace:",
        default: answers => {
          return (
            this.config.get("Namespace") +
            "." +
            this._pascalCaseName(answers.Name)
          );
        },
        store: false,
        validate: str => {
          return str.length > 0;
        }
      }
    ];

    return this.prompt(prompts).then(props => {
      props.Name = this._pascalCaseName(props.Name);
      this.props = props;
    });
  }

  writing() {
    this.log(chalk.white("Creating MVC project."));

    let template = Object.assign({}, this.config.getAll(), this.props, {
      Guid: this._generateGuid()
    });
    this.projPath =
      "Server/" + template.Name + "/" + template.Namespace + ".csproj";

    this.fs.copyTpl(
      this.templatePath("../../common/csproj/_web.csproj"),
      this.destinationPath(this.projPath),
      template
    );

    this.fs.copyTpl(
      this.templatePath("**/*.*"),
      this.destinationPath("Server/" + template.Name + "/"),
      template,
      null,
      {
        globOptions: {
          ignore: ["**/_*.*"]
        }
      }
    );

    this._copyTplWithNameReplace([this.templatePath("Common/_*.*")], "Server/" + template.Name + "/Common/", template);
  }

  install() {
    this._addProjectToSolution(
      this.config.get("Solution") + ".sln",
      this.projPath
    );
    this._addNugetPackages(packages, this.projPath);
    let project = this.fs.readJSON(this.destinationPath("package.json"));
    if (project) {
      project.dnn.projectFolders.push("Server/" + this.props.Name);
      this.fs.writeJSON(this.destinationPath("package.json"), project);
    }
  }

  end() {
    this.log(chalk.white("Created MVC project."));
  }
};
