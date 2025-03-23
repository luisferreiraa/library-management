import { prisma } from "./prisma"
import type { BorrowedBook as PrismaBorrowedBook, Prisma } from "@prisma/client"

export type BorrowedBook = PrismaBorrowedBook
export type BorrowedBookWithRelations = Prisma.BorrowedBookGetPayload<{
    include: {
        barcode: true
        user: true
    }
}>

export async function getBorrowedBooks(): Promise<BorrowedBookWithRelations[]> {
    return prisma.borrowedBook.findMany({
        orderBy: {
            borrowedAt: 'desc',
        },
        include: {
            barcode: true,
            user: true,
        }
    });
}

export async function createBorrowedBook(
    barcodeId: string,
    userId: string,
): Promise<BorrowedBook> {
    // Verificar se o utilizador já tem 3 ou mais empréstimos
    const activeLoansCount = await prisma.borrowedBook.count({
        where: {
            userId: userId,
            isActive: true,
        },
    });

    if (activeLoansCount >= 3) {
        throw new Error("User has reached the maximum limit of borrowed books.");
    }

    // Verificar se o exemplar do livro já está emprestado
    const existingLoan = await prisma.borrowedBook.findFirst({
        where: {
            barcodeId: barcodeId,
            isActive: true,
        },
    });

    if (existingLoan) {
        throw new Error("This book is already borrowed.")
    }


    return prisma.borrowedBook.create({
        data: {
            barcodeId,
            userId,
            dueDate: new Date(new Date().setDate(new Date().getDate() + 14)),
            returnDate: null,
            fineValue: 0,
        },
    })
}

export async function markBookAsReturned(borrowedBookId: string): Promise<BorrowedBook> {
    // Buscar o registo do livro emprestado
    const borrowedBook = await prisma.borrowedBook.findUnique({
        where: { id: borrowedBookId },
    })

    if (!borrowedBook) {
        throw new Error("Borrowed book not found.")
    }

    const today = new Date()
    const dueDate = borrowedBook.dueDate
    let fine = 0;

    // Verificar se existe atraso
    let daysLate = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysLate > 0) {
        // Buscar regras de penalização ordenadas pelo intervalo correto
        const penaltyRules = await prisma.penaltyRule.findMany({
            where: { isActive: true },
            orderBy: { minDaysLate: "asc" },
        });

        if (penaltyRules.length === 0) {
            throw new Error("No active penalty rules found.");
        }

        // Aplicar a penalização conforme as regras definidas
        let remainingDays = daysLate;

        for (const rule of penaltyRules) {
            if (remainingDays > 0 && (rule.maxDaysLate === null || remainingDays >= rule.minDaysLate)) {
                const applicableDays = rule.maxDaysLate
                    ? Math.min(remainingDays, rule.maxDaysLate - rule.maxDaysLate + 1)
                    : remainingDays;

                fine += applicableDays * rule.finePerDay;
                remainingDays -= applicableDays;
            }

            if (remainingDays <= 0) break;
        }
    }

    // Atualizar o registo como devolvido
    return prisma.borrowedBook.update({
        where: { id: borrowedBookId },
        data: {
            returnDate: today,
            fineValue: fine,
            isActive: false,
        },
    });
}

export async function markMultipleBooksAsReturned(borrowedBookIds: string[]): Promise<BorrowedBook[]> {
    const today = new Date();

    // Buscar os livros emprestados
    const borrowedBooks = await prisma.borrowedBook.findMany({
        where: {
            id: { in: borrowedBookIds },  // Filtra pelos IDs fornecidos
        },
    });

    if (borrowedBooks.length === 0) {
        throw new Error("No borrowed books found.");
    }

    const updatedBooks: BorrowedBook[] = [];

    for (const borrowedBook of borrowedBooks) {
        const dueDate = borrowedBook.dueDate;
        let fine = 0;

        // Verificar se existe atraso
        let daysLate = Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysLate > 0) {
            // Buscar regras de penalização ordenadas pelo intervalo correto
            const penaltyRules = await prisma.penaltyRule.findMany({
                where: { isActive: true },
                orderBy: { minDaysLate: "asc" },
            });

            if (penaltyRules.length === 0) {
                throw new Error("No active penalty rules found.");
            }

            // Aplicar a penalização conforme as regras definidas
            let remainingDays = daysLate;

            for (const rule of penaltyRules) {
                if (remainingDays > 0 && (rule.maxDaysLate === null || remainingDays >= rule.minDaysLate)) {
                    const applicableDays = rule.maxDaysLate
                        ? Math.min(remainingDays, rule.maxDaysLate - rule.maxDaysLate + 1)
                        : remainingDays;

                    fine += applicableDays * rule.finePerDay;
                    remainingDays -= applicableDays;
                }

                if (remainingDays <= 0) break;
            }
        }

        // Atualizar cada livro individualmente
        const updatedBook = await prisma.borrowedBook.update({
            where: { id: borrowedBook.id },
            data: {
                returnDate: today,
                fineValue: fine,
                isActive: false,
            },
        });

        updatedBooks.push(updatedBook);
    }

    return updatedBooks;
}











