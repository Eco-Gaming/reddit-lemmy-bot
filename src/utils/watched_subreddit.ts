export class WatchedSubreddit {

	subreddit: string;
	maxPosts: number;

	constructor(subreddit: string, maxPosts: number = 100) {
		this.subreddit = subreddit;
		this.maxPosts = maxPosts;
	}
}