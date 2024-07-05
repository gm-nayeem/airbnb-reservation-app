import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"

import { db } from "@/libs/prismadb";
import authConfig from "./auth.config";

export const {
    handlers, auth,
    signIn, signOut,
} = NextAuth({
    pages: {
        signIn: '/',
    },
    callbacks: {
        async signIn({ user, account }) {
            try {
                // if (account?.provider === "credentials") {
                //     return true;
                // }

                // const userInfo = await db.user.findUnique({
                //     where: {
                //         email: user.email as string
                //     }
                // });
                // console.log('userInfo', userInfo);

                // if (!userInfo) {
                //     const newUser = { username: name, email };

                //     if (account.provider === "github") {
                //         newUser.image = profile.avatar_url;
                //     }

                //     if (account.provider === "google") {
                //         newUser.image = profile.picture;
                //     }

                //     await User.create(newUser);
                // }

                return true;
            } catch (err) {
                console.error(err);
                return false
            }
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.email = token.email;
            }

            return session;
        },
        async jwt({ token, user }) {
            if (!token) return token;

            if (user) {
                try {
                    const userInfo = await db.user.findUnique({
                        where: {
                            email: user.email as string
                        }
                    });
                    token.id = userInfo?.id as string;
                    token.email = userInfo?.email as string;
                } catch (err) {
                    console.error(err);
                }
            }
            return token;
        },
    },
    adapter: PrismaAdapter(db),
    session: { strategy: 'jwt' },
    secret: process.env.NEXTAUTH_SECRET,
    ...authConfig,
});