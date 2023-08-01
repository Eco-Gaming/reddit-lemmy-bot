export interface Submission {
    id: string;
    subreddit: string;
    author: string;
    title: string;
    mediaUrl?: string;
    body: string;
    score: number;
    datetime: Date;
    commentCount: number;
}