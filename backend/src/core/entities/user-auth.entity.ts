import { 
    Column, 
    CreateDateColumn, 
    Entity, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn,
    OneToOne,
    JoinColumn
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserAuth {
    @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
    id: number;

    @Column({ name: 'hash_password', type: 'varchar', nullable: true })
    hash_password: string;

    @Column({ name: 'user_id', type: 'int' })
    user_id: number;

    @Column({
        name: "verification_code",
        type: "varchar",
        nullable: true
    })
    verification_code: string;

    @Column({
        name: "verification_code_expires_at",
        type: "timestamp",
        nullable: true
    })
    verification_code_expires_at: Date;

    @Column({
        name: "verification_code_validated_at",
        type: "timestamp",
        nullable: true
    })
    verification_code_validated_at: Date;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updated_at: Date;

    @OneToOne(() => User, (user) => user.userAuth)
    @JoinColumn({ name: 'user_id' })
    user: User;

    constructor(data?: Partial<UserAuth>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}