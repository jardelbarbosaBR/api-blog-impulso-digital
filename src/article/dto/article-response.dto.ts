import { User } from 'src/entitys/user.entity';
import { Timestamp } from 'typeorm';

export class ArticeResponseDto {
  id: string;
  title: string;
  content: string;
  author: String;
  status: number;
  createAt: Timestamp;
  updateAt: Timestamp;
}
