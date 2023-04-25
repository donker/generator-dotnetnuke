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
            {
                type: "input",
                name: "Namespace",
                message: "Namespace:",
                default: (answers) => {
                    return this.config.get("Namespace") + "." + this._pascalCaseName(answers.Name);
                },
                store: false,
                validate: (str) => {
                    return str.length > 0;
                },
            },
            {
                type: "confirm",
                name: "Separate",
                default: false,
                message: "As a separate DNN extension?",
                store: false,
            },
        ];
        return this.prompt(prompts).then((props) => {
            props.Name = this._pascalCaseName(props.Name);
            this.props = props;
            this._saveNewAnswers(props);
        });
    }
    writing() {
        this.log(chalk.white("Creating library project."));
        let template = Object.assign({}, this.config.getAll(), this.props, {
            Guid: this._generateGuid(),
        });
        this.projPath = "Server/" + template.Name + "/" + template.Namespace + ".csproj";
        this.fs.copyTpl(this.templatePath("../../common/csproj/_library.csproj"), this.destinationPath(this.projPath), template);
        if (this.props.Separate) {
            this.fs.copyTpl(this.templatePath("dnn.json"), this.destinationPath("Server/" + template.Name + "/dnn.json"), template);
        }
    }
    install() {
        this._addProjectToSolution(this.config.get("Solution") + ".sln", this.projPath);
        this._addPackages(packages, this.projPath);
        if (this.props.Separate) {
            let project = this.fs.readJSON(this.destinationPath("package.json"));
            if (project) {
                project.dnn.projectFolders.push("Server/" + this.props.Name);
                this.fs.writeJSON(this.destinationPath("package.json"), project);
            }
        }
    }
    end() {
        this.log(chalk.white("Created library project."));
    }
}
exports.default = default_1;
