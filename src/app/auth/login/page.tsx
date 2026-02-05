'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { useAuth } from '@/hooks/useAuth'
import { useRouter, redirect } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/rtk/store"
export default function LoginForm() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const { loginUser, loading, error } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // Handle login logic here
        console.log('Login attempt with:', { username, password })
        loginUser(username, password)
    }


   
    return (<>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Username</Label>
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
            <Button type="submit" className="w-full">
                Login
            </Button>
            <div className="flex justify-end items-center">
                <Button variant={"link"} onClick={(evt) => {
                    evt.preventDefault();
                    router.push("/auth/register")
                }}>
                    Go Register
                </Button>
            </div>

        </form>
    </>
    )
}

