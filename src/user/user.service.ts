import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async findOne(email: CreateUserDto['email']): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    return user;
  }

  async login(loginUserDto: LoginUserDto, jwt: JwtService) {
    const userExists = await this.userModel
      .findOne({ email: loginUserDto.email })
      .exec();

    if (userExists?._id) {
      // if (userExists.password === loginUserDto.password) {
      //   const payload = { email: loginUserDto.email };
      //   return {
      //     token: jwt.sign(payload),
      //   };
      // }
      return new HttpException(
        'Incorrect email or password!',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return new HttpException(
      'Incorrect email or password!',
      HttpStatus.UNAUTHORIZED,
    );
  }
}
