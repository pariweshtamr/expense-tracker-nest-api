import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post()
  async create(@Res() res, @Body() createUserDto: CreateUserDto) {
    try {
      const userExists = await this.userService.findOne(createUserDto.email);

      if (userExists.email) {
        return res.status(HttpStatus.EXPECTATION_FAILED).json({
          status: 'error',
          message: 'User already exists!',
        });
      }
      const newUser = await this.userService.create(createUserDto);

      return res.status(HttpStatus.CREATED).json({
        status: 'success',
        message: 'User created Successfully!',
        newUser,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: 500,
        message: 'Error: User not created!!',
        error: 'Something went wrong!',
      });
    }
  }

  @Post('/login')
  async login(@Res() res, @Body() loginUserDto: LoginUserDto) {
    const token = await this.userService.login(loginUserDto, this.jwtService);
    return res.status(HttpStatus.OK).json(token);
  }
}
