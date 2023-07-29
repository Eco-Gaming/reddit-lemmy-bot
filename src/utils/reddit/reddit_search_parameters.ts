export interface RedditSearchParameters {
    limit: number;
    include_over_18: boolean;
    q: string;
    type?: string;
}