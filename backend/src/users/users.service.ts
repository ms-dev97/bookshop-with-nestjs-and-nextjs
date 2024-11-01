import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { createdResponse, generalResponse } from 'helpers/responses';

async function hashPassword(password) {
	const saltRounds = 10;
	const hash = await bcrypt.hash(password, saltRounds);
	return hash;
}

@Injectable()
export class UsersService {
	constructor(private readonly databaseService: DatabaseService) {}

	async create(createUserDto: Prisma.UserCreateInput) {
		const password = await hashPassword(createUserDto.password);

		await this.databaseService.user.create({
			data: { ...createUserDto, password },
		});

		return createdResponse('User created successfully');
	}

	async findAll() {
		const users = await this.databaseService.user.findMany({
			select: {
				name: true,
				email: true,
			},
		});

		return generalResponse({
			success: true,
			status: 200,
			data: users,
			message: '',
		});
	}

	async findOne(id: number) {
		const user = await this.databaseService.user.findUniqueOrThrow({
			where: { id },
			select: {
				name: true,
				email: true,
			},
		});

		return generalResponse({
			success: true,
			status: 200,
			message: '',
			data: user,
		});
	}

	async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
		await this.databaseService.user.update({
			where: { id },
			data: updateUserDto,
		});

		return generalResponse({
			success: true,
			status: 200,
			message: 'User updated successfully',
			data: null,
		});
	}

	async remove(id: number) {
		const user = await this.databaseService.user.findFirst({
			where: { id },
		});

		if (!user) {
			throw new HttpException(
				generalResponse({
					success: false,
					status: 400,
					message: 'User not found',
					data: null,
				}),
				HttpStatus.BAD_REQUEST,
			);
		}

		await this.databaseService.user.delete({
			where: { id },
		});

		return generalResponse({
			success: true,
			status: 200,
			message: 'User deleted successfully',
			data: null,
		});
	}
}
