import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Game {
  @Field(() => ID)
  id: string;

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

  @Field({ nullable: true })
  image_url?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}