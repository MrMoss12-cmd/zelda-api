import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Game } from '../../games/entities/game.entity';
import { Character } from '../../characters/entities/character.entity';

@ObjectType()
export class Place {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => [String])
  appearances: string[];

  @Field({ nullable: true })
  region?: string;

  @Field(() => [Game])
  games: Game[];

  @Field(() => [Character])
  inhabitants: Character[];
}