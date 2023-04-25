import DnnGeneratorBase, { IWebPackage } from "../basegenerator";
const chalk = require("chalk");
const packages: IWebPackage[] = require("./packages.json");

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
    ];

    return this.prompt(prompts).then((props) => {
      props.Name = this._pascalCaseName(props.Name);
      this.props = props;
    });
  }

  writing() {
    this.log(chalk.white("Creating Skin project."));

    let template = Object.assign({}, this.config.getAll(), this.props, {
      Guid: this._generateGuid(),
    });

    this.projPath = "Themes/Containers/" + template.Name + "/" + template.Name + ".csproj";

    this.fs.copyTpl(this.templatePath("../../common/csproj/_web.csproj"), this.destinationPath(this.projPath), template);

    this.fs.copyTpl(this.templatePath("**/*.*"), this.destinationPath("Themes/Containers/" + template.Name + "/"), template);
  }

  install() {
    this._addProjectToSolution(this.config.get("Solution") + ".sln", this.projPath);
    this._addPackages(packages, this.destinationPath("."));
    let project: any = this.fs.readJSON(this.destinationPath("package.json"));
    if (project) {
      project.dnn.projectFolders.push("Themes/Containers/" + this.props.Name);
      this.fs.writeJSON(this.destinationPath("package.json"), project);
    }
  }

  end() {
    this.log(chalk.white("Created container project."));
  }
}
