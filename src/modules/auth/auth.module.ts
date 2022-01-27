import { forwardRef, Module } from '@nestjs/common';

import { SharedModule } from 'src/shared/shared.module';
import { AuthorModule } from '../author/author.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [SharedModule, forwardRef(() => AuthorModule)],
    providers: [
        JwtStrategy,
        JwtAuthGuard,
        AuthService
    ],
    exports: [AuthService],
    controllers: [
        AuthController
    ],
})
export class AuthModule { }