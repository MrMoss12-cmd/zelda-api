import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Game } from '../../games/entities/game.entity';

@ObjectType()
export class Item {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => [String])
  games_ids: string[];

  @Field(() => [Game])
  games: Game[];
}