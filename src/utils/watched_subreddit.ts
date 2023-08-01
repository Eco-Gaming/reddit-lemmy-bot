export class WatchedSubreddit {

	subreddit: string;
	maxPosts: number;
	minScore: number;

	constructor(subreddit: string, maxPosts: number, minScore: number) {
		this.subreddit = subreddit;
		this.maxPosts = maxPosts;
		this.minScore = minScore;
	}
}