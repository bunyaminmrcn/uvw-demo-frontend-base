import { Author } from './author';
export interface Post {
    _id?: string;
    title: string;
    content: string;
    createdAt: string;
    author: Author | null;
    tags: string[];
}

export interface WithToken {
    token : string;
}

export interface WithId {
    _id : string;
}

export interface NewPost {
    title: string;
    content: string;
    authorId: string | null;
    tags: string[];
}

export type NewPostRequest = NewPost &  WithToken;
export type UpdatePostRequest = NewPost &  WithToken & WithId; // Assuming NetPost as Post //  we need authorId
export type DeletePostRequest =  WithToken & WithId; // Assuming NetPost as Post //  we need authorId