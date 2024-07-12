import { db } from "@/libs/prismadb";

export interface IListingsParams {
    userId?: string;
    guestCount?: number;
    roomCount?: number;
    bathroomCount?: number;
    startDate?: string;
    endDate?: string;
    locationValue?: string;
    category?: string;
}

export default async function getListings(
    params: IListingsParams
) {
    try {
        let query: any = {};

        if (params?.userId) {
            query.userId = params?.userId;
        }

        if (params?.category) {
            query.category = params?.category;
        }

        if (params?.roomCount) {
            query.roomCount = {
                gte: +params?.roomCount
            }
        }

        if (params?.guestCount) {
            query.guestCount = {
                gte: +params?.guestCount
            }
        }

        if (params?.bathroomCount) {
            query.bathroomCount = {
                gte: +params?.bathroomCount
            }
        }

        if (params?.locationValue) {
            query.locationValue = params?.locationValue;
        }

        if (params?.startDate && params?.endDate) {
            query.NOT = {
                reservations: {
                    some: {
                        OR: [
                            {
                                endDate: { gte: params?.startDate },
                                startDate: { lte: params?.startDate }
                            },
                            {
                                startDate: { lte: params?.endDate },
                                endDate: { gte: params?.endDate }
                            }
                        ]
                    }
                }
            }
        }

        const listings = await db.listing.findMany({
            where: query,
            orderBy: {
                createdAt: 'desc'
            }
        });

        const safeListings = listings.map((listing) => ({
            ...listing,
            createdAt: listing.createdAt.toISOString(),
        }));

        return safeListings;
    } catch (error: any) {
        throw new Error(error);
    }
}