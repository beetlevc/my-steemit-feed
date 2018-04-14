import * as steem from 'steem'

export async function getFeedFirstEntryAsync(blog: string): Promise<steem.ShortFeedEntry | null> {
    const result = await steem.api.getFeedEntriesAsync(blog, 0, 1);
    if (result && result.length)
        return result[0];
    else
        return null;
}

export async function getDiscussionsByFeedAsync(blog: string, limit: number, startAuthor: string, startPermlink: string): Promise<steem.Post[]> {
    // if (Math.random() > 0.8)
    //     throw new Error("Test error.");
    const query: steem.DiscussionQuery = {
        tag: blog,
        limit: limit,
        start_author: startAuthor,
        start_permlink: startPermlink,
    };
    let result = await steem.api.getDiscussionsByFeedAsync(query);
    return result;
}