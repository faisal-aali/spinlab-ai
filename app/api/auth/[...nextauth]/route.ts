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
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
                let user = await query(`SELECT * FROM users WHERE email = '${credentials.email}'`);
                user = user[0];

                if (!user) {
                   throw new Error("wrong credentials");
                    return null;
                }
                if (user.password) {
                    console.log(user.password);
                    return user.password === credentials.password ? user : null;
                  
                }
              
            },
            credentials: credentials 
        })
    ],
    secret: 'ZUSytDzLavIUuiWumSbjtRsdDWZKRlPRIbpgFWpwkvColKTLvrKUhjB'
}

const handler = NextAuth(authOption);
export { handler as GET, handler as POST }
