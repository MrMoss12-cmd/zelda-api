import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Game } from '../../games/entities/game.entity';
import { Dungeon } from '../../dungeons/entities/dungeon.entity';

@ObjectType()
export class Boss {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => [String])
  appearances: string[];

  @Field(() => [String])
  dungeons: string[];

  @Field(() => [Game])
  games: Game[];

  @Field(() => [Dungeon])
  dungeon: Dungeon[];

  @Field({ nullable: true })
  image_url?: string;
}