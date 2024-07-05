import NextAuth from "next-auth"
import { NextResponse } from "next/server";

import authConfig from "./auth.config";

const protectedRoutes = [
    "/trips",
    "/reservations",
    "/properties",
    "/favorites"
];
const DEFAULT_LOGIN_REDIRECT = "/";


export const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isProtectedRoute = protectedRoutes.includes(nextUrl.pathname);

    if (isProtectedRoute) {
        if (isLoggedIn) {
            return NextResponse.next();
        }

        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/((?!.+\\.[\\w]+$|_next).*)",
        "/",
        "/(api|trpc)(.*)"
    ]
};