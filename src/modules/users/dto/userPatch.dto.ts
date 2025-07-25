import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsDateString, // 👈 Вместо IsDate
  IsPhoneNumber,
  IsString,
  IsBoolean,
} from 'class-validator';

export class UserPatchDto {
  @IsNotEmpty()
  @MaxLength(64)
  @ApiProperty({ description: 'User name', nullable: false })
  name: string;

  @IsNotEmpty()
  @MaxLength(64)
  @ApiProperty({ description: 'User surname', nullable: false })
  surName: string;

  @IsNotEmpty()
  @MaxLength(130)
  @ApiProperty({ description: 'User full name', nullable: false })
  fullName: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'User birthday',
    nullable: true,
    type: String,
    format: 'date-time',
  })
  birthDate?: string;

  @IsOptional()
  @IsPhoneNumber('RU')
  @ApiProperty({ description: 'User phone', nullable: true })
  telephone?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'User employment', nullable: true })
  employment?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: 'User agreement', nullable: true })
  userAgreement?: boolean;
}
