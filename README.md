# reddit-lemmy-bot

This project has been discontinued, as it is not feasible to transfer comments from reddit to lemmy.

This is supposed to become a bot that will archive certain reddit posts to lemmy, including all comments.

It uses a modified version of [geddit](https://github.com/kaangiray26/geddit) to access data from Reddit.

The concept is to get x top daily submissions from all watched subreddits every 24 hours, which will then be added to a database, together with their comments, ~24 hours after the submission was created. A second program will then take the posts from this database and post them to lemmy.

#### terms used in code:
- Submission: content only
- Comments: comments
- Post: both submission and comments

## Roadmap
- ~~fully translate geddit javascript file to typescript~~ - done
- reddit manager class for logic to determine ie. which posts to download, gettings streams of more than 25 posts, etc. - almost done
- implement error handling
- find out how to interface with lemmy
