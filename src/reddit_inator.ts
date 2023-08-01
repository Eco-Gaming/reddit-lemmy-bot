import { Geddit } from './utils/geddit';
import { Sort } from './utils/sort/sort';
import { TopType } from './utils/sort/top_type';
import { Submission } from './utils/post/submission';
import { WatchedSubreddit } from './utils/watched_subreddit';

class RedditInator {

	geddit: Geddit;
	subreddits: WatchedSubreddit[];

	fakeDb: Submission[];

	constructor(geddit: Geddit = new Geddit(), subreddits: WatchedSubreddit[] = []) {
		this.geddit = geddit;
		this.subreddits = subreddits;

		this.fakeDb = [];
	}

	watch(subreddit: WatchedSubreddit): void {
		this.subreddits.push(subreddit);
	}

	unwatch(subreddit: WatchedSubreddit): void {
		const index = this.subreddits.indexOf(subreddit);
		if (index !== -1) {
			this.subreddits.splice(index, 1);
		}
	}

	async fetchSubmissions() {
		for (const subreddit of this.subreddits) {
			this.fakeDb = this.fakeDb.concat(await this.fetchSubmissionsLocal(subreddit));
		}
	}

	private async fetchSubmissionsLocal(subreddit: WatchedSubreddit): Promise<Submission[]> {
		const submissions: Submission[] = [];
		const parameters = this.geddit.parameters;

		while (submissions.length < subreddit.maxPosts) {
			const redditSubmissions = await this.geddit.getSubmissions(subreddit.subreddit, Sort.TOP, TopType.DAY, parameters);
			if (redditSubmissions != null) {
				for (const redditSubmission of redditSubmissions.submissions) {
					const submission: Submission = {
						author: redditSubmission.data.author,
						body: redditSubmission.data.selftext,
						commentCount: redditSubmission.data.num_comments,
						datetime: new Date(redditSubmission.data.created_utc * 1000),
						id: redditSubmission.data.id,
						score: redditSubmission.data.score,
						subreddit: redditSubmission.data.subreddit,
						title: redditSubmission.data.title,
					};
					if ('url_overridden_by_dest' in redditSubmission.data) submission.mediaUrl = redditSubmission.data.url;
					submissions.push(submission);
					if (submissions.length >= subreddit.maxPosts) break;
				}
				parameters.after = redditSubmissions.after;
			}
		}
		return submissions;
	}
}

export { RedditInator };