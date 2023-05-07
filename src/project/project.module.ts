import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaClient } from '@prisma/client';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ProjectTrigger } from 'src/triggers/project.trigger';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [ProjectController],
  providers: [ProjectService, PrismaClient, ProjectTrigger],
})
export class ProjectModule {}
