import { RedditInator } from './reddit_inator';
import { Geddit } from './utils/geddit';
import { WatchedSubreddit } from './utils/watched_subreddit';
import { Submission } from './utils/post/submission';

async function fetchPosts(database1: WatchedSubreddit[], database2: Submission[]) {

	database1.push(new WatchedSubreddit('homeassistant', 100, 0));

	const geddit = new Geddit();
	const redditInator = new RedditInator(geddit, database1, database2);
	await redditInator.fetchSubmissions();
}

fetchPosts([], []);