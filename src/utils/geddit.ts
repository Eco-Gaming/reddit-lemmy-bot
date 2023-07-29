// original javascript file: https://github.com/kaangiray26/geddit-app/blob/main/src/js/geddit.js

import { RedditParameters } from './reddit/reddit_parameters';
import { RedditSearchParameters } from './reddit/reddit_search_parameters';
import { RedditSearchResults } from './reddit/reddit_search_results';
import { RedditPosts } from './reddit/reddit_posts';
import { RedditSubreddits } from './reddit/reddit_subreddits';
import { RedditUsers } from './reddit/reddit_users';

import { Search } from './search';

import { Sort } from './sort/sort';
import { SubredditSort } from './sort/subreddit_sort';
import { UserSort } from './sort/user_sort';

declare const fetch: typeof import('undici').fetch;

class Geddit {
	host: string;
	parameters: RedditParameters;
	search_params: RedditParameters;
	constructor() {
		this.host = 'https://www.reddit.com';
		this.parameters = {
			limit: 25,
			include_over_18: true,
		};
		this.search_params = {
			limit: 25,
			include_over_18: true,
			type: 'sr,link,user',
		};
	}

	async getSubmissions(sort: Sort = Sort.HOT, subreddit: string = '', redditParameters: RedditParameters = this.parameters): Promise<RedditPosts | null> {
		if (subreddit.length > 0) subreddit = '/r/' + subreddit;
		return this.processResponse(this.host + subreddit + `/${sort}.json?` + new URLSearchParams(this.parameterValuesToString(redditParameters)), true);
	}

	async getDomain(domain: string, sort: Sort = Sort.HOT, redditParameters: RedditParameters = this.parameters): Promise<RedditPosts | null> {
		return this.processResponse(this.host + '/domain/' + domain + `/${sort}.json?` + new URLSearchParams(this.parameterValuesToString(redditParameters)), true);
	}

	async getSubreddit(subreddit: string): Promise<any | null> {
		return this.processResponse(this.host + '/r/' + subreddit + '/about.json');
	}

	async getSubredditRules(subreddit: string): Promise<any | null> {
		return this.processResponse(this.host + '/r/' + subreddit + '/about/rules.json');
	}

	// This endpoint no longer works, but it was ported over as it still exists in the javascript version
	// async getSubredditModerators(subreddit: string): Promise<any | null> {
	//     const data = this.processResponse(this.host + '/r/' + subreddit + '/about/moderators.json') as any;
	//     return data.children;
	// }

	// TODO: test from here

	async getSubredditWikiPages(subreddit: string): Promise<any | null> {
		return this.processResponse(this.host + '/r/' + subreddit + '/wiki/pages.json');
	}

	async getSubredditWikiPage(subreddit: string, page: string): Promise<any | null> {
		return this.processResponse(this.host + '/r/' + subreddit + '/wiki/' + page + '.json');
	}

	async getSubredditWikiPageRevisions(subreddit: string, page: string): Promise<any | null> {
		const data = await this.processResponse(this.host + '/r/' + subreddit + '/wiki/revisions/' + page + '.json') as any;
		return data.children;
	}

	async getSubreddits(subredditSort: SubredditSort = SubredditSort.POPULAR, redditParameters: RedditParameters = this.parameters): Promise<RedditSubreddits | null> {
		return this.processResponse(this.host + `/subreddits/${subredditSort}.json?` + new URLSearchParams(this.parameterValuesToString(redditParameters)), false, true);
	}

	async getUsers(userSort: UserSort = UserSort.POPULAR, redditParameters: RedditParameters = this.parameters): Promise<RedditUsers | null> {
		return this.processResponse(this.host + `/users/${userSort}.json?` + new URLSearchParams(this.parameterValuesToString(redditParameters)), false, false, true);
	}

	async search(query: string, search: Search = Search.ALL, subreddit: string = '', redditSearchParameters: RedditSearchParameters = { limit: this.parameters.limit, include_over_18: this.parameters.include_over_18, q: query }): Promise<RedditSearchResults | null> {
		redditSearchParameters.q = query;
		if (search == Search.SUBMISSIONS) redditSearchParameters.type = 'link';
		if (search == Search.ALL) redditSearchParameters.type = 'sr,link,user';
		if (search != Search.ALL) subreddit = '';
		if (subreddit.length > 0) subreddit = '/r/' + subreddit;
		return this.processResponse(this.host + `/${search}.json?` + new URLSearchParams(this.parameterValuesToString(redditSearchParameters)), false, false, false, true, (search == Search.ALL ? true : false));
	}

	parameterValuesToString(redditParameters: RedditParameters) {
		const redditParameterStrings: { [key: string]: string } = {};
		for (const [k, v] of Object.entries(redditParameters)) {
			redditParameterStrings[k] = String(v);
		}
		return redditParameterStrings;
	}

	async processResponse(url: string, isPosts: boolean = false, isSubreddits: boolean = false, isUsers: boolean = false, isSearchResults: boolean = false, isSearchAll: boolean = false) {
		try {
			const response = await fetch(url);

			if (!response.ok) {
				throw new Error('Request failed');
			}

			const json = (await response.json()) as any;
			const data = json.data;

			if (isSearchAll) {
				if (Array.isArray(json)) {
					return {
						after: json[1].data.after,
						items: json[0].data.children.concat(json[1].data.children),
					} as RedditSearchResults;
				} else {
					return {
						after: data.after,
						items: data.children,
					} as RedditSearchResults;
				}
			} else if (isSearchResults) {
				return {
					after: data.after,
					items: data.children,
				} as RedditSearchResults;
			} else if (isUsers) {
				return {
					after: data.after,
					users: data.children,
				} as RedditUsers;
			} else if (isSubreddits) {
				return {
					after: data.after,
					subreddits: data.children,
				} as RedditSubreddits;
			} else if (isPosts) {
				return {
					after: data.after,
					posts: data.children,
				} as RedditPosts;
			} else {
				if (data) return data;
				return json;
			}
		} catch (err) {
			console.error(err);
			return null;
		}
	}
}

export { Geddit };