import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Client } from 'pg';
import listen from 'pg-listen';
import { PrismaService } from './prisma/prisma.service';
import { ProjectTrigger } from './triggers/project.trigger';
import { listenToNotifications } from './triggers/trigger.listener';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //swagger configuration
  const options = new DocumentBuilder()
    .setTitle('Demo Project')
    .setDescription('Demo project API Description')
    .setVersion('1.0')
    .addTag('demo')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api/v1/docs', app, document);
  listenToNotifications();
  // const projectNotificationService = app.get(ProjectTrigger);
  // await projectNotificationService.listenForProjectMatches();

  // const projectNotificationService = app.get(ProjectTrigger);
  // await projectNotificationService.onModuleInit();
  await app.listen(3000);
}

bootstrap()
  .then(() => {
    console.log(`Server: http://localhost:${process.env.PORT}`);
    console.log(`Swagger: http://localhost:3000/api/v1/docs`);
  })
  .catch((err) => {
    console.log('Error: ', err);
  });
