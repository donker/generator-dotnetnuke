import DataService from "../Service";
import { IContextSecurity } from "./index";
import { ISiteLocale } from "./ISiteLocale";

export interface IAppModule {
    moduleId: number;
    tabId: number;
    locale: string;
    locales: ISiteLocale[];
    resources: any;
    common: any;
    security: IContextSecurity;
    service: DataService;
}

export class AppModule implements IAppModule {
    public moduleId: number;
    public tabId: number;
    public locale: string;
    public locales: ISiteLocale[];
    public resources: any;
    public common: any;
    public security: IContextSecurity;
    public service: DataService;
    constructor(moduleId: number, tabId: number, locale: string, locales: ISiteLocale[], resources: any, common: any, security: IContextSecurity, service: DataService) {
        this.moduleId = moduleId;
        this.tabId = tabId;
        this.locale = locale;
        this.locales = locales;
        this.resources = resources;
        this.common = common;
        this.security = security;
        this.service = service;
    }
}
