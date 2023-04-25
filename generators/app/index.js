"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basegenerator_1 = require("../basegenerator");
const chalk = require("chalk");
const yosay = require("yosay");
const versions = require("./versions.json");
class default_1 extends basegenerator_1.default {
    constructor(args, opts) {
        super(args, opts);
        // This method adds support for a `--test` flag
        this.option("noinstall");
        if (this.config.get("promptValues")) {
            if (this.config.get("promptValues").npm == undefined) {
                if (!this._hasYarn()) {
                    this.config.set("promptValues", Object.assign({}, this.config.get("promptValues"), {
                        npm: true,
                    }));
                }
            }
        }
    }
    prompting() {
        this.log(yosay("Welcome to the " + chalk.green("DotNetNuke") + " project generator!"));
        this.log(chalk.white("This scaffolds the project in your current directory."));
        this.log(JSON.stringify(this.config.get("promptValues")));
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
                    { name: "React", value: "react" },
                    { name: "Skin", value: "skin" },
                    { name: "Container", value: "container" },
                    { name: "PersonaBar", value: "personabar" },
                    { name: "Templates", value: "templates" },
                ],
            },
            {
                when: () => {
                    let pv = this.config.get("promptValues");
                    return pv ? pv.dnnVersion == undefined : false;
                },
                type: "list",
                name: "dnnVersion",
                message: "DNN target version:",
                store: true,
                choices: versions.map((v) => {
                    return { name: v, value: v };
                }),
            },
            {
                when: () => {
                    let pv = this.config.get("promptValues");
                    return pv ? pv.npm == undefined : false;
                },
                type: "list",
                name: "npm",
                message: "NPM or Yarn:",
                store: true,
                choices: [
                    { name: "NPM", value: true },
                    { name: "Yarn", value: false },
                ],
            },
        ];
        return this.prompt(prompts).then((props) => {
            this.props = props;
        });
    }
    composing() {
        const options = {
            projType: this.props.value,
        };
        this.composeWith(require.resolve(`../${this.props.projType}`), options);
        // this.composeWith(`teams:${this.props.projType}`, options);
        // switch (this.props.projType) {
        //   case "master":
        //     this.composeWith(require.resolve('../master'), options);
        //     break;
        // }
    }
    writing() { }
    install() { }
}
exports.default = default_1;
