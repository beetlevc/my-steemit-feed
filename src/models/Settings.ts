
export class Settings {
    blog: string = "veta-less";
    filterMode: FilterMode = FilterMode.Blacklist;
    whitelist: string[] = [];
    blacklist: string[] = [];
    showReblogged: boolean = false;
    postViewer: PostViewer = PostViewer.Steemit;
}

export enum FilterMode {
    Whitelist = "Whitelist",
    Blacklist = "Blacklist",
}

export enum PostViewer {
    Steemit = "Steemit",
    Busy = "Busy",
}
