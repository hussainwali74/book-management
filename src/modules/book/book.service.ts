import {
    HttpException,
    HttpStatus,
    Injectable
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookEntity } from './dto/book.entity';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(BookEntity)
        private bookRepository: Repository<BookEntity>,
    ) { }

    async create(book: BookEntity) {
        try {
            const data = this.bookRepository.create(book);
            return await this.bookRepository.save(data);
        } catch (error) {
            throw new HttpException(error, HttpStatus.NOT_IMPLEMENTED);
        }
    }

    async findOneByConditions(conditions: any) {
        try {
            return await this.bookRepository.findOne(conditions);
        } catch (error) {
            throw new HttpException(error, HttpStatus.NOT_IMPLEMENTED);
        }
    }

    async findAll() {
        try {
            return await this.bookRepository.find();
        } catch (error) {
            throw new HttpException(error, HttpStatus.NOT_IMPLEMENTED);
        }
    }

    async deleteOne(id: number) {
        try {
            const book = await this.findOneByConditions(id);
            return await this.bookRepository.remove(book);
        } catch (error) {
            throw new HttpException(error, HttpStatus.NOT_IMPLEMENTED);
        }
    }

    async updateOne(id: number, book: BookEntity) {
        await this.findOneByConditions(id)
        try {
            return await this.bookRepository.update(id, book);
        } catch (error) {
            throw new HttpException(error, HttpStatus.NOT_IMPLEMENTED);
        }
    }
}