import {
	ArgumentMetadata,
	BadRequestException,
	Injectable,
	PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParsePricePipe implements PipeTransform {
	transform(value: any) {
		const price = Number(value.price);

		if (isNaN(price)) {
			throw new BadRequestException(
				'Invalid price format. Price must be a number.',
			);
		}

		return { ...value, price };
	}
}
