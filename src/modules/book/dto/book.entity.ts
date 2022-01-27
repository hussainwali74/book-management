import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { AuthorEntity } from 'src/modules/author/dto/author.entity';
import { SharedEntity } from 'src/shared/shared.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('book')
export class BookEntity extends SharedEntity {

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
        example: 'philosophy',
        nullable: true
    })
    @Column({ length: 160, type: 'varchar', nullable: true, default: null })
    genre: string;

    // book belongs to one author    
    @ApiProperty({ type: () => AuthorEntity, example: 1 })
    @IsOptional()
    @ManyToOne(() => AuthorEntity, (author) => author.books, { eager: true, cascade: ['update'], nullable: true })
    @JoinColumn({ name: 'author_id', referencedColumnName: 'id' })
    author: AuthorEntity;

}