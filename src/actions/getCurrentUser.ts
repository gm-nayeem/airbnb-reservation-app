import { db } from "@/libs/prismadb";
import { currentUser } from "@/libs/auth";

export default async function getCurrentUser() {
    const cUser = await currentUser();

    try {
        if (!cUser?.email) {
            return null;
        }

        const userData = await db.user.findUnique({
            where: {
                email: cUser?.email as string,
            }
        });

        if (!userData) {
            return null;
        }

        return {
            ...userData,
            createdAt: userData.createdAt.toISOString(),
            updatedAt: userData.updatedAt.toISOString(),
            emailVerified:
                userData.emailVerified?.toISOString() || null,
        };
    } catch (error: any) {
        return null;
    }
}

