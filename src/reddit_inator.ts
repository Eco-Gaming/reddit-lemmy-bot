import { Geddit } from './utils/geddit';

class RedditInator {
	geddit: Geddit;
	subreddit: string;
	constructor(subreddit: string, geddit: Geddit = new Geddit()) {
		this.geddit = geddit;
		this.subreddit = subreddit;
	}

	init() {
		//
	}
}