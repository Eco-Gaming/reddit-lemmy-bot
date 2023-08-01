import { Geddit } from './utils/geddit';
import { RedditInator } from './reddit_inator';
import { WatchedSubreddit } from './utils/watched_subreddit';

async function test() {
	const geddit: Geddit = new Geddit();
	const redditInator = new RedditInator(geddit);

	redditInator.watch(new WatchedSubreddit('homeassistant'));
	redditInator.fetchSubmissions();
}

test();