export interface Comment {
    id: string;
    author: string;
    body: string;
    score: number;
    replies: Comment[];
}