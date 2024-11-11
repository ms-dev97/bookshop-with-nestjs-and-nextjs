import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	ParseIntPipe,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { ParsePricePipe } from './pipes/parse-price.pipe';

@Controller('books')
export class BooksController {
	constructor(private readonly booksService: BooksService) {}

	@Post()
	@UseGuards(AuthGuard)
	create(@Body(ParsePricePipe) createBookDto: Prisma.BookCreateInput & {authorIds: number[]}) {
		return this.booksService.create(createBookDto);
	}

	@Get()
	findAll() {
		return this.booksService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.booksService.findOne(id);
	}

	@Patch(':id')
	@UseGuards(AuthGuard)
	update(@Param('id', ParseIntPipe) id: number, @Body(ParsePricePipe) updateBookDto: Prisma.BookUpdateInput) {
		return this.booksService.update(id, updateBookDto);
	}

	@Delete(':id')
	@UseGuards(AuthGuard)
	remove(@Param('id', ParseIntPipe) id: number) {
		return this.booksService.remove(id);
	}
}
