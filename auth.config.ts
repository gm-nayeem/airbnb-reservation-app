import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

import { db } from '@/libs/prismadb';

const login = async (credentials: any) => {
    try {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) {
            throw new Error('Invalid credentials');
        }

        const user = await db.user.findUnique({
            where: {
                email: credentials.email
            }
        });

        if (!user || !user?.hashedPassword) {
            throw new Error('Invalid credentials');
        }

        const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.hashedPassword
        );

        if (!isCorrectPassword) {
            throw new Error('Invalid credentials');
        }

        return user;
    } catch (err) {
        console.error(err);
        throw new Error("Failed to login!");
    }
};

export default {
    providers: [
        GitHub({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
        Credentials({
            name: 'Credentials',
            id: 'credentials',
            credentials: {
                email: { label: 'email', type: 'email' },
                password: { label: 'password', type: 'password' }
            },
            async authorize(credentials) {
                try {
                    const user = await login(credentials);
                    return user;
                } catch (err) {
                    throw new Error('Something went wrong!');
                }
            }
        })
    ]
} satisfies NextAuthConfig;