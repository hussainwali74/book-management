import {
	HttpException,
	HttpStatus,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorEntity } from './dto/author.entity';

@Injectable()
export class AuthorService {
	constructor(
		@InjectRepository(AuthorEntity)
		private authorRepository: Repository<AuthorEntity>,
	) { }

	async create(author: AuthorEntity) {
		try {
			const data = this.authorRepository.create(author);
			return await this.authorRepository.save(data);
		} catch (error) {
			throw new HttpException(error, HttpStatus.NOT_IMPLEMENTED);
		}
	}

	async findOneByConditions(options: any) {
		try {
			const { email } = options;
			let condition;
			if (email) condition =
				{ where: { email } }
			return await this.authorRepository.findOne(condition);
		} catch (error) {
			throw new HttpException(error, HttpStatus.NOT_IMPLEMENTED);
		}
	}

	async findAll() {
		try {
			return await this.authorRepository.find();
		} catch (error) {
			throw new HttpException(error, HttpStatus.NOT_IMPLEMENTED);
		}
	}

	async deleteOne(id: number) {
		try {
			const author = await this.findOneByConditions(id);
			return await this.authorRepository.remove(author);
		} catch (error) {
			throw new HttpException(error, HttpStatus.NOT_IMPLEMENTED);
		}
	}

	async updateOne(id: number, author: AuthorEntity) {
		await this.findOneByConditions(id)
		try {
			return await this.authorRepository.update(id, author);
		} catch (error) {
			throw new HttpException(error, HttpStatus.NOT_IMPLEMENTED);
		}
	}
}