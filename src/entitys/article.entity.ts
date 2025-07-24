import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Status } from 'src/enums/status.enum';

@Entity({ name: 'articles' })
export class Article {
  @PrimaryGeneratedColumn('uuid')
  idArticle: string;
  @Column({ name: 'title' })
  title: string;
  @Column({ name: 'content', type: 'text' })
  content: string;
  @ManyToOne(() => User, (user) => user.idUser, { nullable: false })
  @JoinColumn({ name: 'authorId' })
  author: User;
  @Column({
    type: 'enum',
    enum: Status,
  })
  status: Status;
  @CreateDateColumn()
  createAt: Timestamp;
  @UpdateDateColumn()
  updateAt: Timestamp;
}
