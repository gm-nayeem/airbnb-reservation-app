import { db } from "@/libs/prismadb";

interface IParams {
    listingId?: string;
    userId?: string;
    authorId?: string;
}

export default async function getReservations(
    params: IParams
) {
    try {
        const query: any = {};

        if (params?.listingId) {
            query.listingId = params?.listingId;
        };

        if (params?.userId) {
            query.userId = params?.userId;
        }

        if (params?.authorId) {
            query.listing = { userId: params?.authorId };
        }

        const reservations = await db.reservation.findMany({
            where: query,
            include: {
                listing: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const safeReservations = reservations.map(
            (reservation) => ({
                ...reservation,
                createdAt: reservation.createdAt.toISOString(),
                startDate: reservation.startDate.toISOString(),
                endDate: reservation.endDate.toISOString(),
                listing: {
                    ...reservation.listing,
                    createdAt: reservation.listing.createdAt.toISOString(),
                },
            }));

        return safeReservations;
    } catch (error: any) {
        throw new Error(error);
    }
}