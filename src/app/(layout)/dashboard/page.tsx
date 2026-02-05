
import { Search } from 'lucide-react'
import Link from "next/link"

import { Post } from '@/models/post'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"


import { Badge } from "@/components/ui/badge"

import { getAuthToken } from '@/helpers/auth-token'
import AddPostForm from '@/components/built-in/AddPostForm'
import { objectToQuery } from '@/helpers/obj-to-query'
import FilterForm from '@/components/built-in/FilterForm'

type SearchParam = {
    content: string | null;
    title: string | null;
    authorName: string | null;
    tags: string | null;
    limit: number | null;
    page: number | null;
}
const  NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API as string;
async function getPosts(query: SearchParam): Promise<Post[]> {
    const queryString = objectToQuery(query);
    const token = await getAuthToken()

    if (!token) {
        //throw new Error('Authentication token not found')
        return []
    }
    const res = await fetch(`${NEXT_PUBLIC_API}/api/posts?${queryString}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },

        //next: { revalidate: 3600 }, // Revalidate every hour
    })

    if (!res.ok) {
        //throw new Error('Failed to fetch posts')
        return []
    }
    const { data } = await res.json();
    //console.log({ data })
    return data || [];
}



export default async function BlogDashboard({ searchParams }: { searchParams: any }) {
    const { title, content, authorName, tags, limit, page } = await searchParams
    const posts = await getPosts({ title, content, authorName, tags, limit, page });
    const authors = [...new Set(posts.map(post => post?.author?.username || ''))]
    const allTags = [...new Set(posts.flatMap(post => post.tags))]
    return (
        <div className="container mx-auto px-6 py-8">

            <div className='w-full flex justify-between items-center  mb-5'>
                <Card className='w-full'>
                    <CardHeader>
                        <CardTitle>Blog Posts</CardTitle>
                        <CardDescription>Filter</CardDescription>
                    </CardHeader>
                    <CardContent className='w-full flex justify-between flex-wrap items-center py-5 mb-5'>
                        <div className="flex items-center space-x-4 w-2/5 pb-5">
                            <Input
                                type="search"
                                placeholder="Search blogs..."
                                className="w-full"
                            />
                            <Search className="w-5 h-5 ml-2 text-gray-500" />
                        </div>
                        <div className="flex items-center space-x-4 pb-5" >
                            
                        </div>
                        <div className="flex items-center space-x-4 pb-5" >
                            <FilterForm authors={authors} allTags={allTags}/>
                        </div>

                    </CardContent>
                </Card>

            </div>
            <div className='w-full flex justify-end items-center  mb-5'>
                <AddPostForm />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts && posts.map((post: Post, index: number) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle>{post.title}</CardTitle>
                            <CardDescription>{post.content.substring(0, 50)}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-gray-600">{post.createdAt} - @<Link href={`/users/${post?.author?.username}`}>{post?.author?.username}</Link></div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <div className="text-sm text-gray-600">By {post?.author?.name}</div>
                            <div className='flex flex-wrap gap-2'>
                                {post.tags.map((tag: string, indexTag: number) => (
                                    <Link href="#" key={indexTag.toString()}><Badge key={tag} variant="secondary">#{tag}</Badge></Link>
                                ))}
                            </div>
                            <div>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/posts/${post?._id}`}>Read More</Link>
                                </Button>
                            </div>?

                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}

