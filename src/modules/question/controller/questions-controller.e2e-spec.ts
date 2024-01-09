import { AppModule } from "@/app.module";
import { PrismaService } from "@/shared/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from '@nestjs/testing';
import { hash } from "bcryptjs";
import { title } from "process";
import request from 'supertest';

describe('Create question (E2E)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let jwt: JwtService;

    beforeAll(async () => { //createTesting module roda a aplicação apenas para tests
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleRef.createNestApplication();
        prisma = moduleRef.get(PrismaService);
        jwt = moduleRef.get(JwtService);
        await app.init();
    });

    test('[POST] / questions', async () => {
        const user = await prisma.user.create({
            data: {
                name: 'Marco Teste',
                email: 'marcoteste@gmail.com',
                password: await hash('123456', 8)
            }
        });

        const accessToken = jwt.sign({ sub: user.id });

        const response = await request(app.getHttpServer())
            .post('/questions')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                title: 'New Question',
                content: 'Questions Content'
            });

        expect(response.statusCode).toBe(201);

        const questionOnDatabase = await prisma.question.findFirst({
            where: {
                title: 'New Question'
            }
        });

        expect(questionOnDatabase).toBeTruthy();
    })
})