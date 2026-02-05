import { useSelector, useDispatch } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from '@/rtk/store'
import { login, logout, register } from '@/rtk/slices/authSlice'

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)

  const loginUser = (username: string, password: string) => {
    dispatch(login({ username, password }))
  }

  const registerUser = (username: string, password: string, password_again: string, name: string) => {
    dispatch(register({ username, password, password_again, name }))
  }

  const logoutUser = (token: string) => {
    dispatch(logout(token))
  }

  return { ...auth, loginUser, logoutUser, registerUser }
}

