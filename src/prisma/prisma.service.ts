import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  sql: any;
  async onModuleInit() {
    this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
  async clearDatabase() {
    await this.project.deleteMany();
    await this.student.deleteMany();
    await this.professor.deleteMany();
    await this.university.deleteMany();
    await this.company.deleteMany();
  }
}
