import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateAccountController } from './controller/create-account.controller';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from 'env';

@Module({
  imports: [ConfigModule.forRoot({
    validate: env => envSchema.parse(env),
    isGlobal: true,
  })],
  controllers: [CreateAccountController],
  providers: [PrismaService],
})
export class AppModule { }
