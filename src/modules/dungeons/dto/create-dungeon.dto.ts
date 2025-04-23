import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateDungeonDto {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => [String])
  appearances: string[];
}