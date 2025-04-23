import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateItemDto {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => [String])
  games_ids: string[];
}