import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Game } from '../../games/entities/game.entity';
import { Boss } from '../../bosses/entities/boss.entity';

@ObjectType()
export class Dungeon {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => [String])
  appearances: string[];

  @Field(() => [String])
  boss_ids: string[]; // Added this field to match the schema

  @Field(() => [Game])
  games: Game[];

  @Field(() => [Boss])
  bosses: Boss[];
}