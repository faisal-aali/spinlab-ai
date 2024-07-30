import { NextResponse } from "next/server";
import util from "util";
// import db from "../../../lib/db";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { AuthOptions } from "next-auth";
import { User } from "@/app/lib/models";
import bcrypt from 'bcrypt'

// const query = util.promisify(db.query).bind(db);

interface CredentialInput {

}
const credentials: Record<string, CredentialInput> = {};

export const authOption: AuthOptions = {
    pages: {
        signIn: '/login',
        signOut: '/login',
    },
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        jwt({ token, user, trigger, session }) {
            if (trigger === 'update') {
                return {
                    ...token,
                    ...session.user
                };
            }
            if (user) {
                // console.log('session.callbacks.user', user.membership, user.plan, user);
                token._id = user._id;
                token.name = user.name;
                token.role = user.role;
            }
            return token
        },
        session({ session, token }) {
            // console.log('callbacks.session.token', token);
            session.user._id = token._id as string;
            session.user.name = token.name as string;
            session.user.role = token.role as string;

            return session;
        }

    },
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    // throw new Error("Missing email or password");
                    return null
                }
                return User.findOne({ email: credentials.email.toLowerCase() })
                    .then((user) => {
                        if (!user) {
                            // throw new Error("Wrong credentials");
                            return null
                        }
                        // console.log('credentialprovider.user', user)
                        if (user.password) {
                            return user.password === bcrypt.hashSync(credentials.password, process.env.BCRYPT_SALT as string) ? user : null;
                        } else {
                            // throw new Error("No password found for user");
                            return null
                        }
                    }).catch(err => {
                        console.error("Database query error:", err);
                        // throw new Error("Database error");
                        return null
                    })
            },
            credentials: credentials
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            profile: async (profile) => {
                console.log('[googleOAuth] profile', profile)
                const email = profile.email.toLowerCase();
                return User.findOne({ email }).then(async (user) => {
                    if (!user) {
                        console.log('[googleOAuth] user with email', email, 'does not exist')
                        return {
                            id: profile.sub,
                            name: profile.name,
                            email: profile.email
                        }
                    } else {
                        return user;
                    }
                }).catch(err => {
                    console.error("Database query error:", err);
                    return null;
                });
            }
        })
    ],
    // secret: 'ZUSytDzLavIUuiWumSbjtRsdDWZKRlPRIbpgFWpwkvColKTLvrKUhjB'
}

const handler = NextAuth(authOption);
export { handler as GET, handler as POST }
