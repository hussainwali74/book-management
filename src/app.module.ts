import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorModule } from './modules/author/author.module';
import { BookModule } from './modules/book/book.module';
import { HttpErrorFilter } from './shared/http-error.filter';
import { LoggingInterceptor } from './shared/logging.interceptor';
const configService: ConfigService = new ConfigService()

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: configService.get('DB_HOST'),
      port: +configService.get('DB_PORT'),
      username: configService.get('DB_USERNAME'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_NAME'),
      entities: [__dirname + './**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      //synchronize: true,
      //logging: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),




    AuthorModule,
    BookModule
  ],
  controllers: [AppController],
  providers: [
    AppService,

    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter, //exceptions filter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor, //logging filter
    },
  ],
})
export class AppModule { }
