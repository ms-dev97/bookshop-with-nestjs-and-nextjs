import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';

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

    return {
      success: true,
      status: 201,
      message: 'User created successfully',
    };
  }

  async findAll() {
    const users = await this.databaseService.user.findMany({
      select: {
        name: true,
        email: true,
      },
    });

    return {
      success: true,
      status: 200,
      data: users,
    };
  }

  async findOne(id: number) {
    const user = await this.databaseService.user.findUniqueOrThrow({
      where: { id },
      select: {
        name: true,
        email: true,
      },
    });

    return {
		success: true,
		status: 200,
		message: '',
		data: user
	};
  }

  update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    return this.databaseService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.databaseService.user.delete({
      where: { id },
    });
  }
}
