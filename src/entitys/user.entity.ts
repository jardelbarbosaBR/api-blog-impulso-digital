import { Role } from 'src/enums/role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  idUser: string;
  @Column({ name: 'name' })
  name: string;
  @Column({ name: 'email', unique: true })
  email: string;
  @Column({ name: 'password' })
  password: string;
  @Column({
    type: 'enum',
    enum: Role,
  })
  role: Role;
  @CreateDateColumn()
  createAt: Timestamp;
  @UpdateDateColumn()
  updateAt: Timestamp;
}
