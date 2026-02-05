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
import { createPost, clearUpdated, updatePost } from "@/rtk/slices/postSlice";

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
import { NewPost, Post } from "@/models/post";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import moment from "moment";

const FormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  content: z.string().min(20, {
    message: "Content must be at least 20 characters.",
  }),
  tags: z.array(z.string())
})


const EditPostForm = ({ post }: { post: Post }) => {
  const { toast } = useToast()
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const { createError, editedPost } = useSelector((state: RootState) => state.post);

  const [addModalOpen, setAddModal] = useState(true);
  const [tags, setTags] = useState<string[]>(post.tags)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: post.title,
      content: post.content,
      tags: post.tags
    },
  })

  useEffect(() => {

    if (editedPost) {
      form.resetField("content");
      form.resetField("title");
      setTags([])
      dispatch(clearUpdated());
      router.push(`/posts/${post._id}`)
      toast({
        title: `Edited post with Id ${editedPost._id}`,
        description: moment(editedPost.createdAt).format(),
        duration: 5000
      })
    }

  }, [editedPost]);

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
    dispatch(updatePost({ _id: post._id || '', title: data.title, content: data.content, tags, authorId: user?._id || null, token: token || '' }));
  }
  return (
    <Sheet open={addModalOpen} onOpenChange={setAddModal} key={"bottom"}>
      <SheetTrigger asChild>
        <Button>Update Post</Button>
      </SheetTrigger>
      <SheetContent side={"bottom"}>
        <SheetHeader>
          <SheetTitle>Edit Post</SheetTitle>
          <SheetDescription>
            Make changes
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
export default EditPostForm;
