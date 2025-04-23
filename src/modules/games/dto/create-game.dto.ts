import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateGameDto {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  developer: string;

  @Field()
  publisher: string;

  @Field()
  released_date: string;
}