
export class Settings {
    blog: string = "";
    filterMode: FilterMode = FilterMode.Blacklist;
    whitelist: string[] = [];
    blacklist: string[] = [];
    showReblogged: boolean = false;
    
    constructor() {
        this.blog = "veta-less";
        this.filterMode = FilterMode.Blacklist;
        this.whitelist = [];
        this.blacklist = [];
        this.showReblogged = false;
    }
}

export enum FilterMode {
    Whitelist = "Whitelist",
    Blacklist = "Blacklist",
}

export class SettingsEditor {
    blog: string = "";
    filterMode: FilterMode = FilterMode.Blacklist;
    whitelist: string = "";
    blacklist: string = "";
    showReblogged: boolean = false;    
}
