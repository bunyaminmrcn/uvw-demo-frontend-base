'use client';

import EditPostForm from '@/components/built-in/EditPostForm'
import React, { useEffect, useState } from 'react'
import { Post } from '@/models/post'
import { useSelector } from 'react-redux'
import { RootState } from '@/rtk/store'
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface PageProps {
    params: { id: string },
    searchParams: { [key: string]: string | string[] | undefined };
    //postProp: Post | null
}
type Params = Promise<{ id: string }>

const  NEXT_PUBLIC_API = process.env.NEXT_PUBLIC_API as string;
const EditPostPage = (props: { params: Params }) => {
    const [post, setPost] = useState<Post | null>(null)
    const router = useRouter();

    const { user, token } = useSelector((state: RootState) => state.auth);

    const { id } = React.use<{ id: string}>(props.params as any);
    const getPost = async (token: string, id: string) : Promise<any> => {
        //console.log({ token })
        try {
            const res = await fetch(`${NEXT_PUBLIC_API}/api/posts/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                //next: { revalidate: 3600 }, // Revalidate every hour
            })
    
            if (!res.ok) {
                //throw new Error('Failed to fetch posts')
                //return null
            }
            const { data } = await res.json();
            setPost(data);
            return data;
        } catch(error) {
            console.log({error})
            return null
        }
        
    }

    useEffect(() => {
        getPost(token || '', id)
    }, [])
    if (!post) return (<></>);

    return (
        <div className="max-w-2xl mx-auto mt-8">

            <div className='flex justify-evenly items-center'>
                <EditPostForm post={post} />

                <Button onClick={() => {
                    router.push(`/users/${user?.username}`)
                }}> Go to My Posts </Button>
            </div>

        </div>
    )
}

export default EditPostPage;