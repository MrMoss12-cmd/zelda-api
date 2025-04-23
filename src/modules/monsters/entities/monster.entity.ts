import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Game } from '../../games/entities/game.entity';

@ObjectType()
export class Monster {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => [String])
  appearances: string[];

  @Field(() => [Game])
  games: Game[];

  @Field({ nullable: true })
  image_url?: string;
}