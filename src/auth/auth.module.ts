//import { forwardRef, Module } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DbRepo } from 'src/dataObjects/dbRepo';
//import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

const jwtFactory = {
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get('JWT_SECRET'),
    signOptions: {
      expiresIn: configService.get('JWT_EXP_H')
    }
  }),
  inject: [ConfigService]
}

@Module({
  imports: [
    //forwardRef(() => UsersModule),
    JwtModule.registerAsync(jwtFactory),
    PassportModule.register({defaultStrategy: 'jwt'})
  ],
  controllers: [AuthController],
  providers: [AuthService, DbRepo, JwtStrategy],
  exports: [DbRepo, JwtModule, JwtStrategy, PassportModule],
})
export class AuthModule { }
