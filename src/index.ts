import { Geddit } from './utils/geddit';

async function test() {
	const geddit: Geddit = new Geddit();
	const posts = await geddit.getPost('15cb2e6');

	console.log(posts?.submission.data.title);

	// iterate over all comments, last one is the 'more' button
	for (let i = 0; i < (posts?.comments.length as number) - 1; i++) {
		console.log(posts?.comments[i].data.body);
	}

	const pages = await geddit.getSubredditWikiPages('AskReddit');

	if (pages) {
		console.log(pages[0]);
	}
}

test();