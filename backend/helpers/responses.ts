import { HttpStatus } from '@nestjs/common';

export function generalResponse({
	success,
	status,
	message,
	data,
}: {
	success: boolean;
	status: number;
	message: string;
	data: any;
}) {
	return {
		success,
		status,
		message,
		data,
	};
}

export function createdResponse(message: string) {
	return {
		success: true,
		status: 201,
		message,
	};
}

export function faildSigninResponse(
	message: string = 'Wrong email or password!',
) {
	return {
		success: false,
		status: HttpStatus.BAD_REQUEST,
		data: null,
		message: message,
	};
}
