import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from 'src/shared/shared.module';
import { AuthorModule } from '../author/author.module';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { BookEntity } from './dto/book.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            BookEntity
        ]),
        SharedModule,
        AuthorModule
    ],
    controllers: [BookController],
    providers: [
        BookService
    ]
})
export class BookModule { }
