import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCredentialsDto } from 'src/dataObjects/user-auth-credentials.dto';
import { User } from 'src/dataObjects/user.entity';
import { CreateUserDto } from 'src/dataObjects/users-create-new.dto';
import { DbRepo } from 'src/dataObjects/dbRepo';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(private dbRepo: DbRepo, private jwtService: JwtService) {}

  async signup(createUserDto: CreateUserDto): Promise<User> {
    return await this.dbRepo.createUser(createUserDto);
  }

  async signin(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessMessage: string }> {
    let message = 'User has NOT been found! Access Denied!';
    const username: string = authCredentialsDto.username;
    const user = await this.dbRepo.userFindByNameAndMatchingPassword(
      authCredentialsDto,
    );
    if (user) {
      message = `The user with User Name: '${user.username}' has been found! Access OK!`
      const typeid = user.typeid
      const payload: UserJWTPayload = {username, typeid}
      const accessMessage: string = await this.jwtService.sign(payload)
      return {accessMessage}
    } else {
      throw new UnauthorizedException('Incorrect login or password')
    }
  }
}
