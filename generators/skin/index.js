"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basegenerator_1 = require("../basegenerator");
const chalk = require("chalk");
const packages = require("./packages.json");
class default_1 extends basegenerator_1.default {
    constructor(args, opts) {
        super(args, opts);
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
        ];
        return this.prompt(prompts).then((props) => {
            props.Name = this._pascalCaseName(props.Name);
            this.props = props;
            this._saveNewAnswers(props);
        });
    }
    writing() {
        this.log(chalk.white("Creating Skin project."));
        let template = Object.assign({}, this.config.getAll(), this.props, {
            Guid: this._generateGuid(),
        });
        this.projPath = "Themes/Skins/" + template.Name + "/" + template.Name + ".csproj";
        this.fs.copyTpl(this.templatePath("../../common/csproj/_web.csproj"), this.destinationPath(this.projPath), template);
        this.fs.copyTpl(this.templatePath("**/*.*"), this.destinationPath("Themes/Skins/" + template.Name + "/"), template);
    }
    install() {
        this._addProjectToSolution(this.config.get("Solution") + ".sln", this.projPath);
        this._addPackages(packages, this.destinationPath("."));
        let project = this.fs.readJSON(this.destinationPath("package.json"));
        if (project) {
            project.dnn.projectFolders.push("Themes/Skins/" + this.props.Name);
            this.fs.writeJSON(this.destinationPath("package.json"), project);
        }
    }
    end() {
        this.log(chalk.white("Created Skin project."));
    }
}
exports.default = default_1;
