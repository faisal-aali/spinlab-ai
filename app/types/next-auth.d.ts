import NextAuth, { DefaultSession } from "next-auth"
import { IUser } from '../lib/interfaces/users'

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            _id: string,
            firstName: string,
            lastName: string,
            plan: string,
            role: string,
            level: string,
        } & DefaultSession["user"]
    }
    interface User<IUser> { }
}