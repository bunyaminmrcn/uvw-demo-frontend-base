'use client';

import { Post } from "@/models/post";

import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/rtk/store";
import { useRouter } from "next/navigation";
import { Author } from "@/models/author";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { ArrowDownRightFromSquareIcon } from 'lucide-react'

const  NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API as string;
type Params = Promise<{ username: string }>
export default (props: { params: Params}) => {
   
    const { user, token } = useSelector((state: RootState) => state.auth);
    const [posts, setPosts] = useState<Post[] | []>([]);
    const [author, setAuthor] = useState<Author | null>(null);

    const { username } = React.use(props.params);
    const router = useRouter();

    async function getUser(): Promise<Author | Error> {
        if (!token) {
            throw new Error('Authentication token not found')
        }
        const res = await fetch(`${NEXT_PUBLIC_API}/api/users/getByUserName/${username}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            //next: { revalidate: 3600 }, // Revalidate every hour
        })

        if (!res.ok) {
            throw new Error('Failed to fetch posts')
            //return []
           
        }
        const { data } = await res.json();
        //console.log({ data })
        //setAuthor(data)
        return data;
    }
    async function getPosts(userId: string): Promise<Post[]> {
        if (!token) {
            throw new Error('Authentication token not found')
            //return []
        }
        const res = await fetch(`${NEXT_PUBLIC_API}/api/posts/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            //next: { revalidate: 3600 }, // Revalidate every hour
        })

        if (!res.ok) {
            throw new Error('Failed to fetch posts')
            //return []
        }
        const { data } = await res.json();
        //console.log({ data })
        //setPosts(data)
        return data;
    }



    useEffect(() => {
        if (token) {
            getUser().then(async (author: Author | Error) => {
                if(!(author instanceof Error)) {
                    setAuthor(author)
                    const posts = await getPosts(author._id as string)
                    setPosts(posts as Post[])
                }
            })
        }

    }, [token])

    if (!author) {
        return null
    }
    return (<div className="min-h-screen bg-gray-50 py-10 px-6">
        {/* User Profile Section */}
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-6">
                {/* User Avatar */}
                <Avatar>
                    <AvatarImage src="https://placekitten.com/200/200" alt="User Avatar" />
                    <AvatarFallback>{author.name.substring(0, 1)}</AvatarFallback>
                </Avatar>

                {/* User Info */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">{author.name}</h1>
                    <p className="text-gray-600 mt-2">A passionate developer sharing knowledge.</p>
                    <div className="mt-4 flex space-x-3">
                        {(user?._id == author?._id) && <Button variant="default">Edit Profile</Button>}
                        {(user?._id != author?._id) && <Button variant="secondary">Follow</Button>}
                    </div>
                </div>
            </div>
        </div>
        {/* User Posts Section */}
        <div className="mt-8 max-w-4xl mx-auto space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">{author.username}'s Posts</h2>

            {/* Post Cards */}
            <div className="space-y-6">
                {
                    posts && posts.map((post: Post, index: number) => (
                        <Card key={index}>
                            <CardHeader>
                                <h3 className="text-xl font-semibold text-gray-800">{post.title}</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    { post.content }
                                </p>
                            </CardContent>
                            <CardFooter>
                                <div>
                                    <Link href={`/posts/${post._id}`} className="text-indigo-500 text-sm"><ArrowDownRightFromSquareIcon  size={16}/>Go to Post</Link>
                                </div>
                            </CardFooter>
                        </Card>
                    ))
                }

            </div>
        </div>
    </div>
    )
}