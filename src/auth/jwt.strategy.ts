import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { DbRepo } from "src/dataObjects/dbRepo";
import { User } from "src/dataObjects/user.entity";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private dbRepo: DbRepo, private configService: ConfigService) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload: UserJWTPayload): Promise<User> {
        const { username, typeid } = payload
        const users = await this.dbRepo.getUsers({ username })
        const user: User = users[0]

        if (typeid > 2 || Object.keys(user).length <= 0) {
            throw new UnauthorizedException()
        }

        return user
    }
}

