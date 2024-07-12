import { NextResponse } from "next/server";
import util from "util";
import db from "../../../../util/db";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";

const query = util.promisify(db.query).bind(db);

interface CredentialInput {

}
const credentials: Record<string, CredentialInput> = {};

export const authOption: AuthOptions = {
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.firstName = user.firstName
                token.lastName = user.lastName
                token.role = user.role
                token.plan = user.plan
            }
            return token
        },
        async session({ session, token }) {
            session.user.firstName = token.firstName as string;
            session.user.lastName = token.lastName as string;
            session.user.role = token.role as string;
            session.user.plan = token.plan as string;

            // user object returned from above jwt callback.
            return session;
        }
    },
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }
                try {
                    let user = await query(`SELECT * FROM users WHERE email = '${credentials.email}'`);
                    user = user[0];

                    if (!user) {
                        throw new Error("Wrong credentials");
                    }
                    if (user.password) {
                        return user.password === credentials.password ? user : null;
                    } else {
                        throw new Error("No password found for user");
                    }
                } catch (error) {
                    console.error("Database query error:", error);
                    throw new Error("Database error");
                }
            },
            credentials: credentials
        })
    ],
    secret: 'ZUSytDzLavIUuiWumSbjtRsdDWZKRlPRIbpgFWpwkvColKTLvrKUhjB'
}

const handler = NextAuth(authOption);
export { handler as GET, handler as POST }
