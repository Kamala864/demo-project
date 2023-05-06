import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;

  @ApiProperty()
  universityId: number | null;

  @ApiProperty()
  professorId: number | null;
}
