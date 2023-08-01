import { Geddit } from './utils/geddit';
import { RedditInator } from './reddit_inator';

async function test() {
	const geddit: Geddit = new Geddit();
	const redditInator = new RedditInator(geddit);

	redditInator.watch('homeassistant', 50, 5);
	await redditInator.fetchSubmissions();
}

test();