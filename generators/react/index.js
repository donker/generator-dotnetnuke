"use strict";
const DnnGeneratorBase = require("../lib/DnnGeneratorBase");
const chalk = require("chalk");
const packages = require("./packages.json");
const reduxPackages = require("./reduxpackages.json");
const routerPackages = require("./routerpackages.json");
const { readdirSync } = require("fs");

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
        validate: (str) => {
          return str.length > 0;
        },
      },
      {
        type: "list",
        name: "ModuleName",
        message: "Module name (of module this project is linked to):",
        store: false,
        choices: () =>
          readdirSync("./Server", { withFileTypes: true })
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => {
              return { name: dirent.name, value: dirent.name };
            }),
      },
      {
        type: "checkbox",
        name: "ReactOptions",
        message: "Options:",
        store: false,
        choices: [
          { name: "Redux", value: "redux" },
          { name: "React Router", value: "router" },
        ],
      },
    ];

    return this.prompt(prompts).then((props) => {
      props.Name = this._pascalCaseName(props.Name);
      this.props = props;
    });
  }

  writing() {
    this.log(chalk.white("Creating React project."));

    let template = Object.assign({}, this.config.getAll(), this.props, {
      Guid: this._generateGuid()
    });

    this.fs.copyTpl(
      this.templatePath("**/*.*"),
      this.destinationPath("Client/Js/" + template.Name + "/"),
      template,
      null,
      {
        globOptions: {
          ignore: ["**/_*.*"]
        }
      }
    );

    
  }

  install() {
    this._installWebPack();
    this._addPackages(packages, this.destinationPath("."));
    if (this.props.ReactOptions.includes("redux")) {
      this._addPackages(reduxPackages, this.destinationPath("."));
    }
    if (this.props.ReactOptions.includes("router")) {
      this._addPackages(routerPackages, this.destinationPath("."));
    }
  }

  end() {
    this.log(chalk.white("Created React project."));
  }
};
