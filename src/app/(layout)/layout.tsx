
import Auth from "./_auth"
import { ReactNode } from "react"


export default function App({children}: { children: ReactNode }) {
    return <Auth>{children}</Auth>
}