import PostVM from './PostVM'
// import * as steem from 'steem'
import { LocalStorageKey, PostsPerPage } from '../constants'
import { getFeedFirstEntryAsync, getDiscussionsByFeedAsync } from '../steemWrappers'
import { FilterMode, Settings } from '../models/Settings'
import { SettingsEditorVM } from './SettingsEditorVM'
//import * as debounce from 'lodash.debounce'
const debounce = require("lodash.debounce")

function topPosition(domElt: any): number {
    if (!domElt) {
        return 0;
    }
    return domElt.offsetTop + topPosition(domElt.offsetParent);
}

function parseStringArray(value: any, defaultValue: string[]): string[] {
    if (value && Array.isArray(value) && value.length)
        return value;
    else
        return defaultValue;
}

export default class AppVM {
    blogmode: boolean = false;
    isSettingsPanelVisible: boolean = false;
    posts: PostVM[] = [];
    settings: Settings = new Settings();
    settingsEditor: SettingsEditorVM = new SettingsEditorVM();
    isLoading: number = 0;
    isAllLoaded: boolean = false;
    loadMoreCount: number = 0;
    isError: boolean = false;

    get postCount(): number {
        return this.posts.length;
    }

    get visiblePostCount(): number {
        return this.posts.filter(x => x.isVisible).length;
    }

    constructor() {
        this.loadSettings();
        this.attachScrollListener();
        this.loadMore();
    }

    async reloadAll(): Promise<void> {
        this.posts = [];
        this.isAllLoaded = false;
        await this.loadMore();
    }

    async loadMore(): Promise<void> {
        if (this.loadMoreCount !== 0) return;
        // console.log("Load older posts");
        const minVisiblePosts = this.visiblePostCount + PostsPerPage;
        this.isError = false;

        this.isLoading++;
        this.loadMoreCount++;
        try {
            let sAuthor = "";
            let sPermlink = "";
            let sExclude = true;
            while (!this.isAllLoaded && minVisiblePosts > this.visiblePostCount) {
                if (this.posts.length) {
                    sAuthor = this.posts[this.posts.length - 1].author;
                    sPermlink = this.posts[this.posts.length - 1].permlink;
                    sExclude = true;
                } else {
                    const firstEntry = await getFeedFirstEntryAsync(this.settings.blog);
                    if (firstEntry) {
                        sAuthor = firstEntry.author;
                        sPermlink = firstEntry.permlink;
                        sExclude = false;
                    } else {
                        return;
                    }
                }
    
                let posts = await getDiscussionsByFeedAsync(this.settings.blog, PostsPerPage, sAuthor, sPermlink);
                this.isAllLoaded = posts.length !== PostsPerPage;
                if (sExclude)
                    posts = posts.slice(1);
                const postVMs = posts.map(x => PostVM.create(x));
                this.filterPosts(postVMs);
                this.posts.push(...postVMs);
            }
        } catch (ex) {
            console.error(ex);
            this.isError = true;
        } finally {
            this.loadMoreCount--;
            this.isLoading--;
        }
    }

    filterPosts(posts: PostVM[]): void {
        for (const post of posts) {
            if (!this.settings.showReblogged && post.isReblogged) {
                post.isVisible = false;
                continue;
            }

            switch(this.settings.filterMode) { 
                case FilterMode.Blacklist: { 
                    post.isVisible = !(this.settings.blacklist.indexOf(post.author) >= 0);
                    break; 
                } 
                case FilterMode.Whitelist: { 
                    post.isVisible = this.settings.whitelist.indexOf(post.author) >= 0;
                    break; 
                } 
                default: { 
                    console.log(`Filter mode ${this.settings.filterMode} is not supported.`);
                    post.isVisible = true;
                    break; 
                } 
             }
        }
    }

    showSettingsPanel(): void {
        this.isSettingsPanelVisible = true;

        this.settingsEditor.blog = this.settings.blog;
        this.settingsEditor.showReblogged = this.settings.showReblogged;
        this.settingsEditor.filterMode = FilterMode[this.settings.filterMode];
        this.settingsEditor.whitelist = this.settings.whitelist.join(", ");
        this.settingsEditor.blacklist = this.settings.blacklist.join(", ");
    }

    hideSettingsPanel(): void {
        this.isSettingsPanelVisible = false;
    }

    applySettings(): void {
        const blog = this.settingsEditor.blog;
        const filterMode = this.settingsEditor.filterMode !== undefined ? this.settingsEditor.filterMode : FilterMode.Blacklist;
        const whitelist = this.settingsEditor.whitelist ? this.settingsEditor.whitelist.split(",").map(x => x.trim()) : []
        const blacklist = this.settingsEditor.blacklist ? this.settingsEditor.blacklist.split(",").map(x => x.trim()) : []

        const isBlogChanged = this.settings.blog !== blog;
        this.settings.blog = blog;
        this.settings.showReblogged = this.settingsEditor.showReblogged;
        this.settings.filterMode = filterMode;
        this.settings.whitelist = whitelist;
        this.settings.blacklist = blacklist;
        this.saveSettings();
        if (isBlogChanged) {
            this.reloadAll(); // только запускаем, но не ждем завершения
        } else {
            this.filterPosts(this.posts);
            if (this.visiblePostCount < PostsPerPage)
                this.loadMore(); // только запускаем, но не ждем завершения
        }
    }

    loadSettings(): void {
        this.settings = new Settings();
        try {
            const settingsString = localStorage.getItem(LocalStorageKey);
            const settings: Settings = settingsString ? JSON.parse(settingsString) : new Settings();
            this.settings.blog = settings.blog;
            this.settings.showReblogged = settings.showReblogged;
            this.settings.filterMode = settings.filterMode;
            this.settings.whitelist = parseStringArray(settings.whitelist, []);
            this.settings.blacklist = parseStringArray(settings.blacklist, []);
        } catch {
            console.error("Could not load settings.");
        }
    }

    saveSettings(): void {
        const settingsString = JSON.stringify(this.settings);
        try {
            localStorage.setItem(LocalStorageKey, settingsString);
        } catch {
            console.error("Could not save settings.");
        }
    }

    private scrollListener = debounce(() => {
        const el = window.document.getElementById('posts_list');
        if (!el) return;
        const scrollTop =
            window.pageYOffset !== undefined
                ? window.pageYOffset
                : (
                      document.documentElement ||
                      document.body.parentNode ||
                      document.body
                  ).scrollTop;
        if (topPosition(el) + el.offsetHeight - scrollTop - window.innerHeight < 10) {
            // console.log("loadMore");
            this.loadMore();
            // const { loadMore, posts, category } = this.props;
            // if (loadMore && posts && posts.size)
            //     loadMore(posts.last(), category);
        }
        // Detect if we're in mobile mode (renders larger preview imgs)
        // const mq = window.matchMedia('screen and (max-width: 39.9375em)');
        // if (mq.matches) {
        //     this.setState({ thumbSize: 'mobile' });
        // } else {
        //     this.setState({ thumbSize: 'desktop' });
        // }
    }, 150);

    private attachScrollListener() {
        window.addEventListener('scroll', this.scrollListener, {
            capture: false,
            passive: true,
        });
        window.addEventListener('resize', this.scrollListener, {
            capture: false,
            passive: true,
        });
        this.scrollListener();
    }

    private detachScrollListener() {
        window.removeEventListener('scroll', this.scrollListener);
        window.removeEventListener('resize', this.scrollListener);
    }
}
