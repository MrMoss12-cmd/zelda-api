import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateBossDto {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => [String])
  appearances: string[];

  @Field(() => [String])
  dungeons: string[];
}