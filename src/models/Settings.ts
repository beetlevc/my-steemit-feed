
export class Settings {
    blog: string = "veta-less";
    filterMode: FilterMode = FilterMode.Blacklist;
    whitelist: string[] = [];
    blacklist: string[] = [];
    showReblogged: boolean = false;
}

export enum FilterMode {
    Whitelist = "Whitelist",
    Blacklist = "Blacklist",
}
