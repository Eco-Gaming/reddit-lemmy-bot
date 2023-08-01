import { Comment } from './comment';
import { Submission } from './submission';

export interface Post {
    submission: Submission;
    comments: Comment[];
}