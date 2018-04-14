declare module 'steem' {
    export const api: Api;
    
    interface DiscussionQuery
    {
       tag?: string;
       limit?: number; // (default = 0, max = 100)
       filter_tags?: string[];
       select_authors?: string[]; ///< list of authors to include, posts not by this author are filtered
       select_tags?: string[]; ///< list of tags to include, posts without these tags are filtered
       truncate_body?: number; ///< the number of bytes of the post body to return, 0 for all (default = 0)
       start_author?: string;
       start_permlink?: string;
       parent_author?: string;
       parent_permlink?: string;
    }

    interface Post {
        abs_rshares: string; //"101775123872"
        active: string; //"2018-04-03T09:28:33"
        active_votes: any[];
        allow_curation_rewards: boolean;
        allow_replies: boolean;
        allow_votes: boolean;
        author: string;
        author_reputation: string; //"231583666591"
        author_rewards: number
        beneficiaries: any[];
        body: string;
        body_length: number;
        cashout_time: string; //"2018-04-09T21:27:03"
        category: string;
        children: number;
        children_abs_rshares: string; //"101775123872"
        created: string; //"2018-04-02T21:27:03"
        curator_payout_value: string; //"0.000 SBD"
        depth: number;
        id: number;
        json_metadata: string;
        last_payout: string; //"1970-01-01T00:00:00"
        last_update: string; //"2018-04-03T09:01:12"
        max_accepted_payout: string; //"1000000.000 SBD"
        max_cashout_time: string; //"1969-12-31T23:59:59"
        net_rshares: string; //"101775123872"
        net_votes: number;
        parent_author: string;
        parent_permlink: string;
        pending_payout_value: string; //"0.258 SBD"
        percent_steem_dollars: number;
        permlink: string;
        promoted: string; //"0.000 SBD"
        reblogged_by: any[];
        replies: any[];
        reward_weight: number;
        root_author: string;
        root_permlink: string;
        root_title: string;
        title: string;
        total_payout_value: string; //"0.000 SBD"
        total_pending_payout_value: string; //"0.000 STEEM"
        total_vote_weight: number;
        url: string;
        vote_rshares: string; //"101775123872"
    }

    interface ShortFeedEntry {
        author: string;
        entry_id: number;
        permlink: string;
        reblog_by: string[]
        reblog_on: string; //"1970-01-01T00:00:00"
    }
    
    interface FeedEntry {
        comment: any; // Это НЕ Post, хотя и похоже
        entry_id: number;
        reblog_by: string[];
        reblog_on: string; //"2018-04-03T20:15:09"
    }

    interface ShortBlogEntry {
        blog: string;
        entry_id: number;
        reblog_on: string; //"2018-03-23T10:26:42"
    }
    
    interface BlogEntry extends ShortBlogEntry {
        comment: any; // Это НЕ Post, хотя и похоже
    }

    interface Api {
//     {
//       "api": "database_api",
//       "method": "set_subscribe_callback",
//       "params": ["callback", "clearFilter"]
//     },
//     {
//       "api": "database_api",
//       "method": "set_pending_transaction_callback",
//       "params": ["cb"]
//     },
//     {
//       "api": "database_api",
//       "method": "set_block_applied_callback",
//       "params": ["cb"]
//     },
//     {
//       "api": "database_api",
//       "method": "cancel_all_subscriptions"
//     },
        getTrendingTagsAsync(afterTag: string, limit: number): Promise<any>;
        getTagsUsedByAuthorAsync(author: string): Promise<any>;
        getPostDiscussionsByPayoutAsync(query: DiscussionQuery): Promise<Post[]>;
        getCommentDiscussionsByPayoutAsync(query: DiscussionQuery): Promise<Post[]>;
        getDiscussionsByTrendingAsync(query: DiscussionQuery): Promise<Post[]>;
        // getDiscussionsByTrending30Async(query: DiscussionQuery): Promise<Post[]>; // !
        getDiscussionsByCreatedAsync(query: DiscussionQuery): Promise<Post[]>;
        getDiscussionsByActiveAsync(query: DiscussionQuery): Promise<Post[]>;
        getDiscussionsByCashoutAsync(query: DiscussionQuery): Promise<Post[]>;
        // getDiscussionsByPayoutAsync(query: DiscussionQuery): Promise<Post[]>; // !
        getDiscussionsByVotesAsync(query: DiscussionQuery): Promise<Post[]>;
        getDiscussionsByChildrenAsync(query: DiscussionQuery): Promise<Post[]>;
        getDiscussionsByHotAsync(query: DiscussionQuery): Promise<Post[]>;
        getDiscussionsByFeedAsync(query: DiscussionQuery): Promise<Post[]>; // {"tag":"beetlevc","limit":20,"start_author":"veta-less","start_permlink":"landscape-in-the-style-of-impressionism"}
        getDiscussionsByBlogAsync(query: DiscussionQuery): Promise<Post[]>; // {"tag":"veta-less","limit":20,"start_author":"veta-less","start_permlink":"landscape-in-the-style-of-impressionism"}
        getDiscussionsByCommentsAsync(query: DiscussionQuery): Promise<Post[]>;
        getDiscussionsByPromotedAsync(query: DiscussionQuery): Promise<Post[]>;
        getBlockHeaderAsync(blockNum: number): Promise<any>;
        getBlockAsync(blockNum: number): Promise<any>;
        getOpsInBlockAsync(blockNum: number, onlyVirtual: boolean): Promise<any>;
        getStateAsync(path: string): Promise<any>;
        // getTrendingCategoriesAsync(after: string, limit: number): Promise<any>; // !
        // getBestCategoriesAsync(after: string, limit: number): Promise<any>; // !
        // getActiveCategoriesAsync(after: string, limit: number): Promise<any>; // !
        // getRecentCategoriesAsync(after: string, limit: number): Promise<any>; // !
        getConfigAsync(): Promise<any>;
        getDynamicGlobalPropertiesAsync(): Promise<any>;
        getChainPropertiesAsync(): Promise<any>;
        getFeedHistoryAsync(): Promise<any>;
        getCurrentMedianHistoryPriceAsync(): Promise<any>;
        getWitnessScheduleAsync(): Promise<any>;
        getHardforkVersionAsync(): Promise<any>;
        getNextScheduledHardforkAsync(): Promise<any>;
//     {
//       "api": "account_by_key_api",
//       "method": "get_key_references",
//       "params": ["key"]
//     },
        getAccountsAsync(names: string[]): Promise<any>;        
//     {
//       "api": "database_api",
//       "method": "get_account_references",
//       "params": ["accountId"]
//     },
        lookupAccountNamesAsync(accountNames: string[]): Promise<any>;
        lookupAccountsAsync(lowerBoundName: string, limit: number): Promise<any>;
        getAccountCountAsync(): Promise<any>;
        getConversionRequestsAsync(accountName: string): Promise<any>;
        getAccountHistoryAsync(account: string, from: number, limit: number): Promise<any>;
        getOwnerHistoryAsync(account: string): Promise<any>;
//     {
//       "api": "database_api",
//       "method": "get_recovery_request",
//       "params": ["account"]
//     },
//     {
//       "api": "database_api",
//       "method": "get_escrow",
//       "params": ["from", "escrowId"]
//     },
//     {
//       "api": "database_api",
//       "method": "get_withdraw_routes",
//       "params": ["account", "withdrawRouteType"]
//     },
//     {
//       "api": "database_api",
//       "method": "get_account_bandwidth",
//       "params": ["account", "bandwidthType"]
//     },
        getSavingsWithdrawFromAsync(account: string): Promise<any>;
        getSavingsWithdrawToAsync(account: string): Promise<any>;
        getOrderBookAsync(limit: number): Promise<any>;
        getOpenOrdersAsync(owner: string): Promise<any>;
        // getLiquidityQueueAsync(startAccount: string, limit: number): Promise<any>; // !
//     {
//       "api": "database_api",
//       "method": "get_transaction_hex",
//       "params": ["trx"]
//     },
//     {
//       "api": "database_api",
//       "method": "get_transaction",
//       "params": ["trxId"]
//     },
//     {
//       "api": "database_api",
//       "method": "get_required_signatures",
//       "params": ["trx", "availableKeys"]
//     },
//     {
//       "api": "database_api",
//       "method": "get_potential_signatures",
//       "params": ["trx"]
//     },
//     {
//       "api": "database_api",
//       "method": "verify_authority",
//       "params": ["trx"]
//     },
//     {
//       "api": "database_api",
//       "method": "verify_account_authority",
//       "params": ["nameOrId", "signers"]
//     },
        getActiveVotesAsync(author: string, permlink: string): Promise<any>;
        getAccountVotesAsync(voter: string): Promise<any>;
        getContentAsync(author: string, permlink: string): Promise<any>;
        getContentRepliesAsync(author: string, permlink: string): Promise<any>;
//     {
//       "api": "database_api",
//       "method": "get_discussions_by_author_before_date",
//       "params": ["author", "startPermlink", "beforeDate", "limit"]
//     },
        getRepliesByLastUpdateAsync(startAuthor: string, startPermlink: string, limit: number): Promise<Post[]>; // Вкладка Replies на сайте (при startPermlink = "")
//     {
//       "api": "database_api",
//       "method": "get_witnesses",
//       "params": ["witnessIds"]
//     },
        getWitnessByAccountAsync(accountName: string): Promise<any>;
        getWitnessesByVoteAsync(from: number, limit: number): Promise<any>;
//     {
//       "api": "database_api",
//       "method": "lookup_witness_accounts",
//       "params": ["lowerBoundName", "limit"]
//     },
        getWitnessCountAsync(): Promise<number>;
        getActiveWitnessesAsync(): Promise<string[]>;
        // getMinerQueueAsync(): Promise<any>; // !
        getRewardFundAsync(name: string): Promise<any>;
        getVestingDelegationsAsync(account: string, from: number, limit: number): Promise<any>;
//     {
//       "api": "login_api",
//       "method": "login",
//       "params": ["username", "password"]
//     },
//     {
//       "api": "login_api",
//       "method": "get_api_by_name",
//       "params": ["database_api"]
//     },
        getVersionAsync(): Promise<any>;
        getFollowersAsync(following: string, startFollower: string, followType: any, limit: number): Promise<any>;
        getFollowingAsync(follower: string, startFollowing: string, followType: any, limit: number): Promise<any>;
        getFollowCountAsync(account: string): Promise<any>;
        getFeedEntriesAsync(account: string, entryId: number, limit: number): Promise<ShortFeedEntry[]>;
        getFeedAsync(account: string, entryId: number, limit: number): Promise<FeedEntry[]>; // max limit = 500
        getBlogEntriesAsync(account: string, entryId: number, limit: number): Promise<ShortBlogEntry[]>; // Вкладка Blog на сайте (при entryId = 0). Текст постов не возвращает!
        getBlogAsync(account: string, entryId: number, limit: number): Promise<BlogEntry[]>; // Вкладка Blog на сайте (при entryId = 0). Возвращает в том числе текст постов.
        getAccountReputationsAsync(lowerBoundName: string, limit: number): Promise<any[]>;
        getRebloggedByAsync(author: string, permlink: string): Promise<any>;
        getBlogAuthorsAsync(blogAccount: string): Promise<any>;
//     {
//       "api": "network_broadcast_api",
//       "method": "broadcast_transaction",
//       "params": ["trx"]
//     },
//     {
//       "api": "network_broadcast_api",
//       "method": "broadcast_transaction_with_callback",
//       "params": ["confirmationCallback", "trx"]
//     },
//     {
//       "api": "network_broadcast_api",
//       "method": "broadcast_transaction_synchronous",
//       "params": ["trx"]
//     },
//     {
//       "api": "network_broadcast_api",
//       "method": "broadcast_block",
//       "params": ["b"]
//     },
//     {
//       "api": "network_broadcast_api",
//       "method": "set_max_block_age",
//       "params": ["maxBlockAge"]
//     },
        getTickerAsync(): Promise<any>;
        getVolumeAsync(): Promise<any>;
        getMarketOrderBookAsync(limit: number): Promise<any>; // "method": "get_order_book"
//     {
//       "api": "market_history_api",
//       "method": "get_trade_history",
//       "params": ["start", "end", "limit"]
//     },
        getRecentTradesAsync(limit: number): Promise<any>;
        // getMarketHistoryAsync(bucket_seconds: number, start: any, end: any): Promise<any>; // !
        getMarketHistoryBucketsAsync(): Promise<any>;
    }
}
