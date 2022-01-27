import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        // validating the token
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.ACCESS_TOKEN_SECRET,
        });
    }
    // the payload is already verified at this point and we can simply extract author_id
    async validate(payload: any) {

        // whatever we return from here is going to be injected into the request of any operation that is guarded with authentication
        // we can do a db call and get the user details attach it to the ongoing request.
        let author_id;
        payload.author_id ? author_id = payload.author_id : author_id = payload.id;
        return { author_id, email: payload.email };
    }
}