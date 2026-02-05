"use client"

import * as React from "react"
import { Plus } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tag } from "@/components/ui/tag"

export type TagInputProps = {
  placeholder?: string
  tags: string[]
  setTags: React.Dispatch<React.SetStateAction<string[]>>
  suggestions?: string[]
}

export function TagInput({ placeholder, tags, setTags, suggestions = [] }: TagInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = React.useState("")
  const [open, setOpen] = React.useState(false)
  const [customInputValue, setCustomInputValue] = React.useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    if (e.target.value.length > 0) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue) {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      e.preventDefault()
      removeTag(tags[tags.length - 1])
    }
  }

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
    }
    setInputValue("")
    setCustomInputValue("")
    setOpen(false)
  }

  const removeTag = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag)
    setTags(newTags)
  }

  const handleSuggestionClick = (suggestion: string) => {
    addTag(suggestion)
    inputRef.current?.focus()
  }

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomInputValue(e.target.value)
  }

  const handleCustomInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && customInputValue) {
      e.preventDefault()
      addTag(customInputValue)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Tag key={tag} onRemove={() => removeTag(tag)}>
          {tag}
        </Tag>
      ))}
      <div className="inline-flex">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder ?? "Enter tags..."}
              className="w-[200px]"
            />
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <Command>
              <CommandList>
                <CommandGroup>
                  {suggestions
                    .filter((suggestion) =>
                      suggestion.toLowerCase().includes(inputValue.toLowerCase())
                    )
                    .map((suggestion) => (
                      <CommandItem
                        key={suggestion}
                        onSelect={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
              <div className="p-2">
                <Input
                  placeholder="Add custom tag"
                  value={customInputValue}
                  onChange={handleCustomInputChange}
                  onKeyDown={handleCustomInputKeyDown}
                />
              </div>
            </Command>
          </PopoverContent>
        </Popover>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="ml-2"
          onClick={() => addTag(customInputValue || inputValue)}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add tag</span>
        </Button>
      </div>
    </div>
  )
}

