import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Prisma } from '@prisma/client';

@Controller('authors')
export class AuthorsController {
	constructor(private readonly authorsService: AuthorsService) {}

	@Post()
	@UseGuards(AuthGuard)
	create(@Body() createAuthorDto: Prisma.AuthorCreateInput) {
		return this.authorsService.create(createAuthorDto);
	}

	@Get()
	findAll() {
		return this.authorsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.authorsService.findOne(+id);
	}

	@Patch(':id')
	@UseGuards(AuthGuard)
	update(
		@Param('id') id: string,
		@Body() updateAuthorDto: Prisma.AuthorUpdateInput,
	) {
		return this.authorsService.update(+id, updateAuthorDto);
	}

	@Delete(':id')
	@UseGuards(AuthGuard)
	remove(@Param('id') id: string) {
		return this.authorsService.remove(+id);
	}
}
