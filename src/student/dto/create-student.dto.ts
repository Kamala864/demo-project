import { ApiProperty } from '@nestjs/swagger';
export class CreateStudentDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
}
