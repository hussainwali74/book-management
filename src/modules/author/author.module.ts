import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from 'src/shared/shared.module';
import { AuthModule } from '../auth/auth.module';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { AuthorEntity } from './dto/author.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AuthorEntity
        ]),
        SharedModule,
        AuthModule,
    ],
    controllers: [AuthorController],
    providers: [
        AuthorService
    ],
    exports: [AuthorService]
})
export class AuthorModule { }
