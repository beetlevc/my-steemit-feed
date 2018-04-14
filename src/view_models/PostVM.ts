import { CurrentLocale } from '../Translator'
import { SteemitBaseUrl } from '../constants'
import relativeFormat from '../utils/RelativeFormat'
import ExtractContent from '../utils/ExtractContent'
import { formatDecimal, parsePayoutAmount, repLog10 } from '../utils/ParsersAndFormatters'
import proxifyImageUrl from '../utils/ProxifyUrl'
import * as steem from 'steem'

// function calcReputationLog10(reputation: number): number {
//     let multi = (reputation < 0)?-9:9;
//     let rep = Math.log10(Math.abs(reputation)); //The reputation score is based off of a log10 system
//     rep = Math.max(rep - 9, 0);
//     rep *= multi;
//     rep += 25;
//     return Math.floor(rep);
// }

export default class PostVM {
    isVisible: boolean = true;
    readonly imageUrl: string;
    readonly blogSizeImageUrl: string;
    readonly listSizeImageUrl: string;
    readonly description: string;

    get authorUrl(): string {
        return `${SteemitBaseUrl}/@${this.author}`;
    }

    get avatarSmall(): string {
        return `background-image: url("https://steemitimages.com/u/${this.author}/avatar/small");`;
    }

    get categoryUrl(): string {
        return `${SteemitBaseUrl}/trending/${this.category}`;
    }

    get postUrl(): string {
        return `${SteemitBaseUrl}${this.url}`;
    }

    get commentsUrl(): string {
        return `${this.postUrl}#comments`;
    }

    get createdString(): string {
        return this.created.toLocaleString(CurrentLocale);
    }

    get reputationLog10(): number {
        return repLog10(this.reputation);
    }

    get relativeCreated(): string {
        return relativeFormat(this.created);
    }

    get payout(): string[] {
        const max_payout = parsePayoutAmount(this.max_accepted_payout);
        const pending_payout = parsePayoutAmount(this.pending_payout_value);
        const total_author_payout = parsePayoutAmount(this.total_payout_value);
        const total_curator_payout = parsePayoutAmount(this.curator_payout_value);
        let payout = pending_payout + total_author_payout + total_curator_payout;
        if (payout < 0.0) payout = 0.0;
        if (payout > max_payout) payout = max_payout;
        // Show pending payout amount for declined payment posts
        if (max_payout === 0) payout = pending_payout;

        const formattedPayout = formatDecimal(payout, 2, true);
        return formattedPayout;
    }

    get rebloggedByString(): string {
        if (this.reblogged_by && this.reblogged_by.length > 0) {
            return this.reblogged_by.join(", ");
        } else {
            return "";
        }
    }

    get rebloggedByUrl(): string {
        if (this.reblogged_by && this.reblogged_by.length > 0) {
            return `${SteemitBaseUrl}/@${this.reblogged_by[0]}`;
        } else {
            return "";
        }
    }

    get isReblogged(): boolean {
        return this.reblogged_by && this.reblogged_by.length > 0;
    } 

    constructor(
        public readonly author: string, 
        public readonly reputation: number,
        public readonly title: string,
        public readonly permlink: string,
        public readonly url: string,
        public readonly category: string,
        public readonly body: string,
        public readonly created: Date,
        public readonly children: number,
        public readonly votes: number,
        public readonly pending_payout_value: string,
        public readonly max_accepted_payout: string,
        public readonly total_payout_value: string,
        public readonly curator_payout_value: string,
        public readonly json_metadata: string,
        public readonly reblogged_by: string[],
    ) {
        const content = ExtractContent(this.body, this.json_metadata);
        this.imageUrl = content.image_link;
        if (this.imageUrl) {
            this.blogSizeImageUrl = proxifyImageUrl(this.imageUrl, '640x480').replace(
                / /g,
                '%20'
            );
            this.listSizeImageUrl = proxifyImageUrl(
                this.imageUrl,
                '256x512'
            ).replace(/ /g, '%20');
        } else {
            this.blogSizeImageUrl = this.imageUrl;
            this.listSizeImageUrl = this.imageUrl;
        }
        this.description = content.desc;
    }

    static create(post: steem.Post): PostVM {
        return new PostVM(
            post.author, 
            parseInt(post.author_reputation),
            post.title,
            post.permlink,
            post.url,
            // imageUrl,
            post.category,
            post.body,
            new Date(post.created.concat("Z")),
            post.children,
            post.net_votes,
            post.pending_payout_value,
            post.max_accepted_payout,
            post.total_payout_value,
            post.curator_payout_value,
            post.json_metadata,
            post.reblogged_by,
        );
    }
}