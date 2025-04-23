import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsArray, IsOptional } from 'class-validator';

@InputType()
export class CreateStaffDto {
  @Field()
  @IsString()
  name: string;

  @Field(() => [String])
  @IsArray()
  worked_on: string[];

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  image_url?: string;
}