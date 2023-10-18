import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma-utils/prisma.service';
import { User } from 'src/types/user.type';
import { compareHash, hashPassword } from './central-auth/__utils__/helpers';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { ErrorResponse } from 'src/types/error.type';

export type ValidateUserReturnResponse = Omit<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
      include: {
        meetings: true,
      },
    });

    if (!user) {
      throw new HttpException(
        'Invalid Credentials or You are not registered yet.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordValid = await compareHash(password, user.password);

    if (isPasswordValid) {
      return user;
    } else {
      throw new HttpException(
        'Invalid Crendentials (password is not valid)',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  // create the record
  async createUser(user: CreateUserDto): Promise<User | ErrorResponse> {
    // find given email in the database if the email exists then do not save in database
    const foundEmail = await this.prismaService.user.findFirst({
      where: {
        email: user.email,
      },
    });

    if (foundEmail) {
      // do not save the user in database
      return {
        message: 'User already exists in database',
        errorCode: '400',
      };
    }

    // if everything is fine then save the user in the database
    const hashedPassword = await hashPassword(user.password);
    return await this.prismaService.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
      },
      include: {
        meetings: true,
      },
    });
  }
}
