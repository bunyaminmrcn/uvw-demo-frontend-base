'use client';

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { createPost, clearNew } from "@/rtk/slices/postSlice";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { TagInput } from "@/components/built-in/TagInput";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/rtk/store";
import { NewPost } from "@/models/post";
import { useRouter } from "next/navigation";
import moment from 'moment';

const FormSchema = z.object({
    title: z.string().min(5, {
        message: "Title must be at least 5 characters.",
    }),
    content: z.string().min(20, {
        message: "Content must be at least 20 characters.",
    }),
    tags: z.array(z.string())
})

import { useToast } from "@/hooks/use-toast"

const AddPostForm = () => {
    const { toast } = useToast()
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { user, token } = useSelector((state: RootState) => state.auth);
    const { createError, newPost } = useSelector((state: RootState) => state.post);

    const [addModalOpen, setAddModal] = useState(false);
    const [tags, setTags] = useState<string[]>([])
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
            content: "",
            tags: []
        },
    })

    useEffect(() => {
        if (newPost) {
            
            toast({
                title: `Added new post with Id ${newPost._id}`,
                description: moment(newPost.createdAt).format(),
                duration: 5000
            })
            form.resetField("content");
            form.resetField("title");
            setTags([])
            dispatch(clearNew());
            setAddModal((prev) => !prev)
            router.replace('/dashboard')
        }

    }, [newPost]);

    function onSubmit(data: z.infer<typeof FormSchema>) {
        /*
        toast({
          title: "You submitted the following values:",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{JSON.stringify(data, null, 2)}</code>
            </pre>
          ),
        })
        */
        dispatch(createPost({ title: data.title, content: data.content, tags, authorId: user?._id || null, token: token || '' }));
    }
    return (
        <Sheet open={addModalOpen} onOpenChange={setAddModal} key={"bottom"}>
            <SheetTrigger asChild>
                <Button>Create Post</Button>
            </SheetTrigger>
            <SheetContent side={"bottom"}>
                <SheetHeader>
                    <SheetTitle>Create Post</SheetTitle>
                    <SheetDescription>
                        Make changes to your profile here. Click save when you're done.
                    </SheetDescription>
                </SheetHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="p-4 sm:col-span-2 lg:col-span-2 md:w-3/5 sm:w-full">
                                <div className="col-span-2  gap-4">
                                    <FormField
                                        control={form.control}
                                        name="title"

                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="shadcn" {...field} className="w-full" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="col-span-2 items-end gap-4">
                                    <FormField
                                        control={form.control}
                                        name="content"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Content</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="shadcn" {...field} className="w-full" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="p-4 sm:col-span-2 lg:col-span-2 md:w-3/5 sm:w-full">
                                <div className="col-span-2 items-start gap-4 mb-5">
                                    <Label htmlFor="tags" className="text-right">
                                        Tags
                                    </Label>
                                    <TagInput tags={tags} setTags={setTags} />
                                </div>
                                <div className="col-span-2 items-start gap-4">
                                    <Button type="submit">Save changes</Button>
                                </div>
                            </div>

                        </div>
                    </form>
                </Form>
                <SheetFooter>
                    {createError && <p className="text-red-500 text-sm">{createError}</p>}
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
export default AddPostForm;
