import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateStaffDto } from './create-staff.dto';
import { IsString, IsArray, IsOptional } from 'class-validator';

@InputType()
export class UpdateStaffDto extends PartialType(CreateStaffDto) {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  worked_on?: string[];

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  image_url?: string;
}