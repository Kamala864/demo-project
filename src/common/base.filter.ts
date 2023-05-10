import { ApiProperty } from '@nestjs/swagger';

export class BaseFilterDto {
  @ApiProperty({ required: false, default: 0 })
  skip: number;

  @ApiProperty({ required: false, default: 10 })
  take: number;
}
