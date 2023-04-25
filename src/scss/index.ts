import DnnGeneratorBase from "../basegenerator";
import * as fs from "fs";
const chalk = require("chalk");
const packages = require("./packages.json");

export default class extends DnnGeneratorBase {
  constructor(args: any, opts: any) {
    super(args, opts);
    this.option("noinstall");
  }

  projPath: string;

  prompting() {
    const prompts = [
      {
        type: "input",
        name: "Name",
        message: "Name:",
        store: false,
        validate: (str: string) => {
          return str.length > 0;
        },
      },
      {
        type: "list",
        name: "FileOutName",
        message: "Output Filename:",
        store: false,
        choices: (answers: any) => [
          {
            name: answers.Name.toLowerCase(),
            value: answers.Name.toLowerCase(),
          },
          { name: "module", value: "module" },
          { name: "skin", value: "skin" },
        ],
      },
      {
        type: "list",
        name: "ModuleName",
        message: "Module name (of module this project is linked to):",
        store: false,
        choices: () => {
          let res: any = [];
          if (fs.existsSync("./Server")) {
            res = res.concat(
              fs
                .readdirSync("./Server", { withFileTypes: true })
                .filter((dirent) => dirent.isDirectory())
                .map((dirent) => {
                  return { name: dirent.name, value: "Server/" + dirent.name };
                })
            );
          }
          if (fs.existsSync("./Themes") && fs.existsSync("./Themes/Skins")) {
            res = res.concat(
              fs
                .readdirSync("./Themes/Skins", { withFileTypes: true })
                .filter((dirent) => dirent.isDirectory())
                .map((dirent) => {
                  return {
                    name: dirent.name,
                    value: "Themes/Skins/" + dirent.name,
                  };
                })
            );
          }
          return res;
        },
      },
    ];

    return this.prompt(prompts).then((props) => {
      props.Name = this._pascalCaseName(props.Name);
      this.props = props;
    });
  }

  writing() {
    this.log(chalk.white("Creating Sass project."));

    let template = Object.assign({}, this.config.getAll(), this.props, {
      Guid: this._generateGuid(),
    });

    this.fs.copyTpl(this.templatePath("**/*.*"), this.destinationPath("Client/Css/" + template.Name + "/"), template, undefined, {
      globOptions: {
        ignore: ["**/_*.*"],
      },
    });
  }

  install() {
    this._installWebPack();
    this._addPackages(packages, this.destinationPath("."));
  }

  end() {
    this.log(chalk.white("Created Sass project."));
  }
}
