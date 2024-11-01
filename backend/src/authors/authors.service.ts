import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';
import { createdResponse, generalResponse } from 'helpers/responses';

@Injectable()
export class AuthorsService {
	constructor(private readonly databaseService: DatabaseService) {}

	async create(createAuthorDto: Prisma.AuthorCreateInput) {
		await this.databaseService.author.create({ data: createAuthorDto });
		return createdResponse('Author created successfully.');
	}

	async findAll() {
		const authors = await this.databaseService.author.findMany();

		return generalResponse({
			success: true,
			status: 200,
			data: authors.map((author) => ({
				...author,
				id: author.id.toString(),
			})),
			message: '',
		});
	}

	async findOne(id: number) {
		const author = await this.databaseService.author.findUnique({
			where: { id },
		});

		if (!author) {
			throw new HttpException(
				generalResponse({
					success: false,
					status: 400,
					message: 'Author not found',
					data: null,
				}),
				HttpStatus.BAD_REQUEST,
			);
		}

		return generalResponse({
			success: true,
			status: 200,
			message: '',
			data: { ...author, id: author.id.toString() },
		});
	}

	async update(id: number, updateAuthorDto: Prisma.AuthorUpdateInput) {
		await this.databaseService.author.update({
			where: { id },
			data: updateAuthorDto,
		});

		return generalResponse({
			success: true,
			status: 200,
			message: 'Author updated successfully',
			data: null,
		});
	}

	async remove(id: number) {
		await this.databaseService.author.delete({ where: { id } });
		return generalResponse({
			success: true,
			status: 200,
			message: 'Author deleted successfully',
			data: null,
		});
	}
}
