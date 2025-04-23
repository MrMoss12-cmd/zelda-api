import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Game } from '../../games/entities/game.entity';
import { Place } from '../../places/entities/place.entity';

@ObjectType()
export class Character {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  gender?: string;

  @Field({ nullable: true })
  race?: string;

  @Field(() => [String])
  appearances: string[];

  @Field(() => [String])
  inhabitants: string[]; // Added this field to match the schema

  @Field(() => [Game])
  games: Game[];

  @Field(() => [Place])
  places: Place[];
}