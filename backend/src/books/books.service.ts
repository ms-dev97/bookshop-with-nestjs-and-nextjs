import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { createdResponse, generalResponse } from 'helpers/responses';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BooksService {
	constructor(private readonly databaseService: DatabaseService) {}

	async create(
		createBookDto: Prisma.BookCreateInput & { authorIds: number[] },
	) {
		const { authorIds, ...data } = createBookDto;
		const book = await this.databaseService.book.create({
			data: {
				...data,
				authors: { connect: authorIds.map((id) => ({ id })) },
			},
		});

		return createdResponse('Book created successfully.');
	}

	async findAll() {
		const books = await this.databaseService.book.findMany();

		return generalResponse({
			success: true,
			status: 200,
			data: books.map((book) => ({ ...book, id: book.id.toString() })),
			message: '',
		});
	}

	async findOne(id: number) {
		const book = await this.databaseService.book.findUnique({
			where: { id },
		});

		return generalResponse({
			success: true,
			status: 200,
			message: '',
			data: book,
		});
	}

	async update(id: number, updateBookDto: Prisma.BookUpdateInput) {
		await this.databaseService.book.update({
			where: { id },
			data: updateBookDto,
		});

		return generalResponse({
			success: true,
			status: 200,
			message: 'Book updated successfully',
			data: null,
		});
	}

	async remove(id: number) {
		await this.databaseService.book.delete({ where: { id } });

		return generalResponse({
			success: true,
			status: 200,
			message: 'Book deleted successfully',
			data: null,
		});
	}
}
