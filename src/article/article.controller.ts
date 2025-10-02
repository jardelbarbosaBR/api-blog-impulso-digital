import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  HttpStatus,
  HttpCode,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from 'src/enums/role.enum';
import { isUUID } from 'class-validator';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.EDITOR)
  @Post()
  createArticles(
    @Body() createArticleDto: CreateArticleDto,
    @Request() req: Request,
  ) {
    return this.articleService.criarNovoArtico(createArticleDto, req);
  }

  @Get()
  async paginationArticles(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return await this.articleService.buscarTodosOsArticoPorPagina(page, limit);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.EDITOR)
  @Get('meus-rascunhos')
  async buscarTodosMeusRascunhosPorPagina(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Request() req: Request,
  ) {
    return await this.articleService.buscarTodosMeusRascunhos(page, limit, req);
  }

  @Get(':id')
  buscarArtigoPorId(@Param('id') id: string, @Request() user: Request) {
    if (!isUUID(id)) {
      throw new BadRequestException('ID inválido');
    }
    return this.articleService.buscarArtigoPorId(id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}
