import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from './student/student.module';
import { PrismaModule } from './prisma/prisma.module';
import { CompanyModule } from './company/company.module';
import { UniversityModule } from './university/university.module';
import { ProfessorModule } from './professor/professor.module';
import { ProjectModule } from './project/project.module';
import { ProjectTrigger } from './triggers/project.trigger';
import { PrismaClient } from '@prisma/client';

@Module({
  imports: [
    StudentModule,
    PrismaModule,
    CompanyModule,
    UniversityModule,
    ProfessorModule,
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaClient, ProjectTrigger],
})
export class AppModule {
  constructor(
    private prisma: PrismaClient,
    private projectTrigger: ProjectTrigger,
  ) {
    this.prisma.$on('beforeExit', async () => {
      await this.prisma.$disconnect();
    });

    // this.prisma.$on('afterDisconnect', async () => {
    //   await this.prisma.$disconnect();
    // });

    this.prisma.$use(async (params, next) => {
      if (params.model === 'Project' && params.action === 'create') {
        await this.projectTrigger.handleProjectCreatedEvent(params.args[0]);
      }

      return next(params);
    });
  }
}
