"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basegenerator_1 = require("../basegenerator");
const chalk = require("chalk");
class default_1 extends basegenerator_1.default {
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
        this.fs.copyTpl(this.templatePath("**/*.*"), this.destinationPath("Templates/"), template, undefined, {
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
}
exports.default = default_1;
