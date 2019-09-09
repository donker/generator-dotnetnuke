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
      }
    ];

    return this.prompt(prompts).then(props => {
      props.Name = this._pascalCaseName(props.Name);
      this.props = props;
    });
  }

  writing() {
    this.log(chalk.white("Creating Skin project."));

    let template = Object.assign({}, this.config.getAll(), this.props, {
      Guid: this._generateGuid()
    });

    this.projPath =
      "Themes/" + template.Name + "/" + template.Name + "_Theme.csproj";

    this.fs.copyTpl(
      this.templatePath("../../common/csproj/_web.csproj"),
      this.destinationPath(this.projPath),
      template
    );

    this.fs.copyTpl(
      this.templatePath("**/*.*"),
      this.destinationPath("Themes/" + template.Name + "/"),
      template
    );
  }

  install() {
    this._addProjectToSolution(
      this.config.get("Solution") + ".sln",
      this.projPath
    );
    this._addPackages(packages, this.destinationPath("."));
    let project = this.fs.readJSON(this.destinationPath("package.json"));
    if (project) {
      project.dnn.projectFolders.push("Themes/" + this.props.Name);
      this.fs.writeJSON(this.destinationPath("package.json"), project);
    }
  }

  end() {
    this.log(chalk.white("Created Skin project."));
  }
};
