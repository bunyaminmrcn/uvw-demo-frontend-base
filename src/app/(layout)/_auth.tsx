'use client';
import { Sidebar } from "@/components/common/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RootState } from "@/rtk/store";
import { useDispatch, useSelector } from "react-redux";
//import { logout } from '@/rtk/slices/authSlice'
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookie from 'js-cookie';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { logoutUser } = useAuth();
    const router = useRouter();

    const { isAuthenticated, setOK, user } = useSelector((state: RootState) => state.auth);

    const logout = () => {
        //logoutUser(token as string);
        //Cookie.remove('token', { httpOnly: true , domain: 'uvw-demo.youthobby.com', secure: true, sameSite: 'strict'})
        router.replace('/auth/logout')
        //router.replace('/auth/logout');
    }
    useEffect(() => {
        if (!isAuthenticated && setOK) {
            //alert("Redirect")
            router.replace('/auth/login')
        }
    }, [isAuthenticated, setOK])
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center justify-end p-4 bg-white border-b">
                    <div className="flex items-center space-x-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                

                                <DropdownMenuItem onClick={() => {
                                    router.push(`/users/${user?.username}`)
                                }}>My Posts</DropdownMenuItem>
                                <DropdownMenuItem>Support</DropdownMenuItem>
                                <DropdownMenuItem disabled>API</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => {
                                    logout();
                                }}>
                                    Log out
                                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    {children}
                </main>
            </div>
        </div>
    )
}