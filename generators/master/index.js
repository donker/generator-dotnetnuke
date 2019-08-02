"use strict";
const DnnGeneratorBase = require("../lib/DnnGeneratorBase");
const chalk = require("chalk");

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
        name: "projectname",
        message: "Project name (single word, i.e. no spaces):",
        default: this.appname,
        store: true,
        validate: str => {
          return str.length > 0;
        }
      },
      {
        type: "input",
        name: "projectdescription",
        message: "Project description:",
        store: true,
        validate: str => {
          return str.length > 0;
        }
      },
      {
        type: "input",
        name: "yourname",
        message: "Your name:",
        store: true,
        validate: str => {
          return str.length > 0;
        }
      },
      {
        type: "input",
        name: "email",
        message: "Your e-mail address:",
        store: true,
        validate: str => {
          return str.length > 0;
        }
      },
      {
        type: "input",
        name: "companyfull",
        message: "Company or organization full name:",
        store: true,
        validate: str => {
          return str.length > 0;
        }
      },
      {
        type: "input",
        name: "companyshort",
        message: "Company or organization short name (one word, i.e. no spaces):",
        store: true,
        validate: str => {
          return str.length > 0;
        }
      },
      {
        type: "input",
        name: "companyUrl",
        message: "Company or organization url:",
        store: true,
        validate: str => {
          return str.length > 0;
        }
      },
      {
        type: 'input',
        name: 'dnnHost',
        message: 'Url to your local DNN site:',
        default: 'http://dnndev.me',
        store: true,
        validate: str => {
          return str.length > 0;
        }
      },
      {
        type: 'input',
        name: 'dnnRoot',
        message: 'Local path to the root of your DNN site:',
        store: true,
        validate: str => {
          return str.length > 0;
        }
      },
      {
        type: 'input',
        name: 'namespace',
        message: 'Namespace for your project:',
        store: true,
        default: (answers) => {return this._pascalCaseName(answers.companyshort) + '.' + this._pascalCaseName(answers.projectname)},
        validate: str => {
          return str.length > 0;
        }
      }
    ];

    return this.prompt(prompts).then(props => {
      props.projectname = this._pascalCaseName(props.projectname);
      props.companyshort = this._pascalCaseName(props.companyshort);
      this.config.set("Company", props.companyshort);
      this.config.set("Project", props.projectname);
      this.config.set("Namespace", props.namespace);
      this.config.set("Solution", props.namespace);
      this.config.save();
      this.props = props;
    });
  }

  writing() {
    this.log(chalk.white("Creating master project."));

    this.fs.copyTpl(
      this.templatePath("*.*"),
      this.destinationPath(""),
      this.props
    );
  }

  install() {
    this._createSolution(this.config.get("Solution"));
  }

  end() {
    this.log(chalk.white("Installed master project."));
  }
};
