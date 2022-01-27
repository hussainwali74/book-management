import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BookEntity } from 'src/modules/book/dto/book.entity';
import { SharedEntity } from 'src/shared/shared.entity';
import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('author')
export class AuthorEntity extends SharedEntity {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @ApiProperty({
        type: String,
        example: 'CUmar Khan',
    })
    @IsNotEmpty()
    @Column({ length: 60, type: 'varchar' })
    name: string;

    @ApiProperty({
        type: String,
        example: 'manager@xec.com',
        nullable: false
    })
    @Column({ length: 160, type: 'varchar', nullable: false, default: null })
    email: string;

    @ApiProperty({
        type: String,
        example: 'helo',
        nullable: false
    })
    @Column({ length: 110, type: 'varchar', nullable: false, default: null })
    password: string;

    //one author can have many books
    @OneToMany(() => BookEntity, (book) => book.author, { nullable: true })
    books: BookEntity[]

}