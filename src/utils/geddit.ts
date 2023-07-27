import fetch from "node-fetch";

interface RedditParameters {
    limit: number;
    include_over_18: boolean;
}

interface RedditSearchParams extends RedditParameters{
    type: string;
}

interface RedditOptions {
    after?: string,
    t?: string;
}

interface SubmissionResult {
    after: string;
    posts: any[]; // Replace 'any' with a proper type for the 'posts' array.
}

class Geddit {
    host: string;
    parameters: RedditParameters;
    search_params: RedditSearchParams;
    constructor() {
        this.host = "https://www.reddit.com";
        this.parameters = {
            limit: 25,
            include_over_18: true,
        };
        this.search_params = {
            limit: 25,
            include_over_18: true,
            type: "sr,link,user",
        };
    }

    async getSubmissions(sort: string = "hot", subreddit: string = "", options: RedditOptions = {}): Promise<SubmissionResult | null> {
        const params = new URLSearchParams({
            limit: String(this.parameters.limit),
            include_over_18: String(this.parameters.include_over_18),
            ...options,
        });

        subreddit = subreddit.length > 0 ? "/r/" + subreddit : "";

        try {
            const response = await fetch(this.host + subreddit + `/${sort}.json?` + params);

            if (!response.ok) {
                throw new Error("Request failed");
            }
            
            const json = await response.json();
            const data = json.data;
            
            return {
                after: data.after,
                posts: data.children,
            };
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    async getDomainHot(domain: string, options: RedditParameters = this.parameters) {
        return await fetch(this.host + "/domain/" + domain + "/hot.json?" + new URLSearchParams(options))
            .then(res => res.json())
            .then(json => json.data)
            .then(data => ({
                after: data.after,
                posts: data.children
            }))
            .catch(err => null);
    }

    async getDomainBest(domain, options = this.parameters) {
        return await fetch(this.host + "/domain/" + domain + "/best.json?" + new URLSearchParams(options))
            .then(res => res.json())
            .then(json => json.data)
            .then(data => ({
                after: data.after,
                posts: data.children
            }))
            .catch(err => null);
    }

    async getDomainTop(domain, options = this.parameters) {
        return await fetch(this.host + "/domain/" + domain + "/top.json?" + new URLSearchParams(options))
            .then(res => res.json())
            .then(json => json.data)
            .then(data => ({
                after: data.after,
                posts: data.children
            }))
            .catch(err => null);
    }

    async getDomainNew(domain, options = this.parameters) {
        return await fetch(this.host + "/domain/" + domain + "/new.json?" + new URLSearchParams(options))
            .then(res => res.json())
            .then(json => json.data)
            .then(data => ({
                after: data.after,
                posts: data.children
            }))
            .catch(err => null);
    }

    async getDomainRising(domain, options = this.parameters) {
        return await fetch(this.host + "/domain/" + domain + "/rising.json?" + new URLSearchParams(options))
            .then(res => res.json())
            .then(json => json.data)
            .then(data => ({
                after: data.after,
                posts: data.children
            }))
            .catch(err => null);
    }

    async getDomainControversial(domain, options = this.parameters) {
        return await fetch(this.host + "/domain/" + domain + "/controversial.json?" + new URLSearchParams(options))
            .then(res => res.json())
            .then(json => json.data)
            .then(data => ({
                after: data.after,
                posts: data.children
            }))
            .catch(err => null);
    }

    async getSubreddit(subreddit) {
        return await fetch(this.host + "/r/" + subreddit + "/about.json")
            .then(res => res.json())
            .then(json => json.data)
            .catch(err => null);
    }

    async getSubredditRules(subreddit) {
        return await fetch(this.host + "/r/" + subreddit + "/about/rules.json")
            .then(res => res.json())
            .then(json => json.data)
            .catch(err => null);
    }

    async getSubredditModerators(subreddit) {
        return await fetch(this.host + "/r/" + subreddit + "/about/moderators.json")
            .then(res => res.json())
            .then(json => json.data)
            .then(data = ({
                users: data.children
            }))
            .catch(err => null);
    }

    async getSubredditWikiPages(subreddit) {
        return await fetch(this.host + "/r/" + subreddit + "/wiki/pages.json")
            .then(res => res.json())
            .then(json => json.data)
            .catch(err => null);
    }

    async getSubredditWikiPage(subreddit, page) {
        return await fetch(this.host + "/r/" + subreddit + "/wiki/" + page + ".json")
            .then(res => res.json())
            .then(json => json.data)
            .catch(err => null);
    }

    async getSubredditWikiPageRevisions(subreddit, page) {
        return await fetch(this.host + "/r/" + subreddit + "/wiki/revisions" + page + ".json")
            .then(res => res.json())
            .then(json => json.data.children)
            .catch(err => null);
    }

    async getPopularSubreddits(options = this.parameters) {
        return await fetch(this.host + "/subreddits/popular.json?" + new URLSearchParams(options))
            .then(res => res.json())
            .then(json => json.data)
            .then(data => ({
                after: data.after,
                subreddits: data.children
            }))
            .catch(err => null);
    }

    async getNewSubreddits(options = this.parameters) {
        return await fetch(this.host + "/subreddits/new.json?" + new URLSearchParams(options))
            .then(res => res.json())
            .then(json => json.data)
            .then(data => ({
                after: data.after,
                subreddits: data.children
            }))
            .catch(err => null);
    }

    async getPremiumSubreddits(options = this.parameters) {
        return await fetch(this.host + "/subreddits/premium.json?" + new URLSearchParams(options))
            .then(res => res.json())
            .then(json => json.data)
            .then(data => ({
                after: data.after,
                subreddits: data.children
            }))
            .catch(err => null);
    }

    async getDefaultSubreddits(options = this.parameters) {
        return await fetch(this.host + "/subreddits/default.json?" + new URLSearchParams(options))
            .then(res => res.json())
            .then(json => json.data)
            .then(data => ({
                after: data.after,
                subreddits: data.children
            }))
            .catch(err => null);
    }

    async getPopularUsers(options = this.parameters) {
        return await fetch(this.host + "/users/popular.json?" + new URLSearchParams(options))
            .then(res => res.json())
            .then(json => json.data)
            .then(data => ({
                after: data.after,
                users: data.children
            }))
            .catch(err => null);
    }

    async getNewUsers(options = this.parameters) {
        return await fetch(this.host + "/users/new.json?" + new URLSearchParams(options))
            .then(res => res.json())
            .then(json => json.data)
            .then(data => ({
                after: data.after,
                users: data.children
            }))
            .catch(err => null);
    }

    async searchSubmissions(query, options = {}) {
        options.q = query;
        options.type = "link";

        let params = {
            limit: 25,
            include_over_18: true
        }

        console.log(this.host + "/search.json?" + new URLSearchParams(Object.assign(params, options)));

        return await fetch(this.host + "/search.json?" + new URLSearchParams(Object.assign(params, options)))
            .then(res => res.json())
            .then(json => json.data)
            .then(data => ({
                after: data.after,
                items: data.children
            }))
            .catch(err => null);
    }

    async searchSubreddits(query, options = {}) {
        options.q = query;

        let params = {
            limit: 25,
            include_over_18: true
        }

        return await fetch(this.host + "/subreddits/search.json?" + new URLSearchParams(Object.assign(params, options)))
            .then(res => res.json())
            .then(json => json.data)
            .then(data => ({
                after: data.after,
                items: data.children
            }))
            .catch(err => null);
    }

    async searchUsers(query, options = {}) {
        options.q = query;

        let params = {
            limit: 25,
            include_over_18: true
        }

        return await fetch(this.host + "/users/search.json?" + new URLSearchParams(Object.assign(params, options)))
            .then(res => res.json())
            .then(json => json.data)
            .then(data => ({
                after: data.after,
                items: data.children
            }))
            .catch(err => null);
    }

    async searchAll(query, subreddit = null, options = {}) {
        options.q = query;
        subreddit = subreddit ? "/r/" + subreddit : "";

        let params = {
            limit: 25,
            include_over_18: true,
            type: "sr,link,user",
        }

        return await fetch(this.host + subreddit + "/search.json?" + new URLSearchParams(Object.assign(params, options)))
            .then(res => res.json())
            .then(json => Array.isArray(json) ? ({
                after: json[1].data.after,
                items: json[0].data.children.concat(json[1].data.children)
            }) : ({
                after: json.data.after,
                items: json.data.children
            }))
            .catch(err => null);
    }

    async getSubmission(id) {
        return await fetch(this.host + "/by_id/" + id + ".json")
            .then(res => res.json())
            .then(json => json.data.children[0].data)
            .catch(err => null);
    }

    async getSubmissionComments(id, options = this.parameters) {
        return await fetch(this.host + "/comments/" + id + ".json?" + new URLSearchParams(options))
            .then(res => res.json())
            .then(json => ({
                submission: json[0].data.children[0],
                comments: json[1].data.children
            }))
            .catch(err => null);
    }

    async getSubredditComments(subreddit, options = this.parameters) {
        return await fetch(this.host + "/r/" + subreddit + "/comments.json?" + new URLSearchParams(options))
            .then(res => res.json())
            .then(json => json.data.children)
            .catch(err => null);
    }

    async getUser(username) {
        return await fetch(this.host + "/user/" + username + "/about.json")
            .then(res => res.json())
            .then(json => json.data)
            .catch(err => null);
    }

    async getUserOverview(username, options = this.parameters) {
        return await fetch(this.host + "/user/" + username + "/overview.json?" + new URLSearchParams(options))
            .then(res => res.json())
            .then(json => json.data)
            .then(data => ({
                after: data.after,
                items: data.children
            }))
            .catch(err => null);
    }

    async getUserComments(username, options = this.parameters) {
        return await fetch(this.host + "/user/" + username + "/comments.json?" + new URLSearchParams(options))
            .then(res => res.json())
            .then(json => json.data)
            .then(data => ({
                after: data.after,
                items: data.children
            }))
            .catch(err => null);
    }

    async getUserSubmissions(username, options = this.parameters) {
        return await fetch(this.host + "/user/" + username + "/submitted.json?" + new URLSearchParams(options))
            .then(res => res.json())
            .then(json => json.data)
            .then(data => ({
                after: data.after,
                items: data.children
            }))
            .catch(err => null);
    }

    async getLiveThread(id) {
        return await fetch(this.host + "/live/" + id + "/about.json")
            .then(res => res.json())
            .then(json => json.data)
            .catch(err => null);
    }

    async getLiveThreadUpdates(id, options = this.parameters) {
        return await fetch(this.host + "/live/" + id + ".json?" + new URLSearchParams(options))
            .then(res => res.json())
            .then(json => json.data.children)
            .catch(err => null);
    }


    async getLiveThreadContributors(id, options = this.parameters) {
        return await fetch(this.host + "/live/" + id + "/contributors.json?" + new URLSearchParams(options))
            .then(res => res.json())
            .then(json => json.data.children)
            .catch(err => null);
    }

    async getLiveThreadDiscussions(id, options = this.parameters) {
        return await fetch(this.host + "/live/" + id + "/discussions.json?" + new URLSearchParams(options))
            .then(res => res.json())
            .then(json => json.data.children)
            .catch(err => null);
    }

    async getLiveThreadsNow(options = this.parameters) {
        return await fetch(this.host + "/live/happening_now.json?" + new URLSearchParams(options))
            .then(res => res.json())
            .then(json => json.data.children)
            .catch(err => null);
    }
}

export { Geddit }