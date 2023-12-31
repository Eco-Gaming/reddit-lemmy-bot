// original javascript file: https://github.com/kaangiray26/geddit-app/blob/main/src/js/geddit.js

import { RedditParameters } from './reddit/reddit_parameters';
import { RedditSearchParameters } from './reddit/reddit_search_parameters';
import { RedditItems } from './reddit/reddit_items';
import { RedditSubmissions } from './reddit/reddit_submissions';
import { RedditSubreddits } from './reddit/reddit_subreddits';
import { RedditUsers } from './reddit/reddit_users';
import { RedditPost } from './reddit/reddit_post';

import { Search } from './search';

import { Sort } from './sort/sort';
import { SubredditSort } from './sort/subreddit_sort';
import { UserSort } from './sort/user_sort';

import { UserPage } from './user_page';
import { TopType } from './sort/top_type';

declare const fetch: typeof import('undici').fetch;

// Submission: content only
// Comments: comments
// Post: both submission and comments

class Geddit {
	host: string;
	parameters: RedditParameters;
	search_params: RedditParameters;
	constructor(parameters: RedditParameters = { limit: 25, include_over_18: true }) {
		this.host = 'https://www.reddit.com';
		this.parameters = parameters;
		this.search_params = {
			limit: this.parameters.limit,
			include_over_18: this.parameters.include_over_18,
			type: 'sr,link,user',
		};
	}

	async getSubmissions(subreddit: string = '', sort: Sort = Sort.HOT, topType: TopType = TopType.ALL_TIME, redditParameters: RedditParameters = this.parameters): Promise<RedditSubmissions | null> {
		if (subreddit.length > 0) subreddit = '/r/' + subreddit;
		if (sort == Sort.TOP && !('t' in redditParameters)) redditParameters.t = topType;
		return this.processResponse(this.host + subreddit + `/${sort}.json?` + new URLSearchParams(this.parameterValuesToString(redditParameters)), true);
	}

	async getDomain(domain: string, sort: Sort = Sort.HOT, topType: TopType = TopType.ALL_TIME, redditParameters: RedditParameters = this.parameters): Promise<RedditSubmissions | null> {
		if (sort == Sort.TOP && !('t' in redditParameters)) redditParameters.t = topType;
		return this.processResponse(this.host + '/domain/' + domain + `/${sort}.json?` + new URLSearchParams(this.parameterValuesToString(redditParameters)), true);
	}

	async getSubreddit(subreddit: string): Promise<any | null> {
		return this.processResponse(this.host + '/r/' + subreddit + '/about.json');
	}

	async getSubredditRules(subreddit: string): Promise<any | null> {
		return this.processResponse(this.host + '/r/' + subreddit + '/about/rules.json');
	}

	// This endpoint no longer works (403), but it was ported over as it still exists in the javascript version
	// async getSubredditModerators(subreddit: string): Promise<any | null> {
	//     const data = this.processResponse(this.host + '/r/' + subreddit + '/about/moderators.json') as any;
	//     return data.children;
	// }

	async getSubredditWikiPages(subreddit: string): Promise<any[] | null> {
		return this.processResponse(this.host + '/r/' + subreddit + '/wiki/pages.json');
	}

	async getSubredditWikiPage(subreddit: string, page: string): Promise<any | null> {
		return this.processResponse(this.host + '/r/' + subreddit + '/wiki/' + page + '.json');
	}

	async getSubredditWikiPageRevisions(subreddit: string, page: string): Promise<any[] | null> {
		const data = await this.processResponse(this.host + '/r/' + subreddit + '/wiki/revisions/' + page + '.json') as any;
		return data ? data.children : null;
	}

	async getSubreddits(subredditSort: SubredditSort = SubredditSort.POPULAR, redditParameters: RedditParameters = this.parameters): Promise<RedditSubreddits | null> {
		return this.processResponse(this.host + `/subreddits/${subredditSort}.json?` + new URLSearchParams(this.parameterValuesToString(redditParameters)), false, true);
	}

	async getUsers(userSort: UserSort = UserSort.POPULAR, redditParameters: RedditParameters = this.parameters): Promise<RedditUsers | null> {
		return this.processResponse(this.host + `/users/${userSort}.json?` + new URLSearchParams(this.parameterValuesToString(redditParameters)), false, false, true);
	}

	async search(query: string, search: Search = Search.ALL, subreddit: string = '', redditSearchParameters: RedditSearchParameters = { limit: this.parameters.limit, include_over_18: this.parameters.include_over_18, q: query }): Promise<RedditItems | null> {
		redditSearchParameters.q = query;
		if (search == Search.SUBMISSIONS) redditSearchParameters.type = 'link';
		if (search == Search.ALL) redditSearchParameters.type = 'sr,link,user';
		if (search != Search.ALL) subreddit = '';
		if (subreddit.length > 0) subreddit = '/r/' + subreddit;
		return this.processResponse(this.host + `/${search}.json?` + new URLSearchParams(this.parameterValuesToString(redditSearchParameters)), false, false, false, true, (search == Search.ALL ? true : false));
	}

	// This endpoint no longer works (404), but it was ported over as it still exists in the javascript version
	// async getSubmission(id: string): Promise<any | null> {
	// 	const data = await this.processResponse(this.host + '/by_id/' + id + '.json') as any;
	// 	return data ? data.children[0].data : null;
	// }

	// in geddit.js: getSubmissionComments()
	async getPost(id: string, redditParameters: RedditParameters = this.parameters): Promise<RedditPost | null> {
		const json = await this.processResponse(this.host + '/comments/' + id + '.json?' + new URLSearchParams(this.parameterValuesToString(redditParameters))) as any;
		return {
			submission: json[0].data.children[0],
			comments: json[1].data.children,
		} as RedditPost;
	}

	async getSubredditComments(subreddit: string, redditParameters: RedditParameters): Promise<any[] | null> {
		const data = await this.processResponse(this.host + '/r/' + subreddit + '/comments.json?' + new URLSearchParams(this.parameterValuesToString(redditParameters))) as any;
		return data ? data.children : null;
	}

	async getUser(username: string, userPage: UserPage = UserPage.ABOUT, redditParameters: RedditParameters = this.parameters): Promise<any | RedditItems | null> {
		let url = this.host + '/user/' + userPage + '.json';
		if (userPage != UserPage.ABOUT) url += '?' + new URLSearchParams(this.parameterValuesToString(redditParameters));
		const data = await this.processResponse(url) as any;
		if (userPage == UserPage.ABOUT) {
			return data;
		} else {
			return {
				after: data.after,
				items: data.children,
			} as RedditItems;
		}
	}

	// currently missing live threads, which probably won't be added any time soon as they aren't important for this project

	parameterValuesToString(redditParameters: RedditParameters) {
		const redditParameterStrings: { [key: string]: string } = {};
		for (const [k, v] of Object.entries(redditParameters)) {
			redditParameterStrings[k] = String(v);
		}
		return redditParameterStrings;
	}

	async processResponse(url: string, isSubmissions: boolean = false, isSubreddits: boolean = false, isUsers: boolean = false, isSearchResults: boolean = false, isSearchAll: boolean = false) {
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
					} as RedditItems;
				} else {
					return {
						after: data.after,
						items: data.children,
					} as RedditItems;
				}
			} else if (isSearchResults) {
				return {
					after: data.after,
					items: data.children,
				} as RedditItems;
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
			} else if (isSubmissions) {
				return {
					after: data.after,
					submissions: data.children,
				} as RedditSubmissions;
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