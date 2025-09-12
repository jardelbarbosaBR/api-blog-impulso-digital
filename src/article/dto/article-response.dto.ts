import { User } from 'src/entitys/user.entity';
import { Timestamp } from 'typeorm';

export class ArticeResponseDto {
  title: string;
  content: string;
  author: String;
  status: number;
  createAt: Timestamp;
  updateAt: Timestamp;
}
