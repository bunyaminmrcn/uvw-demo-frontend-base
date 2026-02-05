'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from "next/navigation"
import { resetRedirect } from "@/rtk/slices/authSlice"
import type { AppDispatch } from "@/rtk/store"
import { useDispatch } from "react-redux"

export default function RegisterForm() {
    const dispacth = useDispatch<AppDispatch>();

    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [password_again, setConfirmPassword] = useState('')
    const router = useRouter();
    const { registerUser, loading, error, isAuthenticated, redirect } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // Handle registration logic here
        console.log('Registration attempt with:', { name, username, password, password_again })
        registerUser(username, password, password_again, name)
    }

    useEffect(() => {
        if (redirect) {
            dispacth(resetRedirect());
            router.push(redirect as string)
        }
    }, [redirect])
    return (
        <>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="username"
                        type="text"
                        placeholder="johndoe"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                        id="confirm-password"
                        type="password"
                        required
                        value={password_again}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <Button type="submit" className="w-full">
                    Register
                </Button>
                <div className="flex justify-end items-center">
                    <Button variant={"link"} onClick={(evt) => {
                        evt.preventDefault();
                        router.push("/auth/login")
                    }}>
                        Go Login
                    </Button>
                </div>

            </form>
        </>
    )
}

