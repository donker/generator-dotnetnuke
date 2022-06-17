"use strict";
const DnnGeneratorBase = require("../lib/DnnGeneratorBase");
const chalk = require("chalk");

module.exports = class extends DnnGeneratorBase {
  constructor(args, opts) {
    super(args, opts);
    this.option("noinstall");
  }

  writing() {
    this.log(chalk.white("Creating templates project."));

    let template = Object.assign({}, this.config.getAll(), this.props, {
      Guid: this._generateGuid(),
    });

    this.projPath = "Templates/Templates.csproj";

    this.fs.copyTpl(this.templatePath("**/*.*"), this.destinationPath("Templates/"), template, null, {
      globOptions: {
        ignore: ["**/_*.*"],
      },
    });

    this.fs.copyTpl(this.templatePath("../../common/.codegen.json"), this.destinationPath(".codegen.json"), template);
  }

  install() {
    this._addProjectToSolution(this.config.get("Solution") + ".sln", this.projPath);
  }

  end() {
    this.log(chalk.white("Created templates project."));
  }
};
