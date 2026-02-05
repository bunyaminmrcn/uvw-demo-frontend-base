'use client'

import { logout } from '@/actions/auth'
import { resetRedirect } from '@/rtk/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/rtk/store';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const { token, redirect } = useSelector((state: RootState) => state.auth);
    const { logoutUser } = useAuth();
    const logoutAction = () => {
        //dispatch(logoutStore())

        logoutUser(token as string)
    }


    useEffect(() => {
        logoutAction()
    }, [])

    useEffect(() => {
        if (redirect) {
            dispatch(resetRedirect())
            router.replace(redirect as string)
        }
    }, [redirect])
    
    return (
        <button
            onClick={() => logoutAction()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
            Logout
        </button>
    )
}