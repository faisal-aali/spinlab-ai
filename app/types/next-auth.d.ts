import NextAuth, { DefaultSession } from "next-auth"
import { IUser } from '../lib/interfaces/users'

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** The user's postal address. */
            firstName: string,
            lastName: string,
            plan: string,
            role: string,
        } & DefaultSession["user"]
    }
    interface User<IUser> { }
}