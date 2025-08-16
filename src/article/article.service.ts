import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/entitys/article.entity';
import { Repository } from 'typeorm';
import { Status } from 'src/enums/status.enum';
import { ArticeResponseDto } from './dto/article-response.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  //Criar um novo artico
  async create(createArticleDto: CreateArticleDto, req: Request) {
    const authorId = req['user'];

    const article = new Article();
    article.title = createArticleDto.title;
    article.content = createArticleDto.content;
    article.status = Status.DRAFT;
    article.author = authorId.sub;

    await this.articleRepository.save(article);

    return {
      message: 'Artico criado com sucesso',
      data: {
        title: article.title,
        content: article.content,
      },
    };
  }

  //Buscar todos os articos por paginação
  async findAll(page, limit) {
    const articles = await this.articleRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['author'],
      where: {
        status: Status.DRAFT,
      },
    });

    return articles;
  }

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
