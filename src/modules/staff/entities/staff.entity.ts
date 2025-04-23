import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Game } from '../../games/entities/game.entity';

@ObjectType()
export class Staff {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => [Game])
  worked_on: Game[];

  @Field({ nullable: true })
  image_url?: string;
}