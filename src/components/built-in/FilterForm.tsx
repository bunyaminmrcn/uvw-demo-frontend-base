'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"

import { Filter } from 'lucide-react'
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import React, { useState } from "react";

type FilterPageProps = {
    authors: string[];
    allTags: string[];
}

export default (props: FilterPageProps) => {
    const { authors, allTags } = props;
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [authorStr, setAuthor] = useState<string | null>(null);

    // Handler to toggle a tag's checked state
    const handleCheckboxChange = (tag: string, isChecked: boolean) => {
        setSelectedTags((prevTags) => {
            return isChecked ? (prevTags.find(a => a == tag) ? [...prevTags] : [...prevTags, tag]) : prevTags.filter((t) => t !== tag)
        });
    };
    const router = useRouter()
    const updateURL = React.useCallback(() => {
        let prefix = '?';
        let queryString = '';
        if (authorStr) {
            queryString += `authorName=${authorStr}`
        }
        if (selectedTags.length >= 1) {
            const suffix = `tags=${selectedTags.join(',')}`;
            queryString += (queryString != '') ? `&${suffix}` : suffix;
        }
        router.replace(`/dashboard/${prefix}${queryString}`)
    }, [authorStr, selectedTags])

    return (<>
        <Select onValueChange={(val) => {

            setAuthor(val)
        }}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by author" />
            </SelectTrigger>
            <SelectContent>
                {authors.map((author: string) => (
                    <SelectItem key={author} value={author}>
                        {author}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter by tags
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-4">
                <div className="space-y-2">
                    {allTags.map((tag: string) => (
                        <div key={tag} className="flex items-center">
                            <Checkbox id={tag} onCheckedChange={(checked: boolean) =>
                                handleCheckboxChange(tag, checked)
                            } />
                            <label
                                htmlFor={tag}
                                className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {tag}
                            </label>
                        </div>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
        <Button variant={'outline'} onClick={() => {
            updateURL();
        }}>Apply Filter</Button>
    </>
    )
}