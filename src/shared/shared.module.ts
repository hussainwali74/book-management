import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SharedService } from './shared.service';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.ACCESS_TOKEN_SECRET,
            signOptions: { expiresIn: '1d' },
        }),
    ],
    providers: [SharedService],
    exports: [JwtModule, SharedService],
})
export class SharedModule { }