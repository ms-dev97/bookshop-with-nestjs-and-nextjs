import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';
import { faildSigninResponse, generalResponse } from '../../helpers/responses';

@Injectable()
export class AuthService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly jwtService: JwtService
    ) {}

    async login(email: string, password: string): Promise<any> {
        const user = await this.databaseService.user.findFirst({
            where: { email }
        });

        if (!user) return faildSigninResponse();

        const checkPassword = bcrypt.compare(password, user.password);

        if (!checkPassword) return faildSigninResponse();

        const payload = { sub: user.id.toString, username: user.email };

        return generalResponse({
            success: true,
            status: HttpStatus.OK,
            message: 'User login success.',
            data: {
                access_token: await this.jwtService.signAsync(payload)
            }
        });
    }
}
