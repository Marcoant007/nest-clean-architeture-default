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

    test('[GET] / questions', async () => {
        const user = await prisma.user.create({
            data: {
                name: 'Marco Teste',
                email: 'marcoteste@gmail.com',
                password: await hash('123456', 8)
            }
        });

        const accessToken = jwt.sign({ sub: user.id });

        await prisma.question.createMany({
            data: [{
                title: 'Question 01',
                slug: 'quetion-01',
                content: 'Question content',
                authorId: user.id
            },
            {
                title: 'Question 02',
                slug: 'quetion-02',
                content: 'Question content',
                authorId: user.id
            },
            {
                title: 'Question 03',
                slug: 'quetion-03',
                content: 'Question content',
                authorId: user.id
            }]
        })

        const response = await request(app.getHttpServer())
            .get('/questions')
            .set('Authorization', `Bearer ${accessToken}`)
            .send();

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            questions: [
                expect.objectContaining({ title: 'Question 01' }),
                expect.objectContaining({ title: 'Question 02' }),
                expect.objectContaining({ title: 'Question 03' }),
            ]
        })
    })
})




