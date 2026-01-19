
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding points schemes...');

    // 1. BGMI
    const bgmiEvent = await prisma.event.upsert({
        where: { slug: 'bgmi' },
        update: {},
        create: {
            name: 'BGMI',
            game: 'BGMI',
            date: '7-8 Feb 2026',
            slug: 'bgmi',
            status: 'upcoming'
        }
    });

    console.log(`Ensured BGMI event: ${bgmiEvent.id}`);

    // Standard BGMI Points (10 pt system)
    // 1st: 10, 2nd: 6, 3rd: 5, 4th: 4, 5th: 3, 6th: 2, 7th: 1, 8th: 1
    const bgmiPoints = {
        "1": 10, "2": 6, "3": 5, "4": 4, "5": 3, "6": 2, "7": 1, "8": 1
    };

    // Check if points scheme exists to "pre save" (preserve if exists, else create)
    const existingBgmiScheme = await prisma.pointsScheme.findFirst({
        where: { eventId: bgmiEvent.id }
    });

    if (!existingBgmiScheme) {
        await prisma.pointsScheme.create({
            data: {
                eventId: bgmiEvent.id,
                killPoints: 1,
                placementPoints: JSON.stringify(bgmiPoints)
            }
        });
        console.log('Created BGMI points scheme.');
    } else {
        console.log('BGMI points scheme already exists. Preserving.');
    }

    // 2. Free Fire
    const ffEvent = await prisma.event.upsert({
        where: { slug: 'freefire' },
        update: {},
        create: {
            name: 'Free Fire MAX',
            game: 'Free Fire',
            date: '7-8 Feb 2026',
            slug: 'freefire',
            status: 'upcoming'
        }
    });

    console.log(`Ensured Free Fire event: ${ffEvent.id}`);

    const freeFirePoints = {
        "1": 12, "2": 9, "3": 8, "4": 7, "5": 6, "6": 5, "7": 4, "8": 3, "9": 2, "10": 1
    };

    // Force update Free Fire points as requested
    const existingFfScheme = await prisma.pointsScheme.findFirst({
        where: { eventId: ffEvent.id }
    });

    if (existingFfScheme) {
        await prisma.pointsScheme.update({
            where: { id: existingFfScheme.id },
            data: {
                killPoints: 1, // Assuming 1 per kill, user didn't specify but standard
                placementPoints: JSON.stringify(freeFirePoints)
            }
        });
        console.log('Updated Free Fire points scheme.');
    } else {
        await prisma.pointsScheme.create({
            data: {
                eventId: ffEvent.id,
                killPoints: 1,
                placementPoints: JSON.stringify(freeFirePoints)
            }
        });
        console.log('Created Free Fire points scheme.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
