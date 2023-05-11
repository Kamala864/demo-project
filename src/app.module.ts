import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from './student/student.module';
import { PrismaModule } from './prisma/prisma.module';
import { CompanyModule } from './company/company.module';
import { UniversityModule } from './university/university.module';
import { ProfessorModule } from './professor/professor.module';
import { ProjectModule } from './project/project.module';
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
  providers: [AppService, PrismaClient],
})
export class AppModule {}
