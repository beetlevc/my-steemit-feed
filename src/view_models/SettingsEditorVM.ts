import { FilterMode, PostViewer } from '../models/Settings'

export class SettingsEditorVM {
    blog: string = "";
    filterMode: FilterMode = FilterMode.Blacklist;
    whitelist: string = "";
    blacklist: string = "";
    showReblogged: boolean = false;    
    postViewer: PostViewer = PostViewer.Steemit;
}
