import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Project } from '@prisma/client';

@Injectable()
export class ProjectTrigger {
  @OnEvent('project.created')
  handleProjectCreatedEvent(project: Project) {
    console.log('New project created s:', project);
  }
}
