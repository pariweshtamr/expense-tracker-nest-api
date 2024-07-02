import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './schemas/refresh-token.secham';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(RefreshToken.name)
    private RefreshTokenModel: Model<RefreshToken>,
    private jwtService: JwtService,
  ) {}
  async signup(signupData: SignUpDto) {
    const { name, email, password } = signupData;
    // check if user already exists
    const userExists = await this.UserModel.findOne({
      email,
    });
    if (userExists) {
      throw new BadRequestException('Email already in use!');
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    await this.UserModel.create({
      name,
      email,
      password: hashedPassword,
    });
  }

  async signin(credentials: SignInDto) {
    const { email, password } = credentials;
    // find if user exists
    const user = await this.UserModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // generate tokens
    return this.generateUserTokens(user._id);
  }

  async refreshToken(refreshToken: string) {
    const token = await this.RefreshTokenModel.findOne({
      token: refreshToken,
      expiryDate: { $gte: new Date() },
    });
    if (!token) {
      throw new UnauthorizedException();
    }
    return this.generateUserTokens(token.userId);
  }

  async generateUserTokens(userId) {
    const accessToken = this.jwtService.sign({ userId });
    const refreshToken = uuidv4();

    await this.storeRefreshToken(refreshToken, userId);
    return {
      accessToken,
      refreshToken,
    };
  }

  async storeRefreshToken(token: string, userId) {
    // calculate expiry date 3 days from now
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);
    await this.RefreshTokenModel.create({ token, userId, expiryDate });
  }
}
