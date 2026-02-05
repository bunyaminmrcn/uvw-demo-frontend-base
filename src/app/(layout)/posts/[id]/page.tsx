'use client';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import { Post } from "@/models/post";

import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/rtk/store";
import { useRouter } from "next/navigation";
import { deletePost, clearDeleted } from "@/rtk/slices/postSlice";
import { useToast } from "@/hooks/use-toast";
import moment from "moment";
const  NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API as string;
type Params = Promise<{ id: string }>
export default (props: { params: Params}) => {
    //const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const { isAuthenticated, user, token } = useSelector((state: RootState) => state.auth);
    const { deleteError, deletedPost } = useSelector((state: RootState) => state.post);
    const { toast } = useToast()
    const [post, setPost] = useState<Post | null>(null)
    const [open, setOpen] = useState(false)
    const { id } = React.use<{id: string}>(props.params as any);

    const getPost = async (token: string) => {

        const res = await fetch(`${NEXT_PUBLIC_API}/api/posts/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            //next: { revalidate: 3600 }, // Revalidate every hour
        })

        if (!res.ok) {
            //throw new Error('Failed to fetch posts')
            return null
        }
        const { data } = await res.json();
        setPost(data);
    }
    useEffect(() => {
        getPost(token as string);
    }, [token])

    useEffect(() => {
        if (deletedPost) {
            toast({
                title: `Deleted post with Id ${id}`,
                description: moment().format(),
                duration: 5000
            })
            dispatch(clearDeleted());
            router.push(`/users/${user?.username}`)
        }
    }, [deletedPost]);

    if (!post || !isAuthenticated) {
        return
    }
    const deleteRequest = () => {
        dispatch(deletePost({ _id: id, token: token || '' }))
    }

    return (
        <Card className="max-w-2xl mx-auto mt-8">
            <CardHeader>
                <CardTitle>{post?.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-500 mb-4">By {post?.author?.name} on {post?.createdAt}</p>
                <div className="prose">{post?.content}</div>
            </CardContent>
            {isAuthenticated && (user?._id == post?.author?._id) && (
                <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => {
                        router.push(`/posts/${post._id}/edit`)
                    }}>Edit</Button>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant="destructive">Delete</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Are you sure you want to delete this post?</DialogTitle>
                                <DialogDescription>
                                    This action cannot be undone. This will permanently delete your post.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                                <Button variant="destructive" onClick={deleteRequest}>Delete</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardFooter>
            )}
        </Card>
    )
}