import * as steem from 'steem'

const MaxRetries: number = 3;

async function retry(f: ()=>Promise<any>): Promise<any> {
    let currentTry: number = 1;
    while (true) {
        try {
            return await f();
        } catch (ex) {
            if (currentTry >= MaxRetries) {
                throw ex;
            } else {
                console.warn(ex);
                console.warn(`Retry ${currentTry}...`);
            }
        }
        currentTry++;
    }
}

export async function getFeedFirstEntryAsync(blog: string): Promise<steem.ShortFeedEntry | null> {
    return await retry(async () => {
        const result = await steem.api.getFeedEntriesAsync(blog, 0, 1);
        if (result && result.length)
            return result[0];
        else
            return null;
    });
}

export async function getDiscussionsByFeedAsync(blog: string, limit: number, startAuthor: string, startPermlink: string): Promise<steem.Post[]> {
    return await retry(async () => {
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
    });
}