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
  async criarNovoArtico(createArticleDto: CreateArticleDto, req: Request) {
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
  async buscarTodosOsArticoPorPagina(page, limit) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    const [articles, total] = await this.articleRepository.findAndCount({
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      order: {
        createAt: 'ASC',
      },
      relations: {
        author: true,
      },
      where: {
        status: Status.PUBLISHED,
      },
      select: {
        idArticle: true,
        title: true,
        content: true,
        author: {
          idUser: true,
          name: true,
        },
        status: true,
        createAt: true,
        updateAt: true,
      },
    });

    const articosPublicosPaginados: ArticeResponseDto[] = articles.map(
      (article) => ({
        title: article.title,
        content: article.content,
        author: article.author.name,
        status: article.status,
        createAt: article.createAt,
        updateAt: article.updateAt,
      }),
    );

    return {
      data: articosPublicosPaginados,
      total,
      page,
      totalPage: Math.ceil(total / limit),
    };
  }

  async buscarTodosMeusRascunhos(page: string, limit: string, req: any) {
    const userId = req['user'];
    console.log(req);
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    const [articles, total] = await this.articleRepository.findAndCount({
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
      where: {
        author: {
          idUser: userId.sub,
        },
        status: Status.DRAFT,
      },
      relations: {
        author: true,
      },
      order: {
        createAt: 'ASC',
      },
      select: {
        idArticle: true,
        title: true,
        content: true,
        author: {
          idUser: true,
          name: true,
        },
        status: true,
        createAt: true,
        updateAt: true,
      },
    });

    const meusRascunhosPaginados: ArticeResponseDto[] = articles.map(
      (article) => ({
        title: article.title,
        content: article.content,
        author: article.author.name,
        status: article.status,
        createAt: article.createAt,
        updateAt: article.updateAt,
      }),
    );

    return {
      data: meusRascunhosPaginados,
      total,
      page: pageNumber,
      totalPage: Math.ceil(total / limitNumber),
    };
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
