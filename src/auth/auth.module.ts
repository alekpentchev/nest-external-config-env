//import { forwardRef, Module } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DbRepo } from 'src/dataObjects/dbRepo';
//import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

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
    JwtModule.registerAsync(jwtFactory)
  ],
  controllers: [AuthController],
  providers: [AuthService, DbRepo],
  exports: [DbRepo, JwtModule],
})
export class AuthModule { }
