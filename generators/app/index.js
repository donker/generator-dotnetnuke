"use strict";
const Generator = require("yeoman-generator");
const yosay = require("yosay");
const chalk = require("chalk");
const versions = require("./versions.json");

module.exports = class extends Generator {
  prompting() {
    this.log(
      yosay(
        "Welcome to the " + chalk.green("DotNetNuke") + " project generator!"
      )
    );
    this.log(
      chalk.white("This scaffolds the project in your current directory.")
    );

    // this.log(JSON.stringify(this.config.get("promptValues")));

    const prompts = [
      {
        when: !this.options.projType,
        type: "list",
        name: "projType",
        message: "What type of project would you like to scaffold?",
        choices: [
          { name: "Master Project", value: "master" },
          { name: "Library Project", value: "library" },
          { name: "MVC Module", value: "mvc" },
          { name: "SCSS", value: "scss" },
          { name: "React", value: "react" }
        ]
      },
      {
        type: "list",
        name: "dnnVersion",
        message: "DNN target version:",
        store: true,
        choices: versions.map(v => {
          return { name: v, value: v };
        })
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  composing() {
    const options = {
      projType: this.props.value
    };
    this.composeWith(require.resolve(`../${this.props.projType}`), options);
  }

  writing() {}

  install() {}
};
