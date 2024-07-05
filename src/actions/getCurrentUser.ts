import { db } from "@/libs/prismadb";
import { loggedInUser } from "@/libs/auth";

export default async function getCurrentUser() {
    const user = await loggedInUser();

    try {

        if (user?.email) {
            return null;
        }

        const currentUser = await db.user.findUnique({
            where: {
                email: user?.email as string,
            }
        });

        if (!currentUser) {
            return null;
        }

        return {
            ...currentUser,
            createdAt: currentUser.createdAt.toISOString(),
            updatedAt: currentUser.updatedAt.toISOString(),
            emailVerified:
                currentUser.emailVerified?.toISOString() || null,
        };
    } catch (error: any) {
        return null;
    }
}

