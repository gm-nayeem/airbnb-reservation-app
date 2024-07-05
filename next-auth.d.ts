import { JWT } from "next-auth/jwt"
import { type DefaultSession } from "next-auth"

declare module "next-auth/jwt" {
    interface JWT {
        id: string,
        email: string,
    }
}

declare module "next-auth" {
    interface Session {
        user: {
            id: string
        } & DefaultSession["user"]
    }
}