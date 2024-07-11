import NextAuth from "next-auth"
import { NextResponse } from "next/server";

import authConfig from "../auth.config";

export const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const protectedRoutes = [
        "/trips",
        "/reservations",
        "/properties",
        "/favorites"
    ];
    const DEFAULT_LOGIN_REDIRECT = "/";

    const isProtectedRoute = protectedRoutes.includes(nextUrl.pathname);

    if (isProtectedRoute) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }

        return NextResponse.next();
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