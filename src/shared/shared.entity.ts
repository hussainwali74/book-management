import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class SharedEntity {
    @CreateDateColumn({
        type: 'datetime',
        nullable: false,
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at?: Date;

    @UpdateDateColumn({ type: 'datetime', nullable: true, onUpdate: 'NOW()' })
    updated_at?: Date;

    @DeleteDateColumn({ type: 'datetime', default: null })
    deleted_at?: Date;
}