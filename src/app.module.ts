import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ToDoModule } from './to-do/to-do.module';
import { AuthModule } from './auth/auth.module';
import { ErrorMiddleware } from './middlewares/error.middleware';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
@Module({
  imports: [
    UsersModule,
    ToDoModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
      synchronize: true, // TODO: change to false
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ErrorMiddleware).forRoutes('*');
  }
}
